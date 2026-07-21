import type { BoardData } from "@/lib/parse-board";
import Column from "@/components/Column";

export default function Board({ board }: { board: BoardData }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Hero */}
      <header className="relative mb-5 overflow-hidden rounded-3xl border border-white/40 bg-white/30 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.1)] backdrop-blur-2xl sm:p-7 dark:border-white/10 dark:bg-white/[0.07]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700/80 dark:text-sky-300/90">
                Email Desk
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                {board.title}
              </h1>
              {board.subtitle && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {board.subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {board.updated && (
                <span className="rounded-full border border-white/50 bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                  {board.updated}
                </span>
              )}
              {board.badge && (
                <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200">
                  {board.badge}
                </span>
              )}
            </div>
          </div>

          {board.priorities.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/50 bg-white/45 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                本周优先 · 你先做这三件
              </div>
              <ol className="space-y-1.5 pl-4 text-sm text-slate-800 marker:font-semibold dark:text-slate-100">
                {board.priorities.map((p, i) => (
                  <li key={i} className="list-decimal leading-relaxed">
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </header>

      {/* Kanban columns — WorkBuddy-like */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {board.columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-500 dark:text-slate-500">
        内容来源 <code className="rounded bg-white/40 px-1 dark:bg-white/10">content/board.md</code>
        · 日常只需改 Markdown
      </p>
    </div>
  );
}
