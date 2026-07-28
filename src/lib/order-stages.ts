/**
 * Huaming export order pipeline (OLTC / DETC).
 * Order matches real mail flow: OS often lands before tech talk;
 * ERP release and pickup sit after SC.
 *
 * os → tech → qs → po → sc → erp → docs → ship
 */

export type OrderStageId =
  | "os"
  | "tech"
  | "qs"
  | "po"
  | "sc"
  | "erp"
  | "docs"
  | "ship";

export type OrderStageDef = {
  id: OrderStageId;
  /** Short chip label */
  short: string;
  /** Section / full label */
  label: string;
  /** One-line hint */
  hint: string;
};

/** Coarse buckets for the orders UI (completion order). */
export type OrderPhaseId = "quote" | "deal" | "fulfill";

export type OrderPhaseDef = {
  id: OrderPhaseId;
  label: string;
  stageIds: readonly OrderStageId[];
};

export const ORDER_STAGES: readonly OrderStageDef[] = [
  {
    id: "os",
    short: "OS",
    label: "OS",
    hint: "订货规格 · 等客户填/改",
  },
  {
    id: "tech",
    short: "技术",
    label: "技术沟通",
    hint: "图纸 · 参数 · 非标",
  },
  {
    id: "qs",
    short: "QS",
    label: "QS 报价",
    hint: "报价发出 · 改价",
  },
  {
    id: "po",
    short: "等PO",
    label: "等 PO",
    hint: "报价已出，等正式 PO",
  },
  {
    id: "sc",
    short: "SC",
    label: "销售确认",
    hint: "SC / 合同签署",
  },
  {
    id: "erp",
    short: "投产",
    label: "ERP 投产",
    hint: "工厂已下投产 · 生产中",
  },
  {
    id: "docs",
    short: "单证",
    label: "CI/PL/CO",
    hint: "发票 · 装箱单 · 产地证",
  },
  {
    id: "ship",
    short: "提货",
    label: "完工提货",
    hint: "生产完工 · 客户提货/发运",
  },
] as const;

export const ORDER_PHASES: readonly OrderPhaseDef[] = [
  {
    id: "quote",
    label: "询价",
    stageIds: ["os", "tech", "qs"],
  },
  {
    id: "deal",
    label: "成交",
    stageIds: ["po", "sc"],
  },
  {
    id: "fulfill",
    label: "履约",
    stageIds: ["erp", "docs", "ship"],
  },
] as const;

const ALIASES: Record<string, OrderStageId> = {
  // OS first (common entry)
  os: "os",
  规格: "os",
  订货规格: "os",
  // tech
  tech: "tech",
  technical: "tech",
  discussion: "tech",
  技术: "tech",
  技术讨论: "tech",
  技术沟通: "tech",
  // qs
  qs: "qs",
  quote: "qs",
  报价: "qs",
  // po
  po: "po",
  wait_po: "po",
  waiting_po: "po",
  等po: "po",
  等_po: "po",
  // sc
  sc: "sc",
  sales: "sc",
  confirmation: "sc",
  销售确认: "sc",
  合同: "sc",
  // erp
  erp: "erp",
  production: "erp",
  投产: "erp",
  erp投产: "erp",
  // docs
  docs: "docs",
  ci: "docs",
  pl: "docs",
  co: "docs",
  "ci/pl/co": "docs",
  ciplco: "docs",
  单证: "docs",
  // ship / pickup
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

export function phaseForStage(id: OrderStageId): OrderPhaseDef | undefined {
  return ORDER_PHASES.find((p) => p.stageIds.includes(id));
}

/** Sort: earlier stage first (less complete), then title */
export function compareByStageThenTitle(
  a: { stage?: OrderStageId; title: string },
  b: { stage?: OrderStageId; title: string },
): number {
  const ia = a.stage != null ? stageIndex(a.stage) : 99;
  const ib = b.stage != null ? stageIndex(b.stage) : 99;
  if (ia !== ib) return ia - ib;
  return a.title.localeCompare(b.title, "zh");
}

/** Sort by completion (later stages first) */
export function compareByCompletionDesc(
  a: { stage?: OrderStageId; title: string },
  b: { stage?: OrderStageId; title: string },
): number {
  const ia = a.stage != null ? stageIndex(a.stage) : -1;
  const ib = b.stage != null ? stageIndex(b.stage) : -1;
  if (ia !== ib) return ib - ia;
  return a.title.localeCompare(b.title, "zh");
}
