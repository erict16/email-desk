import type { BoardData } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

const STATS = [
  {
    key: "urgent" as const,
    label: "需立即处理",
    urgent: true,
  },
  { key: "pending" as const, label: "待跟进", urgent: false },
  { key: "follow" as const, label: "报价 / 技术", urgent: false },
  { key: "other" as const, label: "已推进", urgent: false },
];

export default function Board({ board }: { board: BoardData }) {
  let globalIndex = 0;

  return (
    <div className="min-h-full">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-5"
      >
        <header className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1 text-sm text-[var(--muted)]">
              {board.subtitle}
              {board.updated ? ` · 更新 ${board.updated}` : ""}
            </p>
          )}
        </header>

        {/* Overview — only urgent number is red */}
        <section className="mb-7 grid grid-cols-4 gap-2.5" aria-label="总览">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-2 py-3.5 text-center"
            >
              <div
                className={`text-[1.85rem] font-semibold leading-none tracking-tight tabular-nums ${
                  s.urgent ? "text-[var(--urgent)]" : "text-[var(--fg)]"
                }`}
              >
                {board.stats[s.key]}
              </div>
              <div className="mt-1.5 text-[10px] font-medium leading-tight text-[var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {board.priorities.length > 0 && (
          <section className="mb-7 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              本周优先
            </div>
            <ol className="list-decimal space-y-1.5 pl-4 text-sm text-[var(--fg)]">
              {board.priorities.map((p, i) => (
                <li key={i} className="leading-relaxed pl-0.5">
                  {p}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="space-y-7">
          {board.sections.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <section key={section.id}>
                <div className="mb-2.5 flex items-baseline gap-2 border-b border-[var(--line)] pb-2">
                  <h2 className="text-sm font-semibold text-[var(--fg)]">
                    {section.title}
                  </h2>
                  <span className="text-xs tabular-nums text-neutral-400">
                    {section.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${section.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
