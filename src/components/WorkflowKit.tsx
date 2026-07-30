import { ORDER_STAGES } from "@/lib/order-stages";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

export default function WorkflowKit() {
  return (
    <details className="mt-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      <summary className="cursor-pointer list-none px-4 py-3.5 text-[13px] font-semibold text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>工作流图例</span>
          <span className="text-[12px] font-medium text-[var(--faint)]">
            阶段 · 写法 · 工具
          </span>
        </span>
      </summary>
      <div className="space-y-5 border-t border-[var(--line)] px-4 py-5">
        <ol className="flex flex-col gap-2">
          {ORDER_STAGES.map((s, i) => (
            <li
              key={s.id}
              className="flex items-baseline gap-2 text-[13px] leading-snug"
            >
              <span className="w-4 tabular-nums text-[11px] text-[var(--faint)]">
                {i + 1}
              </span>
              <span
                className={`stage-badge stage-badge-${s.id} rounded-md px-1.5 py-0.5 text-[11px] font-semibold`}
              >
                {s.short}
              </span>
              <span className="text-[var(--ink)]">{s.label}</span>
              <span className="text-[var(--faint)]">· {s.hint}</span>
            </li>
          ))}
        </ol>
        <div className="space-y-1.5 text-[13px] text-[var(--mute)]">
          <p>标题 = 邮箱可搜关键词（PO / QS / 项目号）</p>
          <p>
            要我动 · <code className="rounded bg-[var(--surface-2)] px-1 font-mono text-[12px]">ball: me</code>
          </p>
          <p>
            等对方 · <code className="rounded bg-[var(--surface-2)] px-1 font-mono text-[12px]">ball: them</code> + wait
          </p>
        </div>
        <nav className="flex gap-3 border-t border-[var(--line)] pt-4 text-[13px] font-medium text-[var(--primary)]">
          <a href={HUB_URL} target="_blank" rel="noopener noreferrer">
            Huaming Hub ↗
          </a>
          <a href={SELECTOR_URL} target="_blank" rel="noopener noreferrer">
            选型器 ↗
          </a>
        </nav>
      </div>
    </details>
  );
}
