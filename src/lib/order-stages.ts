/**
 * Huaming export order pipeline (OLTC / DETC).
 *
 * OS often lands before tech talk. SC is rare (only a few customers) —
 * not a pipeline stage; note it in meta/tags if needed.
 *
 * os → tech → qs → po → erp → docs → ship
 */

export type OrderStageId =
  | "os"
  | "tech"
  | "qs"
  | "po"
  | "erp"
  | "docs"
  | "ship";

export type OrderStageDef = {
  id: OrderStageId;
  short: string;
  label: string;
  hint: string;
};

export const ORDER_STAGES: readonly OrderStageDef[] = [
  {
    id: "os",
    short: "OS",
    label: "OS",
    hint: "订货规格",
  },
  {
    id: "tech",
    short: "技术",
    label: "技术沟通",
    hint: "图纸 · 参数",
  },
  {
    id: "qs",
    short: "QS",
    label: "QS 报价",
    hint: "报价 · 改价",
  },
  {
    id: "po",
    short: "PO",
    label: "等 PO",
    hint: "等正式订单",
  },
  {
    id: "erp",
    short: "投产",
    label: "ERP 投产",
    hint: "生产中",
  },
  {
    id: "docs",
    short: "单证",
    label: "CI/PL/CO",
    hint: "发票 · 装箱 · 产地证",
  },
  {
    id: "ship",
    short: "提货",
    label: "完工提货",
    hint: "完工 · 发运",
  },
] as const;

/**
 * sc / 销售确认 → erp (SC 不是常规阶段；个别客户有 SC 时写在 meta)
 */
const ALIASES: Record<string, OrderStageId> = {
  os: "os",
  规格: "os",
  订货规格: "os",
  tech: "tech",
  technical: "tech",
  discussion: "tech",
  技术: "tech",
  技术讨论: "tech",
  技术沟通: "tech",
  qs: "qs",
  quote: "qs",
  报价: "qs",
  po: "po",
  wait_po: "po",
  waiting_po: "po",
  等po: "po",
  等_po: "po",
  // rare SC → fold into erp
  sc: "erp",
  sales: "erp",
  confirmation: "erp",
  销售确认: "erp",
  合同: "erp",
  erp: "erp",
  production: "erp",
  投产: "erp",
  erp投产: "erp",
  docs: "docs",
  ci: "docs",
  pl: "docs",
  co: "docs",
  "ci/pl/co": "docs",
  ciplco: "docs",
  单证: "docs",
  ship: "ship",
  delivery: "ship",
  ready: "ship",
  pickup: "ship",
  提货: "ship",
  完工: "ship",
  完工提货: "ship",
  生产完工: "ship",
  发运: "ship",
};

export function parseOrderStage(
  raw: string | undefined,
): OrderStageId | undefined {
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

export function stageProgress(id: OrderStageId): {
  current: number;
  total: number;
} {
  return { current: stageIndex(id) + 1, total: ORDER_STAGES.length };
}

/** Earlier stage first (less complete), then title */
export function compareByStageThenTitle(
  a: { stage?: OrderStageId; title: string },
  b: { stage?: OrderStageId; title: string },
): number {
  const ia = a.stage != null ? stageIndex(a.stage) : 99;
  const ib = b.stage != null ? stageIndex(b.stage) : 99;
  if (ia !== ib) return ia - ib;
  return a.title.localeCompare(b.title, "zh");
}
