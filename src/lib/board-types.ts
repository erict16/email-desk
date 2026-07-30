import type { OrderStageId } from "@/lib/order-stages";

export type Priority = "P0" | "P1" | "P2" | "OK" | "FYI" | "ORDER";

/** Who holds the ball — Eric acts vs waiting on someone else */
export type Ball = "me" | "them";

export type BoardItem = {
  title: string;
  priority: Priority;
  meta?: string;
  action?: string;
  date?: string;
  tags?: string[];
  people?: string;
  stage?: OrderStageId;
  customer?: string;
  ball?: Ball;
  wait?: string;
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
  meetings: string[];
  sections: BoardSection[];
  stats: {
    urgent: number;
    follow: number;
    orders: number;
    info: number;
  };
};

export function parseBall(raw: string | undefined): Ball | undefined {
  if (!raw) return undefined;
  const k = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (
    k === "me" ||
    k === "i" ||
    k === "mine" ||
    k === "我" ||
    k === "自己" ||
    k === "eric"
  ) {
    return "me";
  }
  if (
    k === "them" ||
    k === "they" ||
    k === "other" ||
    k === "others" ||
    k === "对方" ||
    k === "别人" ||
    k === "客户" ||
    k === "工厂" ||
    k === "wait"
  ) {
    return "them";
  }
  return undefined;
}

/**
 * Waiting detection:
 * 1. ball: them → waiting
 * 2. ball: me → not waiting
 * 3. non-empty wait: → waiting
 * 4. neither → not waiting
 */
export function isWaitingItem(item: BoardItem): boolean {
  if (item.ball === "them") return true;
  if (item.ball === "me") return false;
  return Boolean(item.wait && item.wait.trim());
}

export function isOrderItem(item: BoardItem): boolean {
  if (item.priority === "P0" || item.priority === "P1" || item.priority === "P2")
    return false;
  if (item.priority === "FYI") return false;
  return (
    Boolean(item.stage) || item.priority === "ORDER" || item.priority === "OK"
  );
}
