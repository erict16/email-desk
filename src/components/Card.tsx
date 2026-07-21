import type { BoardItem } from "@/lib/parse-board";
import PriorityBadge from "@/components/PriorityBadge";

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
      className={`group rounded-2xl border border-white/50 bg-white/65 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/80 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] ${
        isP0
          ? "border-l-[3px] border-l-rose-400 dark:border-l-rose-400"
          : ""
      } ${isDone ? "opacity-80" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-violet-100 text-xs font-bold tabular-nums text-slate-600 dark:from-sky-900/50 dark:to-violet-900/50 dark:text-slate-200">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-[0.98rem] font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {item.title}
            </h3>
            {item.date && (
              <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[11px] tabular-nums text-slate-500 dark:bg-white/10 dark:text-slate-400">
                {item.date}
              </span>
            )}
          </div>

          {item.meta && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.meta}
            </p>
          )}

          {(item.tags?.length || item.people) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {item.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-800 dark:bg-sky-400/15 dark:text-sky-200"
                >
                  {t}
                </span>
              ))}
              {item.people && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  发件人：{item.people}
                </span>
              )}
            </div>
          )}

          {item.action && (
            <div className="mt-3 rounded-xl border border-teal-400/20 bg-gradient-to-r from-teal-50/90 to-sky-50/80 px-3 py-2.5 text-sm leading-relaxed text-slate-800 dark:border-teal-400/15 dark:from-teal-950/40 dark:to-sky-950/30 dark:text-slate-100">
              <span className="font-semibold text-teal-700 dark:text-teal-300">
                待办 ·{" "}
              </span>
              {item.action}
            </div>
          )}

          <div className="mt-2.5">
            <PriorityBadge priority={item.priority} />
          </div>
        </div>
      </div>
    </article>
  );
}
