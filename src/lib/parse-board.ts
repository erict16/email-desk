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
  priorities: string[];
  sections: BoardSection[];
  stats: {
    urgent: number; // P0
    pending: number; // P1
    follow: number; // P2
    other: number; // FYI + OK still open? or FYI only
  };
};

const PRI = new Set(["P0", "P1", "P2", "OK", "FYI"]);

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
      const m = line.match(/^-?\s*(priority|meta|action|date|people|tags)\s*:\s*(.+)$/i);
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

export function loadBoard(): BoardData {
  const file = path.join(process.cwd(), "content", "board.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const parts = content
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean);

  const sections: BoardSection[] = [];
  for (const sec of parts) {
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
    pending: all.filter((i) => i.priority === "P1").length,
    follow: all.filter((i) => i.priority === "P2").length,
    other: all.filter((i) => i.priority === "FYI" || i.priority === "OK").length,
  };

  const priorities = Array.isArray(data.priorities)
    ? data.priorities.map(String)
    : [];

  return {
    title: String(data.title || "邮件跟进清单"),
    subtitle: String(data.subtitle || ""),
    updated: String(data.updated || ""),
    priorities,
    sections,
    stats,
  };
}
