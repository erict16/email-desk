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
  hint,
}: {
  tone: "mine" | "wait" | "orders" | "later";
  title: string;
  count: number;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h2>
        <span
          className={`text-[13px] font-semibold tabular-nums ${
            tone === "mine" ? "text-[var(--urgent)]" : "text-[var(--faint)]"
          }`}
        >
          {count}
        </span>
      </div>
      {hint && (
        <p className="mt-1 text-[12px] leading-snug text-[var(--faint)]">
          {hint}
        </p>
      )}
    </div>
  );
}

function StageLane({
  stageId,
  items,
  startIndex,
  triageHrefFor,
  isFirst,
}: {
  stageId: OrderStageId;
  items: BoardItem[];
  startIndex: number;
  triageHrefFor: (title: string) => "#mine" | "#wait" | "#later" | undefined;
  isFirst: boolean;
}) {
  const def = ORDER_STAGES.find((s) => s.id === stageId)!;
  let idx = startIndex;
  return (
    <div
      className={
        isFirst
          ? ""
          : "mt-[var(--gap-lane)] border-t border-[var(--line)] pt-[var(--gap-lane)]"
      }
    >
      {/* One line: label · hint …… count — real gaps, no glue */}
      <div className="mb-3.5 flex items-baseline gap-x-2">
        <h3 className="shrink-0 text-[13px] font-semibold tracking-tight text-[var(--ink)]">
          {def.label}
        </h3>
        {def.hint && (
          <>
            <span className="text-[var(--line-strong)]" aria-hidden>
              ·
            </span>
            <span className="min-w-0 text-[12px] text-[var(--faint)]">
              {def.hint}
            </span>
          </>
        )}
        <span className="ml-auto shrink-0 text-[12px] tabular-nums text-[var(--faint)]">
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-[var(--gap-card)]">
        {items.map((item) => {
          idx += 1;
          return (
            <OrderCard
              key={`order-${item.title}`}
              item={item}
              index={idx}
              triageHref={triageHrefFor(item.title)}
            />
          );
        })}
      </div>
    </div>
  );
}

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

  const triageHrefFor = (
    title: string,
  ): "#mine" | "#wait" | "#later" | undefined => {
    const key = titleKey(title);
    if (!view.linkedKeys.has(key)) return undefined;
    const zone = view.triageZoneByKey.get(key);
    if (zone === "mine") return "#mine";
    if (zone === "wait") return "#wait";
    if (zone === "later") return "#later";
    return undefined;
  };

  const laterCollapsed = view.later.length > 3;

  const mineStart = 0;
  const waitStart = view.mine.length;
  const pipelineStart = waitStart + view.waiting.length;
  const laterStart = pipelineStart + view.orders.length;

  const activeStages = ORDER_STAGES.filter((s) =>
    view.orders.some((i) => i.stage === s.id),
  );

  return (
    <div id="top" className="min-h-full bg-[var(--paper)]">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-[var(--measure)] px-4 pb-14 pt-6 sm:px-5"
      >
        <header className="mb-6">
          <h1 className="text-[1.25rem] font-semibold leading-snug tracking-tight text-[var(--ink)]">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1.5 text-[13px] leading-normal text-[var(--mute)]">
              {board.subtitle}
              {board.updated ? (
                <span className="text-[var(--faint)]">
                  {" · "}
                  {board.updated}
                </span>
              ) : null}
            </p>
          )}
        </header>

        <FocusStrip meetings={view.meetings} stats={view.stats} />

        <div className="flex flex-col gap-[var(--gap-section)]">
          {view.mine.length > 0 && (
            <section
              id="mine"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="mine"
                title="要我动"
                count={view.mine.length}
                hint="你现在要回 / 催 / 发"
              />
              <div className="flex flex-col gap-[var(--gap-card)]">
                {view.mine.map((item, i) => (
                  <ActionCard
                    key={`mine-${item.title}`}
                    item={item}
                    index={mineStart + i + 1}
                    urgent={item.priority === "P0"}
                    tone="act"
                    linkedStage={linkedStageLabel(
                      item.title,
                      view.orders,
                      view.linkedKeys,
                    )}
                  />
                ))}
              </div>
            </section>
          )}

          {view.waiting.length > 0 && (
            <section
              id="wait"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="wait"
                title="等对方"
                count={view.waiting.length}
                hint="球在客户 / 工厂 / 同事"
              />
              <div className="flex flex-col gap-[var(--gap-card)]">
                {view.waiting.map((item, i) => (
                  <ActionCard
                    key={`wait-${item.title}`}
                    item={item}
                    index={waitStart + i + 1}
                    tone="wait"
                    linkedStage={linkedStageLabel(
                      item.title,
                      view.orders,
                      view.linkedKeys,
                    )}
                  />
                ))}
              </div>
            </section>
          )}

          {view.orders.length > 0 && (
            <section
              id="pipeline"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              <SectionHead
                tone="orders"
                title="订单管线"
                count={view.orders.length}
                hint="项目现在在哪一阶段"
              />

              <div className="mb-5 flex flex-wrap gap-2">
                {ORDER_STAGES.map((s) => {
                  const n = view.orders.filter((i) => i.stage === s.id).length;
                  if (n === 0) return null;
                  return (
                    <a
                      key={s.id}
                      href={`#order-stage-${s.id}`}
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-[12px] font-medium leading-none text-[var(--ink)] hover:border-[var(--line-strong)] hover:bg-[var(--paper-2)]"
                    >
                      {s.short}
                      <span className="tabular-nums text-[var(--faint)]">
                        {n}
                      </span>
                    </a>
                  );
                })}
              </div>

              {activeStages.map((s, si) => {
                const items = view.orders.filter((i) => i.stage === s.id);
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
                      triageHrefFor={triageHrefFor}
                      isFirst={si === 0}
                    />
                  </div>
                );
              })}

              {(() => {
                const unstaged = view.orders.filter((i) => !i.stage);
                if (unstaged.length === 0) return null;
                return (
                  <div
                    className={
                      activeStages.length > 0
                        ? "mt-[var(--gap-lane)] border-t border-[var(--line)] pt-[var(--gap-lane)]"
                        : ""
                    }
                  >
                    <h3 className="mb-3.5 text-[13px] font-semibold text-[var(--mute)]">
                      未标阶段
                    </h3>
                    <div className="flex flex-col gap-[var(--gap-card)]">
                      {unstaged.map((item, i) => (
                        <OrderCard
                          key={`order-u-${item.title}`}
                          item={item}
                          index={pipelineStart + globalIndex + i + 1}
                          triageHref={triageHrefFor(item.title)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </section>
          )}

          {view.later.length > 0 && (
            <section
              id="later"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              {laterCollapsed ? (
                <details className="group">
                  <summary className="mb-4 flex cursor-pointer list-none items-baseline gap-2.5 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
                      稍后
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums text-[var(--faint)]">
                      {view.later.length}
                    </span>
                    <span className="ml-auto text-[12px] text-[var(--faint)] group-open:hidden">
                      展开
                    </span>
                    <span className="ml-auto hidden text-[12px] text-[var(--faint)] group-open:inline">
                      收起
                    </span>
                  </summary>
                  <div className="flex flex-col gap-[var(--gap-card)]">
                    {view.later.map((item, i) => (
                      <ActionCard
                        key={`later-${item.title}`}
                        item={item}
                        index={laterStart + i + 1}
                        linkedStage={linkedStageLabel(
                          item.title,
                          view.orders,
                          view.linkedKeys,
                        )}
                      />
                    ))}
                  </div>
                </details>
              ) : (
                <>
                  <SectionHead
                    tone="later"
                    title="稍后"
                    count={view.later.length}
                  />
                  <div className="flex flex-col gap-[var(--gap-card)]">
                    {view.later.map((item, i) => (
                      <ActionCard
                        key={`later-${item.title}`}
                        item={item}
                        index={laterStart + i + 1}
                        linkedStage={linkedStageLabel(
                          item.title,
                          view.orders,
                          view.linkedKeys,
                        )}
                      />
                    ))}
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
