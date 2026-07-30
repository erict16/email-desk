import type { BoardItem } from "@/lib/board-types";

/** Case-insensitive filter across title, customer, people, tags, meta, action, wait */
export function matchesQuery(item: BoardItem, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const hay = [
    item.title,
    item.customer,
    item.people,
    item.meta,
    item.action,
    item.wait,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

export function filterItems<T extends BoardItem>(items: T[], q: string): T[] {
  if (!q.trim()) return items;
  return items.filter((i) => matchesQuery(i, q));
}
