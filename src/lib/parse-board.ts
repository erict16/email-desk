import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type OrderStageId,
  parseOrderStage,
} from "@/lib/order-stages";
import {
  type Ball,
  type BoardData,
  type BoardItem,
  type BoardSection,
  type Priority,
  isOrderItem,
  isWaitingItem,
  parseBall,
} from "@/lib/board-types";

export type {
  Ball,
  BoardData,
  BoardItem,
  BoardSection,
  Priority,
} from "@/lib/board-types";
export { isOrderItem, isWaitingItem, parseBall } from "@/lib/board-types";

const PRI = new Set(["P0", "P1", "P2", "OK", "FYI", "ORDER"]);
const DEFAULT_TZ = "Asia/Shanghai";

function stripBold(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

function parseItems(block: string): BoardItem[] {
  const chunks = block
    .split(/^###\s+/m)
    .map((c) => c.trim())
    .filter(Boolean);

  const items: BoardItem[] = [];
  for (const chunk of chunks) {
    const lines = chunk.split(/\r?\n/).map((l) => l.trim());
    const title = lines[0] || "Untitled";
    let priority: Priority = "P2";
    let prioritySet = false;
    let meta: string | undefined;
    let action: string | undefined;
    let date: string | undefined;
    let people: string | undefined;
    let tags: string[] | undefined;
    let stage: OrderStageId | undefined;
    let customer: string | undefined;
    let ball: Ball | undefined;
    let wait: string | undefined;

    for (const line of lines.slice(1)) {
      const m = line.match(
        /^-?\s*(priority|meta|action|date|people|tags|stage|customer|next|ball|球|wait|等待)\s*:\s*(.+)$/i,
      );
      if (!m) continue;
      const key = m[1].toLowerCase();
      const val = stripBold(m[2]);
      if (key === "priority") {
        const p = val.toUpperCase();
        if (PRI.has(p)) {
          priority = p as Priority;
          prioritySet = true;
        }
      } else if (key === "meta") meta = val;
      else if (key === "action" || key === "next") action = val;
      else if (key === "date") date = val;
      else if (key === "people") people = val;
      else if (key === "customer") customer = val;
      else if (key === "stage") stage = parseOrderStage(val);
      else if (key === "ball" || key === "球") {
        const b = parseBall(val);
        if (b) ball = b;
      } else if (key === "wait" || key === "等待") {
        if (val) wait = val;
      } else if (key === "tags")
        tags = val
          .split(/[,|]/)
          .map((t) => t.trim())
          .filter(Boolean);
    }

    if (stage && !prioritySet) {
      priority = "ORDER";
    } else if (
      stage &&
      prioritySet &&
      priority !== "P0" &&
      priority !== "P1" &&
      priority !== "P2" &&
      priority !== "FYI"
    ) {
      priority = "ORDER";
    }

    items.push({
      title,
      priority,
      meta,
      action,
      date,
      people,
      tags,
      stage,
      customer,
      ball,
      wait,
    });
  }
  return items;
}

function tzLabel(tz: string): string {
  if (/Shanghai|Beijing|Chongqing|Hong_Kong/i.test(tz)) return "北京时间";
  if (/Singapore/i.test(tz)) return "新加坡时间";
  return "";
}

function formatWallClock(hour24: number, minute: string, tz: string): string {
  const ampm = hour24 >= 12 ? "pm" : "am";
  const h12 = hour24 % 12 || 12;
  const label = tzLabel(tz);
  const clock = `${h12}:${minute} ${ampm}`;
  return label ? `${label} ${clock}` : clock;
}

function formatUpdated(raw: unknown, tz: string): string {
  if (raw == null || raw === "") return "";

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const dayParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(raw);
    const h24 = Number(dayParts.find((p) => p.type === "hour")?.value || 0);
    const minute = dayParts.find((p) => p.type === "minute")?.value || "00";
    return formatWallClock(h24, minute, tz);
  }

  const s = String(raw).trim();
  const m = s.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?$/,
  );
  if (m) {
    if (m[4]) {
      return formatWallClock(Number(m[4]), m[5], tz);
    }
    return `${Number(m[2])}月${Number(m[3])}日`;
  }

  const t = Date.parse(s);
  if (!Number.isNaN(t)) return formatUpdated(new Date(t), tz);
  return s;
}

/** Server-only: reads content/board.md */
export function loadBoard(): BoardData {
  const file = path.join(process.cwd(), "content", "board.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const tz = String(data.tz || DEFAULT_TZ).trim() || DEFAULT_TZ;

  const sectionParts = content
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean);

  const sections: BoardSection[] = [];
  for (const sec of sectionParts) {
    const nl = sec.indexOf("\n");
    const header = (nl === -1 ? sec : sec.slice(0, nl)).trim();
    const body = nl === -1 ? "" : sec.slice(nl + 1);
    const [idPart, titlePart] = header.split("|").map((s) => s.trim());
    const id = (idPart || "col").toLowerCase();
    const title = titlePart || idPart || "Section";
    sections.push({ id, title, items: parseItems(body) });
  }

  const all = sections.flatMap((s) => s.items);

  const isTriage = (i: BoardItem) =>
    i.priority === "P0" || i.priority === "P1" || i.priority === "P2";

  const stats = {
    urgent: all.filter((i) => i.priority === "P0").length,
    follow: all.filter((i) => i.priority === "P1" || i.priority === "P2")
      .length,
    orders: all.filter((i) => isOrderItem(i) && !isTriage(i)).length,
    info: all.filter((i) => i.priority === "FYI").length,
  };

  const meetingsRaw = data.meetings ?? data.priorities;
  const meetings = Array.isArray(meetingsRaw)
    ? meetingsRaw.map(String)
    : [];

  return {
    title: String(data.title || "邮件跟进清单"),
    subtitle: String(data.subtitle || ""),
    updated: formatUpdated(data.updated, tz),
    meetings,
    sections,
    stats,
  };
}
