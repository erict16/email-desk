import type { BoardData } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

const STATS = [
  {
    key: "urgent" as const,
    label: "需立即处理",
    color: "text-red-600 dark:text-red-400",
  },
  {
    key: "pending" as const,
    label: "待跟进 / P1",
    color: "text-neutral-900 dark:text-white",
  },
  {
    key: "follow" as const,
    label: "报价 / 技术",
    color: "text-neutral-600 dark:text-neutral-300",
  },
  {
    key: "other" as const,
    label: "已推进 / FYI",
    color: "text-neutral-400",
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
        {/* Page title block */}
        <header className="mb-8">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl print:text-xl" aria-hidden>
              📧
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Email Desk
            </p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {board.subtitle}
              {board.updated ? ` · ${board.updated}` : ""}
            </p>
          )}
        </header>

        {/* Overview stats */}
        <section
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label="总览"
        >
          {STATS.map((s) => (
            <div
              key={s.key}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div
                className={`text-3xl font-bold tabular-nums tracking-tight ${s.color}`}
              >
                {board.stats[s.key]}
              </div>
              <div className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {board.priorities.length > 0 && (
          <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              本周优先 · 先做这三件
            </div>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-800 dark:text-neutral-100">
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
                <div className="mb-3 flex items-center gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isTodo
                        ? "bg-neutral-900 dark:bg-white"
                        : section.id === "done"
                          ? "bg-neutral-400"
                          : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                  />
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {section.title}
                  </h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
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

        <p className="print:hidden mt-10 text-center text-[11px] text-neutral-400">
          改{" "}
          <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">
            content/board.md
          </code>{" "}
          → push 即可更新
        </p>
      </div>
    </div>
  );
}
