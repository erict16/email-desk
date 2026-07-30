/**
 * Semantic tag colors:
 * - 紧急/阻塞 → 浅红底 + 深红字
 * - 内部等待/待工厂 → 浅黄底 + 深琥珀字
 * - 普通/流程 → 浅蓝底 + 深蓝字
 */
export function tagClass(label: string): string {
  const t = label.trim();

  // 紧急 / 阻塞
  if (/需尽快|优先|紧急|催你|阻塞|卡住|卡点/.test(t))
    return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/80 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30";

  // 内部等待 / 工厂工程
  if (
    /待你|待发|待打包|待放行|待补|你欠|等你|待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位|图纸|改图|收齐|材料/.test(
      t,
    )
  )
    return "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30";

  // 客户侧等待
  if (/待客户|等客户|客户已|议价|谈判|等PO|等 PO|采购|确认/.test(t))
    return "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200/80 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/30";

  // 单证 / 普通流程信息
  if (/缺|售后|物流|补发|顶盖|单证|CI|PL|CO|Form|投产|已签|已发|已回|已转|已确认|旁听|知会/.test(t))
    return "bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-200/70 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-500/30";

  // default 浅蓝
  return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/25";
}
