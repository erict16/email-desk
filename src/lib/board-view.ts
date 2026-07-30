import type { BoardData, BoardItem } from "@/lib/board-types";
import { isOrderItem, isWaitingItem } from "@/lib/board-types";
import { compareByStageThenTitle } from "@/lib/order-stages";
import { titleKey } from "@/lib/title-key";

export type DeskView = {
  /** P0/P1 that need Eric to act now */
  mine: BoardItem[];
  /** Ball with someone else (any triage priority) */
  waiting: BoardItem[];
  /** P2 and not waiting — watch later */
  later: BoardItem[];
  /** Order pipeline cards */
  orders: BoardItem[];
  meetings: string[];
  stats: {
    mine: number;
    waiting: number;
    later: number;
    orders: number;
  };
  /** titleKey → true if appears in both a triage item and an order item */
  linkedKeys: Set<string>;
  /** titleKey → which triage zone holds that title (for order cross-links) */
  triageZoneByKey: Map<string, "mine" | "wait" | "later">;
};

function isTriage(item: BoardItem): boolean {
  return (
    item.priority === "P0" ||
    item.priority === "P1" ||
    item.priority === "P2"
  );
}

function sortMine(a: BoardItem, b: BoardItem): number {
  // P0 before P1
  if (a.priority !== b.priority) {
    if (a.priority === "P0") return -1;
    if (b.priority === "P0") return 1;
  }
  return 0;
}

/**
 * Partition triage by ball-in-court:
 * - mine: P0|P1 and not waiting
 * - waiting: waiting (P0/P1/P2)
 * - later: P2 and not waiting
 *
 * Legacy cards without ball/wait: all P0/P1 → mine, all P2 → later.
 */
export function buildDeskView(board: BoardData): DeskView {
  const all = board.sections.flatMap((s) => s.items);

  const triage = all.filter(isTriage);
  const mine = triage
    .filter((i) => (i.priority === "P0" || i.priority === "P1") && !isWaitingItem(i))
    .slice()
    .sort(sortMine);
  const waiting = triage.filter((i) => isWaitingItem(i));
  const later = triage.filter(
    (i) => i.priority === "P2" && !isWaitingItem(i),
  );

  const orders = all
    .filter(isOrderItem)
    .slice()
    .sort(compareByStageThenTitle);

  const triageKeys = new Set(triage.map((i) => titleKey(i.title)));
  const orderKeys = new Set(orders.map((i) => titleKey(i.title)));

  const linkedKeys = new Set<string>();
  for (const key of triageKeys) {
    if (orderKeys.has(key)) linkedKeys.add(key);
  }

  const triageZoneByKey = new Map<string, "mine" | "wait" | "later">();
  for (const i of mine) triageZoneByKey.set(titleKey(i.title), "mine");
  for (const i of waiting) triageZoneByKey.set(titleKey(i.title), "wait");
  for (const i of later) triageZoneByKey.set(titleKey(i.title), "later");

  return {
    mine,
    waiting,
    later,
    orders,
    meetings: board.meetings,
    stats: {
      mine: mine.length,
      waiting: waiting.length,
      later: later.length,
      orders: orders.length,
    },
    linkedKeys,
    triageZoneByKey,
  };
}
