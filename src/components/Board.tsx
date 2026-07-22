import type { BoardData } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

/** WorkBuddy 四块：紧急 / 需跟进 / 已完成·进展 / 知会·内部 */
const STATS = [
  {
    key: "urgent" as const,
    label: "紧急处理",
    tone: "urgent" as const,
  },
  {
    key: "follow" as const,
    label: "需跟进",
    tone: "follow" as const,
  },
  {
    key: "done" as const,
    label: "已完成 / 进展",
    tone: "done" as const,
  },
  {
    key: "info" as const,
    label: "知会 / 内部",
    tone: "info" as const,
  },
];

const TONE_NUM: Record<(typeof STATS)[number]["tone"], string> = {
  urgent: "text-[var(--urgent)]",
  follow: "text-orange-600 dark:text-orange-400",
  done: "text-emerald-600 dark:text-emerald-400",
  info: "text-sky-600 dark:text-sky-400",
};

export default function Board({ board }: { board: BoardData }) {
  let globalIndex = 0;

  return (
    <div className="min-h-full">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6"
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

        {/* Overview — WorkBuddy-style four blocks with tone colors */}
        <section className="mb-7 grid grid-cols-4 gap-2.5 sm:gap-3" aria-label="总览">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-2 py-3.5 text-center sm:px-3"
            >
              <div
                className={`text-[1.85rem] font-semibold leading-none tracking-tight tabular-nums ${TONE_NUM[s.tone]}`}
              >
                {board.stats[s.key]}
              </div>
              <div className="mt-1.5 text-[10px] font-medium leading-tight text-[var(--muted)] sm:text-[11px]">
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
