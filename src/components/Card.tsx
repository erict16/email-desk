import type { BoardItem } from "@/lib/parse-board";

/**
 * WorkBuddy-style status tags — semantic color by meaning, not random hash.
 * Prefer short status words: 今日死线 / 待回复 / 等工程 / 待客户 / 已完成 …
 */
function tagClass(label: string): string {
  const t = label.trim();
  if (/死线|紧急|催你|阻塞/.test(t)) return "bg-rose-100 text-rose-800";
  if (/待回复|待发|待补|待打包|待你|你欠/.test(t))
    return "bg-orange-100 text-orange-900";
  if (/待客户|等客户|等确认|谈判/.test(t)) return "bg-amber-100 text-amber-900";
  if (/等工程|等工厂|等评审|等型号|内转中/.test(t))
    return "bg-sky-100 text-sky-800";
  if (/已完成|已回|已投产|已内转|已发|已收口|已确认|关闭/.test(t))
    return "bg-emerald-100 text-emerald-800";
  if (/知会|旁听|非主责|流程|合规/.test(t)) return "bg-slate-100 text-slate-700";
  if (/缺件|售后|物流/.test(t)) return "bg-violet-100 text-violet-800";
  // mild fallback — still calm, not rainbow-random
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
        isP0 ? "border-l-[3px] border-l-rose-500" : ""
      } ${isDone ? "opacity-70" : ""}`}
    >
      {/* Title row — copy-friendly for mailbox search */}
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

      {/* Meta / body */}
      {item.meta && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {item.meta}
        </p>
      )}

      {/* Tags — status pills */}
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

      {/* People */}
      {item.people && (
        <p className="mt-1.5 text-[12px] text-neutral-500 dark:text-neutral-400">
          相关：{item.people}
        </p>
      )}

      {/* 待办 — soft yellow bar like WorkBuddy */}
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
