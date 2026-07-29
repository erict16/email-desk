import type { BoardData, BoardItem } from "@/lib/parse-board";
import { isOrderItem } from "@/lib/parse-board";
import { compareByStageThenTitle } from "@/lib/order-stages";
import { titleKey } from "@/lib/title-key";

export type DeskView = {
  today: BoardItem[]; // P0 then P1
  later: BoardItem[]; // P2
  orders: BoardItem[]; // isOrderItem, sorted by stage
  meetings: string[];
  stats: {
    urgent: number; // P0
    today: number; // P0+P1
    later: number; // P2
    orders: number;
  };
  /** titleKey → true if appears in both a triage item and an order item */
  linkedKeys: Set<string>;
};

export function buildDeskView(board: BoardData): DeskView {
  const all = board.sections.flatMap((s) => s.items);

  const p0 = all.filter((i) => i.priority === "P0");
  const p1 = all.filter((i) => i.priority === "P1");
  const p2 = all.filter((i) => i.priority === "P2");

  const today = [...p0, ...p1];
  const later = p2;
  const orders = all
    .filter(isOrderItem)
    .slice()
    .sort(compareByStageThenTitle);

  const triageKeys = new Set(
    [...p0, ...p1, ...p2].map((i) => titleKey(i.title)),
  );
  const orderKeys = new Set(orders.map((i) => titleKey(i.title)));

  const linkedKeys = new Set<string>();
  for (const key of triageKeys) {
    if (orderKeys.has(key)) linkedKeys.add(key);
  }

  return {
    today,
    later,
    orders,
    meetings: board.meetings,
    stats: {
      urgent: p0.length,
      today: today.length,
      later: later.length,
      orders: orders.length,
    },
    linkedKeys,
  };
}
