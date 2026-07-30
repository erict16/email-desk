import type { JSX } from "react";
import type { BoardItem } from "@/lib/parse-board";
import { isWaitingItem } from "@/lib/parse-board";
import {
  ORDER_STAGES,
  stageDef,
  stageIndex,
  stageProgress,
  type OrderStageId,
} from "@/lib/order-stages";
import CopyTitle from "@/components/CopyTitle";
import { tagClass } from "@/lib/tag-class";

function StageProgress({ current }: { current: OrderStageId }) {
  const cur = stageIndex(current);
  const { current: n, total } = stageProgress(current);
  const def = stageDef(current);
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${def.label} · ${n}/${total}`}
    >
      <div className="flex items-center gap-1" aria-hidden>
        {ORDER_STAGES.map((s, i) => (
          <span
            key={s.id}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                i < cur
                  ? "var(--pipe)"
                  : i === cur
                    ? "var(--ink)"
                    : "var(--line-strong)",
              opacity: i === cur ? 1 : i < cur ? 0.5 : 0.35,
            }}
            title={s.label}
          />
        ))}
      </div>
      <span className="text-[12px] font-medium leading-none text-[var(--mute)]">
        {def.short}
      </span>
      <span className="text-[12px] tabular-nums leading-none text-[var(--faint)]">
        {n}/{total}
      </span>
    </div>
  );
}

export default function OrderCard({
  item,
  index,
  triageHref,
}: {
  item: BoardItem;
  index: number;
  triageHref?: "#mine" | "#wait" | "#later";
}): JSX.Element {
  const stage = item.stage;
  const showWait = isWaitingItem(item);
  const waitLine = item.wait?.trim();

  return (
    <article className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-[var(--pad-card-x)] py-[var(--pad-card-y)]">
      <div className="flex flex-col gap-[var(--gap-block)]">
        <div className="min-w-0">
          <div className="flex items-start gap-1">
            <h3
              className="min-w-0 select-text text-[15px] font-semibold leading-snug tracking-tight text-[var(--ink)]"
              title="可复制标题 → 邮箱搜索"
            >
              <span className="mr-1.5 font-normal tabular-nums text-[var(--faint)]">
                {index}.
              </span>
              {item.title}
            </h3>
            <CopyTitle title={item.title} />
          </div>
          {item.customer && (
            <p className="mt-1.5 text-[12px] leading-snug text-[var(--mute)]">
              {item.customer}
            </p>
          )}
        </div>

        {stage && <StageProgress current={stage} />}

        {item.action && (
          <p className="rounded-[var(--radius-sm)] bg-[var(--pipe-soft)] px-3 py-2 text-[13px] leading-snug text-[var(--action-ink)]">
            <span className="font-semibold">卡点 · </span>
            {item.action}
          </p>
        )}

        {(showWait && waitLine) ||
        item.tags?.length ||
        item.people ||
        item.meta ||
        triageHref ? (
          <div className="flex flex-col gap-[var(--gap-stack)]">
            {showWait && waitLine && (
              <p className="text-[12px] leading-snug text-[var(--wait-ink)]">
                <span className="font-medium">等待 · </span>
                {waitLine}
              </p>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[11px] font-medium leading-none ${tagClass(t)}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {item.people && (
              <p className="text-[12px] leading-normal text-[var(--faint)]">
                {item.people}
              </p>
            )}

            {item.meta && (
              <p className="line-clamp-1 text-[13px] leading-relaxed text-[var(--mute)]">
                {item.meta}
              </p>
            )}

            {triageHref && (
              <a
                href={triageHref}
                className="inline-flex w-fit text-[12px] font-medium text-[var(--mute)] underline-offset-2 hover:text-[var(--pipe)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              >
                {triageHref === "#wait" ? "等对方有跟进" : "有待办"}
              </a>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
