import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Priority = "P0" | "P1" | "P2" | "OK" | "FYI";

export type BoardItem = {
  title: string;
  priority: Priority;
  meta?: string;
  action?: string;
  date?: string;
  tags?: string[];
  people?: string;
};

export type BoardSection = {
  id: string;
  title: string;
  items: BoardItem[];
};

export type BoardData = {
  title: string;
  subtitle: string;
  updated: string;
  /** Meetings Eric needs to attend */
  meetings: string[];
  sections: BoardSection[];
  stats: {
    urgent: number;
    follow: number;
    done: number;
    info: number;
  };
};

const PRI = new Set(["P0", "P1", "P2", "OK", "FYI"]);

/** Display tz: Beijing now; switch frontmatter tz → Asia/Singapore when abroad */
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
    let meta: string | undefined;
    let action: string | undefined;
    let date: string | undefined;
    let people: string | undefined;
    let tags: string[] | undefined;

    for (const line of lines.slice(1)) {
      const m = line.match(
        /^-?\s*(priority|meta|action|date|people|tags)\s*:\s*(.+)$/i,
      );
      if (!m) continue;
      const key = m[1].toLowerCase();
      const val = stripBold(m[2]);
      if (key === "priority") {
        const p = val.toUpperCase();
        if (PRI.has(p)) priority = p as Priority;
      } else if (key === "meta") meta = val;
      else if (key === "action") action = val;
      else if (key === "date") date = val;
      else if (key === "people") people = val;
      else if (key === "tags")
        tags = val
          .split(/[,|]/)
          .map((t) => t.trim())
          .filter(Boolean);
    }

    items.push({ title, priority, meta, action, date, people, tags });
  }
  return items;
}

/**
 * Short updated stamp, e.g. `7月22日 10:10` (no GMT dump).
 * Accepts: Date | "YYYY-MM-DD" | "YYYY-MM-DD HH:mm" | ISO
 */
function formatUpdated(raw: unknown, tz: string): string {
  if (raw == null || raw === "") return "";

  let d: Date | null = null;

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    d = raw;
  } else {
    const s = String(raw).trim();
    // YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm
    const m = s.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?$/,
    );
    if (m) {
      const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4] || "12"}:${m[5] || "00"}:00`;
      // Interpret naive wall time as already-in-tz for display: format parts directly
      if (m[4]) {
        return `${Number(m[2])}月${Number(m[3])}日 ${m[4]}:${m[5]}`;
      }
      return `${Number(m[2])}月${Number(m[3])}日`;
    }
    const t = Date.parse(s);
    if (!Number.isNaN(t)) d = new Date(t);
    else return s;
  }

  if (!d) return "";

  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: tz,
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  if (hour && minute) return `${month}月${day}日 ${hour}:${minute}`;
  return `${month}月${day}日`;
}

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
  const stats = {
    urgent: all.filter((i) => i.priority === "P0").length,
    follow: all.filter((i) => i.priority === "P1" || i.priority === "P2")
      .length,
    done: all.filter((i) => i.priority === "OK").length,
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
