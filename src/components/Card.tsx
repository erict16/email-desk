import type { BoardItem } from "@/lib/parse-board";

/**
 * Tags are short “who + what” phrases (not bare 等工厂/待客户).
 * Color by intent keyword still works when the phrase is longer.
 */
function tagClass(label: string): string {
  const t = label.trim();
  if (/需尽快|优先|紧急|催你|阻塞/.test(t)) return "bg-rose-100 text-rose-800";
  if (/待你|待发|待打包|待放行|待补|你欠/.test(t))
    return "bg-orange-100 text-orange-900";
  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判/.test(t))
    return "bg-amber-100 text-amber-900";
  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
    return "bg-sky-100 text-sky-800";
  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产/.test(t))
    return "bg-emerald-100 text-emerald-800";
  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy/.test(t))
    return "bg-slate-100 text-slate-700";
  if (/缺|售后|物流|补发|顶盖/.test(t)) return "bg-violet-100 text-violet-800";
  return "bg-neutral-100 text-neutral-700";
}

export default function Card({
  item,
  index,
}: {
  item: BoardItem;
  index: number;
}) {
  const isDone = item.priority === "OK";
  const isP0 = item.priority === "P0";

  return (
    <article
      className={`rounded-xl border border-neutral-200/90 bg-white px-4 py-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 ${
              isP0 ? "border-l-[3px] border-l-[var(--urgent)]" : ""
            } ${isDone ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className="min-w-0 select-text text-[0.95rem] font-semibold leading-snug text-neutral-900 dark:text-neutral-50"
          title="可复制标题 → 邮箱搜索"
        >
          <span className="mr-1.5 font-semibold tabular-nums text-neutral-400">
            {index}.
          </span>
          {item.title}
        </h3>
        {item.date && (
          <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-neutral-400">
            {item.date}
          </span>
        )}
      </div>

      {item.meta && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {item.meta}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${tagClass(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {item.people && (
        <p className="mt-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          发件人：{item.people}
        </p>
      )}

      {item.action && (
        <div className="mt-2.5 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-[13px] leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
          <span className="font-semibold text-amber-900 dark:text-amber-200">
            待办 ·{" "}
          </span>
          {item.action}
        </div>
      )}
    </article>
  );
}
