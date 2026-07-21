import type { BoardItem } from "@/lib/parse-board";

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
      className={`rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3.5 ${
        isP0 ? "border-l-2 border-l-[var(--urgent)]" : ""
      } ${isDone ? "opacity-60" : ""}`}
    >
      <div className="flex gap-3">
        <span className="mt-0.5 w-5 shrink-0 text-right text-[13px] font-medium tabular-nums text-neutral-400">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[0.95rem] font-semibold leading-snug text-[var(--fg)]">
              {item.title}
            </h3>
            {item.date && (
              <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-neutral-400">
                {item.date}
              </span>
            )}
          </div>

          {item.meta && (
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
              {item.meta}
            </p>
          )}

          {(item.tags?.length || item.people) && (
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-neutral-500">
              {item.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800"
                >
                  {t}
                </span>
              ))}
              {item.people && <span>{item.people}</span>}
            </div>
          )}

          {item.action && (
            <div className="mt-2.5 rounded-lg bg-neutral-50 px-3 py-2 text-[13px] leading-relaxed text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              <span className="font-semibold">待办 · </span>
              {item.action}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
