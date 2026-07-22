import type { BoardData, BoardItem, Priority } from "@/lib/parse-board";
import Card from "@/components/Card";
import AppHeader from "@/components/AppHeader";

/**
 * Order: 紧急 → 需跟进 → 知会 → 已完成
 * Section title: crisp SVG mark + text + thin bottom hairline (no vertical bar)
 * Only 紧急 cards get left accent stripe (flush to rounded edge)
 */
const STATS = [
  {
    key: "urgent" as const,
    id: "block-urgent",
    label: "紧急处理",
    tone: "urgent" as const,
    match: (p: Priority) => p === "P0",
    sectionTitle: "紧急处理",
    hideAction: false,
    stripe: true,
  },
  {
    key: "follow" as const,
    id: "block-follow",
    label: "需跟进",
    tone: "follow" as const,
    match: (p: Priority) => p === "P1" || p === "P2",
    sectionTitle: "需跟进",
    hideAction: false,
    stripe: false,
  },
  {
    key: "info" as const,
    id: "block-info",
    label: "知会",
    tone: "info" as const,
    match: (p: Priority) => p === "FYI",
    sectionTitle: "知会",
    hideAction: true,
    stripe: false,
  },
  {
    key: "done" as const,
    id: "block-done",
    label: "已完成",
    tone: "done" as const,
    match: (p: Priority) => p === "OK",
    sectionTitle: "已完成",
    hideAction: true,
    stripe: false,
  },
];

const TONE_NUM: Record<(typeof STATS)[number]["tone"], string> = {
  urgent: "text-[var(--urgent)]",
  follow: "text-[var(--follow)]",
  done: "text-[var(--done)]",
  info: "text-[var(--info)]",
};

const TONE_HOVER: Record<(typeof STATS)[number]["tone"], string> = {
  urgent:
    "hover:-translate-y-0.5 hover:border-[var(--urgent-border)] hover:bg-[var(--urgent-soft)] hover:shadow-md",
  follow:
    "hover:-translate-y-0.5 hover:border-[var(--follow-border)] hover:bg-[var(--follow-soft)] hover:shadow-md",
  done:
    "hover:-translate-y-0.5 hover:border-[var(--done-border)] hover:bg-[var(--done-soft)] hover:shadow-md",
  info:
    "hover:-translate-y-0.5 hover:border-[var(--info-border)] hover:bg-[var(--info-soft)] hover:shadow-md",
};

const MARK_COLOR: Record<(typeof STATS)[number]["tone"], string> = {
  urgent: "var(--urgent)",
  follow: "var(--follow)",
  done: "var(--done)",
  info: "var(--info)",
};

/** Crisp vector marks — no system emoji blur on Windows */
function SectionMark({ tone }: { tone: (typeof STATS)[number]["tone"] }) {
  const c = MARK_COLOR[tone];
  if (tone === "done") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="shrink-0"
        aria-hidden
      >
        <circle cx="8" cy="8" r="7" fill={c} />
        <path
          d="M4.8 8.2l2.1 2.1 4.3-4.4"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // solid disc for urgent / follow / info
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="6" cy="6" r="5" fill={c} />
    </svg>
  );
}

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

        <section
          className="mb-7 grid grid-cols-4 gap-2.5 sm:gap-3"
          aria-label="总览"
        >
          {STATS.map((s) => (
            <a
              key={s.key}
              href={`#${s.id}`}
              className={`rounded-xl border border-[var(--line)] bg-[var(--card)] px-2 py-3.5 text-center sm:px-3 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 active:scale-[0.98] ${TONE_HOVER[s.tone]}`}
            >
              <div
                className={`text-[1.85rem] font-bold leading-none tracking-tight tabular-nums ${TONE_NUM[s.tone]}`}
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
          <section className="mb-8 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 transition-shadow duration-200 hover:shadow-sm">
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

        <div className="space-y-9">
          {STATS.map((block) => {
            const items = allItems.filter((it) => block.match(it.priority));
            if (items.length === 0) return null;
            return (
              <section key={block.id} id={block.id} className="scroll-mt-20">
                {/* Thin horizontal rule under title — no vertical bar */}
                <h2 className="mb-3.5 flex items-center gap-2 border-b border-[var(--line)] pb-2.5 text-[15px] font-semibold text-[var(--fg)]">
                  <SectionMark tone={block.tone} />
                  <span>{block.sectionTitle}</span>
                  <span className="text-xs font-medium tabular-nums text-neutral-400">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                        hideAction={block.hideAction}
                        showStripe={block.stripe}
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
