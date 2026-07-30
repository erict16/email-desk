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

/** 7-segment pipeline with hover tooltips for stage definitions */
export default function SegmentProgress({
  current,
}: {
  current: OrderStageId;
}) {
  const cur = stageIndex(current);
  const def = stageDef(current);

  return (
    <div className="flex flex-col gap-1.5" aria-label={`${def.label}`}>
      <div className="flex items-center gap-1">
        {ORDER_STAGES.map((s, i) => {
          const done = i < cur;
          const active = i === cur;
          const tip = `${i + 1}. ${s.label} — ${s.hint}`;
          return (
            <div
              key={s.id}
              className="group/seg relative flex flex-1 items-center"
            >
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  active
                    ? `${STAGE_GLOW[s.id]} opacity-100 shadow-[0_0_12px_currentColor]`
                    : done
                      ? "bg-[var(--primary)]/55"
                      : "bg-[var(--line)]"
                }`}
                title={tip}
              />
              {/* tooltip */}
              <div
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[10px] font-medium text-[var(--ink)] shadow-[var(--shadow-hover)] group-hover/seg:block"
                role="tooltip"
              >
                {tip}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span
          className={`stage-badge stage-badge-${current} rounded-md px-1.5 py-0.5 font-medium`}
          title={`${def.label} · ${def.hint}`}
        >
          {def.short} · {def.hint}
        </span>
        <span className="tabular-nums text-[var(--faint)]">
          {cur + 1}/{ORDER_STAGES.length}
        </span>
      </div>
    </div>
  );
}
