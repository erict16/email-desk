import type { BoardData, BoardItem, Priority } from "@/lib/parse-board";
import { isOrderItem } from "@/lib/parse-board";
import {
  ORDER_PHASES,
  ORDER_STAGES,
  compareByStageThenTitle,
  type OrderStageId,
} from "@/lib/order-stages";
import Card from "@/components/Card";
import OrderCard from "@/components/OrderCard";
import AppHeader from "@/components/AppHeader";
import StatsNav from "@/components/StatsNav";

/** 紧急 → 需跟进 → 订单跟踪 → 知会 */
const TRIAGE = [
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
    key: "orders" as const,
    id: "block-orders",
    label: "订单跟踪",
    tone: "orders" as const,
    sectionTitle: "订单跟踪",
  },
  {
    key: "info" as const,
    id: "block-info",
    label: "知会",
    tone: "info" as const,
    match: (p: Priority) => p === "FYI",
    sectionTitle: "知会",
  },
];

const MARK_COLOR: Record<string, string> = {
  urgent: "var(--urgent)",
  follow: "var(--follow)",
  orders: "var(--orders)",
  info: "var(--info)",
};

function SectionMark({ tone }: { tone: string }) {
  const c = MARK_COLOR[tone] ?? "var(--muted)";
  if (tone === "orders") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="shrink-0"
        aria-hidden
      >
        <rect x="1.5" y="3" width="13" height="10" rx="2" fill={c} />
        <path
          d="M4 7h8M4 10h5"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
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

function StageBucket({
  stageId,
  items,
  startIndex,
}: {
  stageId: OrderStageId;
  items: BoardItem[];
  startIndex: number;
}) {
  const def = ORDER_STAGES.find((s) => s.id === stageId)!;
  let idx = startIndex;
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-baseline gap-2">
        <h4 className="text-[13px] font-semibold text-indigo-900 dark:text-indigo-200">
          {def.label}
        </h4>
        <span className="text-[11px] text-neutral-400">{def.hint}</span>
        <span className="text-[11px] font-medium tabular-nums text-neutral-400">
          {items.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => {
          idx += 1;
          return (
            <OrderCard
              key={`order-${item.title}`}
              item={item}
              index={idx}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Board({ board }: { board: BoardData }) {
  const allItems: BoardItem[] = board.sections.flatMap((s) => s.items);
  let globalIndex = 0;

  const orderItems = allItems
    .filter(isOrderItem)
    .sort(compareByStageThenTitle);

  const statItems = TRIAGE.map((s) => ({
    key: s.key,
    id: s.id,
    label: s.label,
    tone: s.tone,
    value:
      s.key === "orders"
        ? board.stats.orders
        : board.stats[s.key as "urgent" | "follow" | "info"],
  }));

  return (
    <div id="top" className="min-h-full">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6"
      >
        <header className="mb-6">
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

        <StatsNav stats={statItems} />

        {board.meetings.length > 0 && (
          <section className="mb-7 rounded-xl border border-[var(--line)] bg-[var(--card)] p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              会议
            </div>
            <ul className="space-y-1.5 text-sm text-[var(--fg)]">
              {board.meetings.map((m, i) => (
                <li
                  key={i}
                  className="flex gap-2 leading-snug before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-sky-500 before:content-['']"
                >
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-8">
          {/* 紧急 */}
          {(() => {
            const block = TRIAGE[0];
            const items = allItems.filter((it) => block.match!(it.priority));
            if (items.length === 0) return null;
            return (
              <section key={block.id} id={block.id} className="scroll-mt-20">
                <h2 className="mb-3 flex items-center gap-2 border-b border-[var(--line)] pb-2 text-[15px] font-semibold text-[var(--fg)]">
                  <SectionMark tone={block.tone} />
                  <span>{block.sectionTitle}</span>
                  <span className="text-xs font-medium tabular-nums text-neutral-400">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-2.5">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                        hideAction={false}
                        showStripe
                      />
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* 需跟进 */}
          {(() => {
            const block = TRIAGE[1];
            const items = allItems.filter((it) => block.match!(it.priority));
            if (items.length === 0) return null;
            return (
              <section key={block.id} id={block.id} className="scroll-mt-20">
                <h2 className="mb-3 flex items-center gap-2 border-b border-[var(--line)] pb-2 text-[15px] font-semibold text-[var(--fg)]">
                  <SectionMark tone={block.tone} />
                  <span>{block.sectionTitle}</span>
                  <span className="text-xs font-medium tabular-nums text-neutral-400">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-2.5">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                        hideAction={false}
                        showStripe={false}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* 订单跟踪 — 按完成度：询价 → 成交 → 履约 */}
          {orderItems.length > 0 && (
            <section id="block-orders" className="scroll-mt-20">
              <h2 className="mb-3 flex items-center gap-2 border-b border-[var(--line)] pb-2 text-[15px] font-semibold text-[var(--fg)]">
                <SectionMark tone="orders" />
                <span>订单跟踪</span>
                <span className="text-xs font-medium tabular-nums text-neutral-400">
                  {orderItems.length}
                </span>
              </h2>

              {/* Stage jump chips */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {ORDER_STAGES.map((s) => {
                  const n = orderItems.filter((i) => i.stage === s.id).length;
                  if (n === 0) return null;
                  return (
                    <a
                      key={s.id}
                      href={`#order-stage-${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-medium text-indigo-900 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-100"
                    >
                      {s.short}
                      <span className="tabular-nums text-indigo-600 dark:text-indigo-300">
                        {n}
                      </span>
                    </a>
                  );
                })}
                {orderItems.filter((i) => !i.stage).length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                    未标
                    <span className="tabular-nums">
                      {orderItems.filter((i) => !i.stage).length}
                    </span>
                  </span>
                )}
              </div>

              {ORDER_PHASES.map((phase) => {
                const phaseItems = orderItems.filter(
                  (i) => i.stage && phase.stageIds.includes(i.stage),
                );
                if (phaseItems.length === 0) return null;

                return (
                  <div
                    key={phase.id}
                    id={`order-phase-${phase.id}`}
                    className="mb-6 last:mb-0"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
                        {phase.label}
                      </h3>
                      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                      <span className="text-[11px] tabular-nums text-neutral-400">
                        {phaseItems.length}
                      </span>
                    </div>

                    {phase.stageIds.map((sid) => {
                      const items = orderItems.filter((i) => i.stage === sid);
                      if (items.length === 0) return null;
                      const start = globalIndex;
                      globalIndex += items.length;
                      return (
                        <div
                          key={sid}
                          id={`order-stage-${sid}`}
                          className="scroll-mt-24"
                        >
                          <StageBucket
                            stageId={sid}
                            items={items}
                            startIndex={start}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {(() => {
                const unstaged = orderItems.filter((i) => !i.stage);
                if (unstaged.length === 0) return null;
                return (
                  <div className="mb-4">
                    <div className="mb-2 flex items-baseline gap-2">
                      <h3 className="text-[13px] font-semibold text-neutral-600">
                        未标阶段
                      </h3>
                      <span className="text-[11px] text-neutral-400">
                        补 stage:
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {unstaged.map((item) => {
                        globalIndex += 1;
                        return (
                          <OrderCard
                            key={`order-u-${item.title}`}
                            item={item}
                            index={globalIndex}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {/* 知会 */}
          {(() => {
            const block = TRIAGE[3];
            const items = allItems.filter((it) => block.match!(it.priority));
            if (items.length === 0) return null;
            return (
              <section key={block.id} id={block.id} className="scroll-mt-20">
                <h2 className="mb-3 flex items-center gap-2 border-b border-[var(--line)] pb-2 text-[15px] font-semibold text-[var(--fg)]">
                  <SectionMark tone={block.tone} />
                  <span>{block.sectionTitle}</span>
                  <span className="text-xs font-medium tabular-nums text-neutral-400">
                    {items.length}
                  </span>
                </h2>
                <div className="space-y-2.5">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                        hideAction
                        showStripe={false}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
