import type { BoardData } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

const STATS = [
  {
    key: "urgent" as const,
    label: "需立即处理",
    num: "text-rose-500",
    glow: "from-rose-400/25 to-orange-300/10",
  },
  {
    key: "pending" as const,
    label: "待跟进",
    num: "text-amber-500",
    glow: "from-amber-400/25 to-yellow-300/10",
  },
  {
    key: "follow" as const,
    label: "报价 / 技术",
    num: "text-sky-500",
    glow: "from-sky-400/25 to-cyan-300/10",
  },
  {
    key: "other" as const,
    label: "已推进",
    num: "text-emerald-500",
    glow: "from-emerald-400/20 to-teal-300/10",
  },
];

export default function Board({ board }: { board: BoardData }) {
  let globalIndex = 0;

  return (
    <div className="min-h-full">
      <AppHeader title={board.title} />

      <div
        id="email-desk-print"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10"
      >
        {/* Hero */}
        <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/50 bg-white/45 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7 dark:border-white/10 dark:bg-white/[0.06]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative flex flex-wrap items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="logo.png"
              alt="Hermes Girl"
              width={56}
              height={56}
              className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-sky-500/20 ring-2 ring-white/70 dark:ring-white/15"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700/80 dark:text-sky-300/90">
                Email Desk
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {board.title}
              </h1>
              {board.subtitle && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {board.subtitle}
                  {board.updated ? ` · ${board.updated}` : ""}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Stats */}
        <section
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label="总览"
        >
          {STATS.map((s) => (
            <div
              key={s.key}
              className={`rounded-2xl border border-white/50 bg-gradient-to-br ${s.glow} bg-white/55 px-4 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]`}
            >
              <div
                className={`text-3xl font-bold tabular-nums tracking-tight ${s.num}`}
              >
                {board.stats[s.key]}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {board.priorities.length > 0 && (
          <section className="mb-8 rounded-2xl border border-white/50 bg-white/55 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              本周优先 · 先做这三件
            </div>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-800 dark:text-slate-100">
              {board.priorities.map((p, i) => (
                <li key={i} className="leading-relaxed">
                  {p}
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="space-y-8">
          {board.sections.map((section) => {
            if (section.items.length === 0) return null;
            const isTodo = section.id === "todo";
            return (
              <section key={section.id}>
                <div className="mb-3 flex items-center gap-2 border-b border-white/40 pb-2 dark:border-white/10">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shadow-sm ${
                      isTodo
                        ? "bg-rose-500 shadow-rose-500/40"
                        : section.id === "done"
                          ? "bg-emerald-500 shadow-emerald-500/40"
                          : "bg-slate-400"
                    }`}
                  />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {section.items.length}
                  </span>
                </div>

                <div className="space-y-3">
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

        <p className="print:hidden mt-10 text-center text-[11px] text-slate-400">
          改{" "}
          <code className="rounded bg-white/50 px-1 dark:bg-white/10">
            content/board.md
          </code>{" "}
          → push 即可更新
        </p>
      </div>
    </div>
  );
}
