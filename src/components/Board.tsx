import type { BoardData, BoardItem, Priority } from "@/lib/parse-board";
import { isOrderItem } from "@/lib/parse-board";
import {
  ORDER_STAGES,
  compareByStageThenTitle,
  type OrderStageId,
} from "@/lib/order-stages";
import Card from "@/components/Card";
import OrderCard from "@/components/OrderCard";
import AppHeader from "@/components/AppHeader";
import StatsNav from "@/components/StatsNav";

/** 紧急 → 需跟进 → 订单 */
const TRIAGE = [
  {
    key: "urgent" as const,
    id: "block-urgent",
    label: "紧急",
    tone: "urgent" as const,
    match: (p: Priority) => p === "P0",
    sectionTitle: "紧急",
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
    label: "订单",
    tone: "orders" as const,
    sectionTitle: "订单",
  },
] as const;

function SectionHead({
  tone,
  title,
  count,
}: {
  tone: string;
  title: string;
  count: number;
}) {
  const color =
    tone === "urgent"
      ? "var(--urgent)"
      : tone === "follow"
        ? "var(--follow)"
        : "var(--orders)";
  return (
    <h2 className="mb-4 flex items-baseline gap-2 border-b border-[var(--line)] pb-2.5">
      <span
        className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <span className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">
        {title}
      </span>
      <span className="text-[12px] tabular-nums text-[var(--faint)]">
        {count}
      </span>
    </h2>
  );
}

function StageLane({
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
    <div className="mb-[var(--gap-lane)] last:mb-0">
      <div className="mb-2.5 flex items-baseline gap-2">
        <h3 className="text-[12px] font-semibold text-[var(--ink)]">
          {def.label}
        </h3>
        <span className="text-[11px] text-[var(--faint)]">{def.hint}</span>
        <span className="ml-auto text-[11px] tabular-nums text-[var(--faint)]">
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-[var(--gap-card)]">
        {items.map((item) => {
          idx += 1;
          return (
            <OrderCard key={`order-${item.title}`} item={item} index={idx} />
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
        : board.stats[s.key as "urgent" | "follow"],
  }));

  return (
    <div id="top" className="min-h-full bg-[var(--paper)]">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-[var(--measure)] px-4 pb-16 pt-6 sm:px-6"
      >
        {/* page intro */}
        <header className="mb-6">
          <h1 className="text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.025em] text-[var(--ink)] sm:text-[1.65rem]">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1.5 text-[13px] leading-normal text-[var(--muted)]">
              {board.subtitle}
              {board.updated ? ` · ${board.updated}` : ""}
            </p>
          )}
        </header>

        <StatsNav stats={statItems} />

        {board.meetings.length > 0 && (
          <section className="mb-[var(--gap-section)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-4 py-3.5">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
              会议
            </div>
            <ul className="flex flex-col gap-2 text-[13px] leading-snug text-[var(--ink)]">
              {board.meetings.map((m, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]"
                    aria-hidden
                  />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col gap-[var(--gap-section)]">
          {TRIAGE.filter((b) => b.key !== "orders").map((block) => {
            const items = allItems.filter((it) => block.match(it.priority));
            if (items.length === 0) return null;
            return (
              <section
                key={block.id}
                id={block.id}
                className="scroll-mt-[calc(var(--banner-height)+1rem)]"
              >
                <SectionHead
                  tone={block.tone}
                  title={block.sectionTitle}
                  count={items.length}
                />
                <div className="flex flex-col gap-[var(--gap-card)]">
                  {items.map((item) => {
                    globalIndex += 1;
                    return (
                      <Card
                        key={`${block.id}-${item.title}`}
                        item={item}
                        index={globalIndex}
                        hideAction={false}
                        showStripe={block.key === "urgent"}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}

          {orderItems.length > 0 && (
            <section
              id="block-orders"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="orders"
                title="订单"
                count={orderItems.length}
              />

              <div className="mb-4 flex flex-wrap gap-1.5">
                {ORDER_STAGES.map((s) => {
                  const n = orderItems.filter((i) => i.stage === s.id).length;
                  if (n === 0) return null;
                  return (
                    <a
                      key={s.id}
                      href={`#order-stage-${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-medium leading-none text-[var(--ink)] transition-colors duration-150 hover:bg-[var(--paper-2)]"
                    >
                      {s.short}
                      <span className="tabular-nums text-[var(--faint)]">
                        {n}
                      </span>
                    </a>
                  );
                })}
              </div>

              {ORDER_STAGES.map((s) => {
                const items = orderItems.filter((i) => i.stage === s.id);
                if (items.length === 0) return null;
                const start = globalIndex;
                globalIndex += items.length;
                return (
                  <div
                    key={s.id}
                    id={`order-stage-${s.id}`}
                    className="scroll-mt-[calc(var(--banner-height)+1.25rem)]"
                  >
                    <StageLane
                      stageId={s.id}
                      items={items}
                      startIndex={start}
                    />
                  </div>
                );
              })}

              {(() => {
                const unstaged = orderItems.filter((i) => !i.stage);
                if (unstaged.length === 0) return null;
                return (
                  <div>
                    <h3 className="mb-2.5 text-[12px] font-semibold text-[var(--muted)]">
                      未标阶段
                    </h3>
                    <div className="flex flex-col gap-[var(--gap-card)]">
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
        </div>
      </main>
    </div>
  );
}
