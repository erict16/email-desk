import type { BoardData, BoardItem } from "@/lib/parse-board";
import { buildDeskView } from "@/lib/board-view";
import { titleKey } from "@/lib/title-key";
import {
  ORDER_STAGES,
  stageDef,
  type OrderStageId,
} from "@/lib/order-stages";
import ActionCard from "@/components/ActionCard";
import OrderCard from "@/components/OrderCard";
import AppHeader from "@/components/AppHeader";
import FocusStrip from "@/components/FocusStrip";
import WorkflowKit from "@/components/WorkflowKit";

function SectionHead({
  tone,
  title,
  count,
}: {
  tone: "urgent" | "orders" | "later";
  title: string;
  count: number;
}) {
  const color =
    tone === "urgent"
      ? "var(--urgent)"
      : tone === "orders"
        ? "var(--pipe)"
        : "var(--mute)";
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
  linkedKeys,
  hasTodayOrLater,
}: {
  stageId: OrderStageId;
  items: BoardItem[];
  startIndex: number;
  linkedKeys: Set<string>;
  hasTodayOrLater: (key: string) => boolean;
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
          const key = titleKey(item.title);
          const hasTodayLink = linkedKeys.has(key) && hasTodayOrLater(key);
          return (
            <OrderCard
              key={`order-${item.title}`}
              item={item}
              index={idx}
              hasTodayLink={hasTodayLink}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Resolve pipeline stage label for a triage title, if linked. */
function linkedStageLabel(
  title: string,
  orders: BoardItem[],
  linkedKeys: Set<string>,
): string | undefined {
  const key = titleKey(title);
  if (!linkedKeys.has(key)) return undefined;
  const order = orders.find((o) => titleKey(o.title) === key);
  if (!order?.stage) return undefined;
  return stageDef(order.stage).label;
}

export default function Board({ board }: { board: BoardData }) {
  const view = buildDeskView(board);
  let globalIndex = 0;

  const todayOrLaterKeys = new Set([
    ...view.today.map((i) => titleKey(i.title)),
    ...view.later.map((i) => titleKey(i.title)),
  ]);
  const hasTodayOrLater = (key: string) => todayOrLaterKeys.has(key);

  const laterCollapsed = view.later.length > 3;

  // Pre-assign display indices so Later doesn't need render-time mutation.
  const todayStart = 0;
  const pipelineStart = view.today.length;
  const laterStart =
    pipelineStart +
    view.orders.length;

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

        <FocusStrip meetings={view.meetings} stats={view.stats} />

        <div className="flex flex-col gap-[var(--gap-section)]">
          {/* ── 今日行动 ── */}
          {view.today.length > 0 && (
            <section
              id="today"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="urgent"
                title="今日行动"
                count={view.today.length}
              />
              <div className="flex flex-col gap-[var(--gap-card)]">
                {view.today.map((item, i) => {
                  const linkedStage = linkedStageLabel(
                    item.title,
                    view.orders,
                    view.linkedKeys,
                  );
                  return (
                    <ActionCard
                      key={`today-${item.title}`}
                      item={item}
                      index={todayStart + i + 1}
                      urgent={item.priority === "P0"}
                      linkedStage={linkedStage}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 订单管线 ── */}
          {view.orders.length > 0 && (
            <section
              id="pipeline"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="orders"
                title="订单管线"
                count={view.orders.length}
              />

              <div className="mb-4 flex flex-wrap gap-1.5">
                {ORDER_STAGES.map((s) => {
                  const n = view.orders.filter((i) => i.stage === s.id).length;
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
                const items = view.orders.filter((i) => i.stage === s.id);
                if (items.length === 0) return null;
                const start = pipelineStart + globalIndex;
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
                      linkedKeys={view.linkedKeys}
                      hasTodayOrLater={hasTodayOrLater}
                    />
                  </div>
                );
              })}

              {(() => {
                const unstaged = view.orders.filter((i) => !i.stage);
                if (unstaged.length === 0) return null;
                return (
                  <div>
                    <h3 className="mb-2.5 text-[12px] font-semibold text-[var(--muted)]">
                      未标阶段
                    </h3>
                    <div className="flex flex-col gap-[var(--gap-card)]">
                      {unstaged.map((item, i) => {
                        const key = titleKey(item.title);
                        return (
                          <OrderCard
                            key={`order-u-${item.title}`}
                            item={item}
                            index={pipelineStart + globalIndex + i + 1}
                            hasTodayLink={
                              view.linkedKeys.has(key) && hasTodayOrLater(key)
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {/* ── 稍后 ── */}
          {view.later.length > 0 && (
            <section
              id="later"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              {laterCollapsed ? (
                <details className="group">
                  <summary className="mb-4 flex cursor-pointer list-none items-baseline gap-2 border-b border-[var(--line)] pb-2.5 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span
                      className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mute)]"
                      aria-hidden
                    />
                    <span className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">
                      稍后
                    </span>
                    <span className="text-[12px] tabular-nums text-[var(--faint)]">
                      {view.later.length}
                    </span>
                    <span className="ml-auto text-[11px] font-medium text-[var(--faint)] group-open:hidden">
                      展开
                    </span>
                    <span className="ml-auto hidden text-[11px] font-medium text-[var(--faint)] group-open:inline">
                      收起
                    </span>
                  </summary>
                  <div className="flex flex-col gap-[var(--gap-card)] opacity-90">
                    {view.later.map((item, i) => {
                      const linkedStage = linkedStageLabel(
                        item.title,
                        view.orders,
                        view.linkedKeys,
                      );
                      return (
                        <ActionCard
                          key={`later-${item.title}`}
                          item={item}
                          index={laterStart + i + 1}
                          linkedStage={linkedStage}
                        />
                      );
                    })}
                  </div>
                </details>
              ) : (
                <>
                  <SectionHead
                    tone="later"
                    title="稍后"
                    count={view.later.length}
                  />
                  <div className="flex flex-col gap-[var(--gap-card)] opacity-90">
                    {view.later.map((item, i) => {
                      const linkedStage = linkedStageLabel(
                        item.title,
                        view.orders,
                        view.linkedKeys,
                      );
                      return (
                        <ActionCard
                          key={`later-${item.title}`}
                          item={item}
                          index={laterStart + i + 1}
                          linkedStage={linkedStage}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          )}
        </div>

        <WorkflowKit />
      </main>
    </div>
  );
}
