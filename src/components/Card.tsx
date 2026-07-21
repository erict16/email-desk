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

  return (
    <article
      className={`rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 ${
        item.priority === "P0"
          ? "border-l-4 border-l-neutral-900 dark:border-l-white"
          : ""
      } ${isDone ? "opacity-70" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 w-6 shrink-0 text-sm font-semibold tabular-nums text-neutral-400">
          {index}.
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-[0.95rem] font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
              {item.title}
            </h3>
            {item.date && (
              <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                {item.date}
              </span>
            )}
          </div>

          {item.meta && (
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {item.meta}
            </p>
          )}

          {(item.tags?.length || item.people) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {item.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {t}
                </span>
              ))}
              {item.people && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  发件人：{item.people}
                </span>
              )}
            </div>
          )}

          {item.action && (
            <div className="mt-3 rounded-xl bg-neutral-50 px-3 py-2.5 text-sm leading-relaxed text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              <span className="font-semibold text-neutral-900 dark:text-white">
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
