import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Priority = "P0" | "P1" | "P2" | "OK" | "FYI";

export type BoardItem = {
  title: string;
  priority: Priority;
  meta?: string;
  action?: string;
};

export type BoardColumn = {
  id: string;
  title: string;
  items: BoardItem[];
};

export type BoardData = {
  title: string;
  subtitle: string;
  updated: string;
  badge: string;
  priorities: string[];
  columns: BoardColumn[];
};

const PRI_SET = new Set(["P0", "P1", "P2", "OK", "FYI"]);

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

    for (const line of lines.slice(1)) {
      const m = line.match(/^-?\s*(priority|meta|action)\s*:\s*(.+)$/i);
      if (!m) continue;
      const key = m[1].toLowerCase();
      const val = stripBold(m[2]);
      if (key === "priority") {
        const p = val.toUpperCase();
        if (PRI_SET.has(p)) priority = p as Priority;
      } else if (key === "meta") meta = val;
      else if (key === "action") action = val;
    }

    items.push({ title, priority, meta, action });
  }
  return items;
}

export function loadBoard(): BoardData {
  const file = path.join(process.cwd(), "content", "board.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const sections = content
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean);

  const columns: BoardColumn[] = [];
  for (const sec of sections) {
    const nl = sec.indexOf("\n");
    const header = (nl === -1 ? sec : sec.slice(0, nl)).trim();
    const body = nl === -1 ? "" : sec.slice(nl + 1);
    const [idPart, titlePart] = header.split("|").map((s) => s.trim());
    const id = (idPart || "col").toLowerCase();
    const title = titlePart || idPart || "Column";
    columns.push({ id, title, items: parseItems(body) });
  }

  const priorities = Array.isArray(data.priorities)
    ? data.priorities.map(String)
    : [];

  return {
    title: String(data.title || "邮件跟进清单"),
    subtitle: String(data.subtitle || ""),
    updated: String(data.updated || ""),
    badge: String(data.badge || ""),
    priorities,
    columns,
  };
}
