import type { BoardItem } from "@/lib/parse-board";
import {
  ORDER_STAGES,
  stageDef,
  stageIndex,
  stageProgress,
  type OrderStageId,
} from "@/lib/order-stages";

function tagClass(label: string): string {
  const t = label.trim();
  if (/需尽快|优先|紧急|催你|阻塞|卡住/.test(t))
    return "bg-[var(--urgent-soft)] text-[var(--urgent)]";
  if (/待你|待发|待打包|待放行|待补|你欠|等你/.test(t))
    return "bg-[var(--follow-soft)] text-[var(--follow)]";
  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判|等PO|等 PO|PO/.test(t))
    return "bg-[var(--follow-soft)] text-[var(--follow)]";
  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
    return "bg-[var(--orders-soft)] text-[var(--orders)]";
  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产|已签/.test(t))
    return "bg-[var(--paper-2)] text-[var(--muted)]";
  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy|会议/.test(t))
    return "bg-[var(--paper-2)] text-[var(--muted)]";
  if (/缺|售后|物流|补发|顶盖|单证|CI|PL|CO/.test(t))
    return "bg-[var(--orders-soft)] text-[var(--orders)]";
  return "bg-[var(--paper-2)] text-[var(--muted)]";
}

/** Compact progress: dots + fraction, not full pipeline labels */
function StageProgress({ current }: { current: OrderStageId }) {
  const cur = stageIndex(current);
  const { current: n, total } = stageProgress(current);
  const def = stageDef(current);
  return (
    <div
      className="mt-2 flex items-center gap-2"
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
                  ? "var(--orders)"
                  : i === cur
                    ? "var(--ink)"
                    : "var(--line-strong)",
              opacity: i === cur ? 1 : i < cur ? 0.55 : 0.45,
            }}
            title={s.label}
          />
        ))}
      </div>
      <span className="text-[11px] tabular-nums text-[var(--faint)]">
        {n}/{total}
      </span>
    </div>
  );
}

export default function OrderCard({
  item,
  index,
}: {
  item: BoardItem;
  index: number;
}) {
  const stage = item.stage;
  const def = stage ? stageDef(stage) : null;

  return (
    <article className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 shadow-[var(--shadow-whisper)] transition-[border-color,box-shadow] duration-150 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
            title="可复制标题 → 邮箱搜索"
          >
            <span className="mr-1.5 font-medium tabular-nums text-[var(--faint)]">
              {index}.
            </span>
            {item.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--muted)]">
            {item.customer && (
              <span className="font-medium text-[var(--ink)]/80">
                {item.customer}
              </span>
            )}
            {def && (
              <span className="inline-flex items-center rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--ink)]">
                {def.label}
              </span>
            )}
          </div>
        </div>
        {item.date && (
          <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-[var(--faint)]">
            {item.date}
          </span>
        )}
      </div>

      {stage && <StageProgress current={stage} />}

      {item.meta && (
        <p className="mt-2 text-[13px] leading-snug text-[var(--muted)]">
          {item.meta}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[10px] font-medium ${tagClass(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {item.people && (
        <p className="mt-1.5 text-[11px] text-[var(--faint)]">
          {item.people}
        </p>
      )}

      {item.action && (
        <p className="mt-2 border-l-2 border-[var(--orders)] pl-2.5 text-[13px] leading-snug text-[var(--ink)]">
          <span className="font-medium text-[var(--orders)]">卡点 </span>
          {item.action}
        </p>
      )}
    </article>
  );
}
