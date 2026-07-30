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

/** Sleek 7-segment pipeline bar with active glow node */
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
          return (
            <div key={s.id} className="flex flex-1 items-center gap-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  active
                    ? `${STAGE_GLOW[s.id]} shadow-[0_0_10px_currentColor] opacity-100`
                    : done
                      ? "bg-[var(--primary)]/50"
                      : "bg-[var(--line)]"
                }`}
                title={s.label}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className={`stage-badge stage-badge-${current} rounded-md px-1.5 py-0.5 font-medium`}>
          {def.short}
        </span>
        <span className="tabular-nums text-[var(--faint)]">
          {cur + 1}/{ORDER_STAGES.length}
        </span>
      </div>
    </div>
  );
}
