import type { BoardData, BoardItem, Priority } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

/** WorkBuddy 四块：紧急 / 需跟进 / 已完成·进展 / 知会·内部 */
const STATS = [
  {
    key: "urgent" as const,
    id: "block-urgent",
    label: "紧急处理",
    tone: "urgent" as const,
    match: (p: Priority) => p === "P0",
    sectionTitle: "紧急处理",
  },
  {
    key: "follow" as const,
    id: "block-follow",
    label: "需跟进",
    tone: "follow" as const,
    match: (p: Priority) => p === "P1" || p === "P2",
    sectionTitle: "需跟进",
  },
  {
    key: "done" as const,
    id: "block-done",
    label: "已完成 / 进展",
    tone: "done" as const,
    match: (p: Priority) => p === "OK",
    sectionTitle: "已推进",
  },
  {
    key: "info" as const,
    id: "block-info",
    label: "知会 / 内部",
    tone: "info" as const,
    match: (p: Priority) => p === "FYI",
    sectionTitle: "知会",
  },
];

const TONE_NUM: Record<(typeof STATS)[number]["tone"], string> = {
  urgent: "text-[var(--urgent)]",
  follow: "text-orange-600 dark:text-orange-400",
  done: "text-emerald-600 dark:text-emerald-400",
  info: "text-sky-600 dark:text-sky-400",
};

const TONE_HOVER: Record<(typeof STATS)[number]["tone"], string> = {
  urgent:
    "hover:border-rose-300 hover:bg-rose-50/70 hover:shadow-sm dark:hover:border-rose-800 dark:hover:bg-rose-950/40",
  follow:
    "hover:border-orange-300 hover:bg-orange-50/70 hover:shadow-sm dark:hover:border-orange-800 dark:hover:bg-orange-950/30",
  done:
    "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-sm dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30",
  info:
    "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sm dark:hover:border-sky-800 dark:hover:bg-sky-950/30",
};

export default function Board({ board }: { board: BoardData }) {
  const allItems: BoardItem[] = board.sections.flatMap((s) => s.items);
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

        {/* Overview — clickable anchors + hover */}
        <section
          className="mb-7 grid grid-cols-4 gap-2.5 sm:gap-3"
          aria-label="总览"
        >
          {STATS.map((s) => (
            <a
              key={s.key}
              href={`#${s.id}`}
              className={`rounded-xl border border-[var(--line)] bg-[var(--card)] px-2 py-3.5 text-center sm:px-3 transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 active:scale-[0.98] ${TONE_HOVER[s.tone]}`}
            >
              <div
                className={`text-[1.85rem] font-semibold leading-none tracking-tight tabular-nums ${TONE_NUM[s.tone]}`}
              >
                {board.stats[s.key]}
              </div>
              <div className="mt-1.5 text-[10px] font-medium leading-tight text-[var(--muted)] sm:text-[11px]">
                {s.label}
              </div>
            </a>
          ))}
        </section>

        {board.meetings.length > 0 && (
          <section className="mb-7 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              需参加的会议
            </div>
            <ul className="space-y-2 text-sm text-[var(--fg)]">
              {board.meetings.map((m, i) => (
                <li
                  key={i}
                  className="flex gap-2 leading-relaxed before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-sky-500 before:content-['']"
                >
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-7">
          {STATS.map((block) => {
            const items = allItems.filter((it) => block.match(it.priority));
            if (items.length === 0) return null;
            return (
              <section
                key={block.id}
                id={block.id}
                className="scroll-mt-20"
              >
                <div className="mb-2.5 flex items-baseline gap-2 border-b border-[var(--line)] pb-2">
                  <h2 className="text-sm font-semibold text-[var(--fg)]">
                    {block.sectionTitle}
                  </h2>
                  <span className="text-xs tabular-nums text-neutral-400">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
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
