import { ORDER_STAGES } from "@/lib/order-stages";

const HUB_URL = "https://erict16.github.io/huaming-hub/";
const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";

export default function WorkflowKit() {
  return (
    <details className="mt-12 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] shadow-[var(--shadow-card)]">
      <summary className="cursor-pointer list-none px-4 py-3.5 text-[13px] font-semibold text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>工作流图例</span>
          <span className="text-[12px] font-medium text-[var(--faint)]">
            阶段 · 写法 · 工具
          </span>
        </span>
      </summary>

      <div className="space-y-6 border-t border-[var(--line)] px-4 py-5">
        <div>
          <div className="mb-3 text-[11px] font-medium text-[var(--faint)]">
            订单阶段
          </div>
          <ol className="flex flex-col gap-2.5">
            {ORDER_STAGES.map((s, i) => (
              <li
                key={s.id}
                className="flex items-baseline gap-2.5 text-[13px] leading-snug"
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

        <div className="space-y-2 text-[13px] leading-relaxed text-[var(--mute)]">
          <p>标题 = 邮箱可搜关键词（PO / QS / 项目号）</p>
          <p>
            <span className="font-medium text-[var(--action-ink)]">要我动</span>
            {" · "}
            <code className="rounded bg-[var(--paper-2)] px-1.5 py-0.5 font-mono text-[12px]">
              ball: me
            </code>
            {" + action"}
          </p>
          <p>
            <span className="font-medium text-[var(--wait-ink)]">等对方</span>
            {" · "}
            <code className="rounded bg-[var(--paper-2)] px-1.5 py-0.5 font-mono text-[12px]">
              ball: them
            </code>
            {" + wait"}
          </p>
          <p>
            <span className="font-medium text-[var(--pipe)]">管线</span>
            {" · 只答项目阶段；旁听单不写 todo"}
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)] pt-4 text-[13px]"
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
