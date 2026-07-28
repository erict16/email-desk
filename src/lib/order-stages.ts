/**
 * Project order pipeline for Huaming export sales (OLTC / DETC).
 * Stages are current-state labels, ordered roughly left → right.
 *
 * tech  → 图纸/参数/非标讨论
 * os    → OS 订货规格 / 技术规格
 * qs    → QS 报价发出或改价
 * po    → 等客户 PO
 * sc    → 销售确认 / 合同 / 投产
 * docs  → CI / PL / CO 单证
 */

export type OrderStageId =
  | "tech"
  | "os"
  | "qs"
  | "po"
  | "sc"
  | "docs";

export type OrderStageDef = {
  id: OrderStageId;
  /** Short chip label */
  short: string;
  /** Section / full label */
  label: string;
  /** One-line hint for humans */
  hint: string;
};

export const ORDER_STAGES: readonly OrderStageDef[] = [
  {
    id: "tech",
    short: "技术",
    label: "技术讨论",
    hint: "图纸 · 参数 · 非标 · 型号确认",
  },
  {
    id: "os",
    short: "OS",
    label: "OS",
    hint: "订货规格 / 技术规格确认",
  },
  {
    id: "qs",
    short: "QS",
    label: "QS 报价",
    hint: "报价发出 · 改价 · 客户议价",
  },
  {
    id: "po",
    short: "等PO",
    label: "等 PO",
    hint: "报价已出，等客户正式 PO",
  },
  {
    id: "sc",
    short: "SC",
    label: "销售确认",
    hint: "SC / 合同签署 · 投产",
  },
  {
    id: "docs",
    short: "单证",
    label: "CI/PL/CO",
    hint: "商业发票 · 装箱单 · 产地证",
  },
] as const;

const ALIASES: Record<string, OrderStageId> = {
  tech: "tech",
  technical: "tech",
  discussion: "tech",
  技术: "tech",
  技术讨论: "tech",
  os: "os",
  规格: "os",
  qs: "qs",
  quote: "qs",
  报价: "qs",
  po: "po",
  wait_po: "po",
  waiting_po: "po",
  等po: "po",
  等_po: "po",
  sc: "sc",
  sales: "sc",
  confirmation: "sc",
  销售确认: "sc",
  合同: "sc",
  docs: "docs",
  ci: "docs",
  pl: "docs",
  co: "docs",
  "ci/pl/co": "docs",
  ciplco: "docs",
  单证: "docs",
};

export function parseOrderStage(raw: string | undefined): OrderStageId | undefined {
  if (!raw) return undefined;
  const key = raw.trim().toLowerCase().replace(/\s+/g, "");
  return ALIASES[key] ?? ALIASES[raw.trim()];
}

export function stageIndex(id: OrderStageId): number {
  return ORDER_STAGES.findIndex((s) => s.id === id);
}

export function stageDef(id: OrderStageId): OrderStageDef {
  return ORDER_STAGES.find((s) => s.id === id) ?? ORDER_STAGES[0];
}

/** Sort: stage pipeline order, then title */
export function compareByStageThenTitle(
  a: { stage?: OrderStageId; title: string },
  b: { stage?: OrderStageId; title: string },
): number {
  const ia = a.stage != null ? stageIndex(a.stage) : 99;
  const ib = b.stage != null ? stageIndex(b.stage) : 99;
  if (ia !== ib) return ia - ib;
  return a.title.localeCompare(b.title, "zh");
}
