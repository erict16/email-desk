"use client";

import {
  ORDER_STAGES,
  stageDef,
  stageIndex,
  type OrderStageId,
} from "@/lib/order-stages";

const STAGE_GLOW: Record<OrderStageId, string> = {
  os: "bg-slate-400",
  tech: "bg-slate-400",
  qs: "bg-indigo-500",
  po: "bg-violet-500",
  erp: "bg-emerald-500",
  docs: "bg-cyan-500",
  ship: "bg-emerald-400",
};

/** 7-segment pipeline: current stage taller + pulse ring; delayed smooth tooltips */
export default function SegmentProgress({
  current,
}: {
  current: OrderStageId;
}) {
  const cur = stageIndex(current);
  const def = stageDef(current);

  return (
    <div className="flex flex-col gap-2" aria-label={`${def.label}`}>
      <div className="flex items-center gap-1">
        {ORDER_STAGES.map((s, i) => {
          const done = i < cur;
          const active = i === cur;
          const tip = `${i + 1}. ${s.label} — ${s.hint}`;
          return (
            <div
              key={s.id}
              className="group/seg relative flex flex-1 flex-col items-center gap-1"
            >
              {/* node */}
              <div className="relative flex h-3 w-full items-center justify-center">
                {active && (
                  <span
                    className={`absolute h-3 w-3 animate-ping rounded-full ${STAGE_GLOW[s.id]} opacity-40`}
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-[1] rounded-full transition-all duration-300 ${
                    active
                      ? `h-2.5 w-2.5 ${STAGE_GLOW[s.id]} shadow-[var(--shadow-seg-glow)] ring-2 ring-[var(--surface)] ring-offset-1 ring-offset-[var(--bg)]`
                      : done
                        ? "h-1.5 w-1.5 bg-[var(--primary)]/60"
                        : "h-1.5 w-1.5 bg-[var(--line-strong)]"
                  }`}
                  title={tip}
                />
              </div>
              {/* bar under nodes */}
              <div
                className={`h-1 w-full rounded-full transition-all duration-300 ${
                  active
                    ? `seg-active ${STAGE_GLOW[s.id]}`
                    : done
                      ? "bg-[var(--primary)]/40"
                      : "bg-[var(--line)]"
                }`}
              />
              {/* delayed tooltip */}
              <div
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 max-w-[70vw] -translate-x-1/2 scale-95 whitespace-normal rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1.5 text-center text-[10px] font-medium leading-snug text-[var(--ink)] opacity-0 shadow-[var(--shadow-card)] transition-all duration-150 delay-0 group-hover/seg:scale-100 group-hover/seg:opacity-100 group-hover/seg:delay-200 sm:max-w-none sm:whitespace-nowrap"
                role="tooltip"
              >
                {tip}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span
          className={`stage-badge stage-badge-${current} rounded-md px-2 py-0.5 text-[11px] font-semibold`}
          title={`${def.label} · ${def.hint}`}
        >
          {def.short} · {def.hint}
        </span>
        <span className="font-semibold tabular-nums text-[var(--primary)]">
          {cur + 1}
          <span className="font-normal text-[var(--faint)]">
            /{ORDER_STAGES.length}
          </span>
        </span>
      </div>
    </div>
  );
}
