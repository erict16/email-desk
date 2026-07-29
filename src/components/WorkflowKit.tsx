import { ORDER_STAGES } from "@/lib/order-stages";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

/**
 * Bottom workflow legend: 7 stages, writing rule, Hub + selector links.
 * Teaching layer for Desk as dispatch core — not decoration.
 */
export default function WorkflowKit() {
  return (
    <details className="mt-[var(--gap-section)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]">
      <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>工作流</span>
          <span className="text-[11px] font-medium text-[var(--faint)]">
            图例 · 写法 · 工具
          </span>
        </span>
      </summary>

      <div className="space-y-4 border-t border-[var(--line)] px-4 py-4">
        {/* 7 stages */}
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
            订单阶段
          </div>
          <ol className="flex flex-col gap-1.5">
            {ORDER_STAGES.map((s, i) => (
              <li
                key={s.id}
                className="flex items-baseline gap-2 text-[13px] leading-snug"
              >
                <span className="w-4 shrink-0 tabular-nums text-[11px] text-[var(--faint)]">
                  {i + 1}
                </span>
                <span className="min-w-[2.5rem] font-semibold text-[var(--pipe)]">
                  {s.short}
                </span>
                <span className="text-[var(--ink)]">{s.label}</span>
                <span className="text-[var(--faint)]">· {s.hint}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Writing rule */}
        <p className="text-[13px] leading-relaxed text-[var(--muted)]">
          标题可搜邮箱 · Todo=你要动 · Order=项目在哪
        </p>

        {/* External tools */}
        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]"
          aria-label="相关工具"
        >
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          >
            Huaming Hub ↗
          </a>
          <span className="text-[var(--line-strong)]" aria-hidden>
            ·
          </span>
          <a
            href={SELECTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          >
            选型器 ↗
          </a>
        </nav>
      </div>
    </details>
  );
}
