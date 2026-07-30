import type { BoardItem } from "@/lib/board-types";
import { isWaitingItem } from "@/lib/board-types";

/** Blocker domain for 卡点 filters */
export type BlockerCategory = "customer" | "factory" | "docs";

export type ZoneFilter = "all" | "blocked" | "mine" | "waiting";

const CUSTOMER_RE =
  /客户|待客户|等客户|cameron|trung|yoeli|hoa|prasad|finlayson|sanaky|wtc|evn|have|gerrick|客户确认|报价反馈|contract|yoeli|khanh|linh|puguh/i;

const FACTORY_RE =
  /工厂|沈工|王工|工程|图纸|外形|3d|提货日|kimmy|材料|讲义|投产|erp|生产|改图|技术|油枕|tie-?in|电位电阻/i;

const DOCS_RE =
  /单证|ci\/?pl|form\s*e|\bco\b|发票|装箱|产地证|玲玲|沈丽玲|hs\s*code|清关|cipl|报关|正本|draft\s*co/i;

/** Item has an active blocker / 卡点 worth tracking */
export function isBlockedItem(item: BoardItem): boolean {
  if (isWaitingItem(item)) return true;
  if (item.wait?.trim()) return true;
  const blob = [item.action, item.meta, ...(item.tags ?? [])].join(" ");
  if (/阻塞|卡住|卡点|待回|待出|待改|待确认|待收|待填|等工厂|等客户|等沈/.test(blob))
    return true;
  return false;
}

export function classifyBlocker(item: BoardItem): BlockerCategory | null {
  if (!isBlockedItem(item)) return null;
  const blob = [
    item.wait,
    item.action,
    item.meta,
    item.people,
    item.customer,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  // Priority: docs > factory > customer when multiple match (export docs explicit)
  if (DOCS_RE.test(blob)) return "docs";
  if (FACTORY_RE.test(blob)) return "factory";
  if (CUSTOMER_RE.test(blob)) return "customer";
  // default blocked → customer side if waiting
  if (isWaitingItem(item)) return "customer";
  return "factory";
}

export function matchesZone(
  item: BoardItem,
  zone: ZoneFilter,
  zoneOf: "mine" | "waiting" | "later" | "order",
): boolean {
  if (zone === "all") return true;
  if (zone === "blocked") return isBlockedItem(item);
  if (zone === "mine") return zoneOf === "mine";
  if (zone === "waiting") return zoneOf === "waiting" || isWaitingItem(item);
  return true;
}

export function matchesBlockerCategory(
  item: BoardItem,
  cats: Set<BlockerCategory>,
): boolean {
  if (cats.size === 0) return true;
  const c = classifyBlocker(item);
  if (!c) return false;
  return cats.has(c);
}

/** Slack/Teams one-liner */
export function formatShareBrief(
  item: BoardItem,
  tone: "act" | "wait" | "order" = "act",
): string {
  const body =
    tone === "wait"
      ? item.wait?.trim() || item.action || item.meta || "waiting"
      : item.action?.trim() || item.wait?.trim() || item.meta || "update";
  const label =
    tone === "wait" || isWaitingItem(item) ? "Blocked" : "Action";
  return `[${item.title}] ${label}: ${body}`;
}
