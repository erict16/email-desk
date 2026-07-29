import type { BoardItem } from "@/lib/parse-board";
import { tagClass } from "@/lib/tag-class";

/**
 * Legacy triage card — Board still imports until Task 5 wires ActionCard.
 * Prefer ActionCard for Today / Later.
 */
export default function Card({
  item,
  index,
  hideAction = false,
  showStripe = false,
}: {
  item: BoardItem;
  index: number;
  hideAction?: boolean;
  showStripe?: boolean;
}) {
  const isDone = item.priority === "OK";
  const isFyi = item.priority === "FYI";
  const showAction = !hideAction && Boolean(item.action);

  return (
    <article
      className={`rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-[var(--pad-card-x)] py-[var(--pad-card-y)] transition-[border-color,background-color] duration-150 hover:border-[var(--line-strong)] hover:bg-[var(--paper-2)] ${
        showStripe ? "border-l-2 border-l-[var(--urgent)]" : ""
      } ${isDone || isFyi ? "opacity-90" : ""}`}
    >
      <div className="flex flex-col gap-[var(--gap-stack)]">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="min-w-0 select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
            title="可复制标题 → 邮箱搜索"
          >
            <span className="mr-1.5 font-medium tabular-nums text-[var(--faint)]">
              {index}.
            </span>
            {item.title}
          </h3>
          {item.date && (
            <span className="shrink-0 pt-0.5 text-[11px] leading-none tabular-nums text-[var(--faint)]">
              {item.date}
            </span>
          )}
        </div>

        {item.meta && (
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            {item.meta}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.tags.map((t) => (
              <span
                key={t}
                className={`inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[10px] font-medium leading-none ${tagClass(t)}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {item.people && (
          <p className="text-[11px] leading-normal text-[var(--faint)]">
            {item.people}
          </p>
        )}

        {showAction && (
          <p className="mt-0.5 border-l-2 border-[var(--follow)] pl-2.5 text-[13px] leading-snug text-[var(--ink)]">
            <span className="font-medium text-[var(--follow)]">待办 </span>
            {item.action}
          </p>
        )}
      </div>
    </article>
  );
}
