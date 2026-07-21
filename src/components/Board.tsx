import type { BoardData } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

const STATS = [
  { key: "urgent" as const, label: "需立即处理" },
  { key: "pending" as const, label: "待跟进" },
  { key: "follow" as const, label: "报价 / 技术" },
  { key: "other" as const, label: "已推进" },
];

export default function Board({ board }: { board: BoardData }) {
  let globalIndex = 0;

  return (
    <div className="min-h-full">
      <AppHeader title={board.title} />

      <div
        id="email-desk-print"
        className="mx-auto w-full max-w-2xl px-4 py-7 sm:px-5"
      >
        {/* Title */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="logo.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl bg-white object-cover shadow-sm ring-1 ring-black/5"
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-[var(--fg)] sm:text-2xl">
                {board.title}
              </h1>
              {board.subtitle && (
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  {board.subtitle}
                  {board.updated ? ` · 更新 ${board.updated}` : ""}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Overview — clean numbers */}
        <section
          className="mb-6 grid grid-cols-4 gap-2"
          aria-label="总览"
        >
          {STATS.map((s) => (
            <div
              key={s.key}
              className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-2 py-3 text-center shadow-sm"
            >
              <div className="text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-[var(--fg)]">
                {board.stats[s.key]}
              </div>
              <div className="mt-1.5 text-[10px] font-medium leading-tight text-[var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {board.priorities.length > 0 && (
          <section className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 shadow-sm">
            <div className="mb-1.5 text-[11px] font-semibold text-[var(--muted)]">
              本周优先
            </div>
            <ol className="list-decimal space-y-1 pl-4 text-sm text-[var(--fg)]">
              {board.priorities.map((p, i) => (
                <li key={i} className="leading-relaxed">
                  {p}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="space-y-6">
          {board.sections.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <section key={section.id}>
                <div className="mb-2 flex items-center gap-2">
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

        <p className="print:hidden mt-8 text-center text-[11px] text-neutral-400">
          content/board.md
        </p>
      </div>
    </div>
  );
}
