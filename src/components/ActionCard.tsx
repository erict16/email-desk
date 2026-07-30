import type { JSX } from "react";
import type { BoardItem } from "@/lib/parse-board";
import CopyTitle from "@/components/CopyTitle";
import { tagClass } from "@/lib/tag-class";

/**
 * Action card — spine is the visual backbone.
 * Mine: teal「待办 ·」; Wait: slate「等待 ·」; P0 left red rail.
 */
export default function ActionCard({
  item,
  index,
  urgent = false,
  tone = "act",
  linkedStage,
}: {
  item: BoardItem;
  index: number;
  urgent?: boolean;
  tone?: "act" | "wait";
  linkedStage?: string;
}): JSX.Element {
  const isWait = tone === "wait";
  const spineText = isWait
    ? item.wait?.trim() || item.action
    : item.action;

  return (
    <article
      className={`rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-[var(--pad-card-x)] py-[var(--pad-card-y)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 hover:border-[var(--line-strong)] ${
        urgent ? "border-l-[3px] border-l-[var(--urgent)]" : ""
      }`}
    >
      <div className="flex flex-col gap-[var(--gap-stack)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-1">
            <h3
              className="min-w-0 select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
              title="可复制标题 → 邮箱搜索"
            >
              <span className="mr-1.5 font-medium tabular-nums text-[var(--faint)]">
                {index}.
              </span>
              {item.title}
            </h3>
            <CopyTitle title={item.title} />
          </div>
          {item.date && (
            <span className="shrink-0 pt-0.5 font-mono text-[11px] leading-none text-[var(--faint)]">
              {item.date}
            </span>
          )}
        </div>

        {spineText && (
          <p
            className={`rounded-[var(--radius-sm)] border-l-[3px] px-2.5 py-1.5 text-[13px] leading-snug ${
              isWait
                ? "border-l-[var(--line-strong)] bg-[var(--wait-bg)] text-[var(--wait-ink)]"
                : "border-l-[var(--signal)] bg-[var(--action-bg)] text-[var(--action-ink)]"
            }`}
          >
            <span className="font-semibold">
              {isWait ? "等待 · " : "待办 · "}
            </span>
            {spineText}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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
            发件人：{item.people}
          </p>
        )}

        {item.meta && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
            {item.meta}
          </p>
        )}

        {linkedStage && (
          <a
            href="#pipeline"
            className="inline-flex w-fit items-center text-[12px] font-medium leading-none text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          >
            管线 · {linkedStage}
          </a>
        )}
      </div>
    </article>
  );
}
