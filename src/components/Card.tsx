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
      className={`rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 shadow-sm ${
        isP0 ? "border-l-[3px] border-l-neutral-900 dark:border-l-white" : ""
      } ${isDone ? "opacity-65" : ""}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 w-5 shrink-0 text-right text-[13px] font-medium tabular-nums text-neutral-400">
          {index}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-[0.92rem] font-semibold leading-snug text-[var(--fg)]">
              {item.title}
            </h3>
            <div className="mt-0.5 flex shrink-0 items-center gap-1.5">
              {item.date && (
                <span className="text-[11px] tabular-nums text-neutral-400">
                  {item.date}
                </span>
              )}
              <PriorityBadge priority={item.priority} />
            </div>
          </div>

          {item.meta && (
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
              {item.meta}
            </p>
          )}

          {(item.tags?.length || item.people) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {item.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {t}
                </span>
              ))}
              {item.people && (
                <span className="text-[11px] text-neutral-400">
                  {item.people}
                </span>
              )}
            </div>
          )}

          {item.action && (
            <div className="mt-2 rounded-lg bg-neutral-50 px-2.5 py-2 text-[13px] leading-relaxed text-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200">
              <span className="font-semibold">待办 · </span>
              {item.action}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
