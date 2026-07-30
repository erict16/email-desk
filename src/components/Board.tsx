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
    <div className="mb-3 border-b border-[var(--line)] pb-3">
      <h2 className="flex items-center gap-2">
        <span className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </span>
        <span
          className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums leading-none ${
            tone === "mine"
              ? "bg-[var(--urgent-soft)] text-[var(--urgent)]"
              : "bg-[var(--paper-2)] text-[var(--mute)]"
          }`}
        >
          {count}
        </span>
      </h2>
      {hint && (
        <p className="mt-1.5 text-[12px] leading-snug text-[var(--faint)]">
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
}: {
  stageId: OrderStageId;
  items: BoardItem[];
  startIndex: number;
  triageHrefFor: (title: string) => "#mine" | "#wait" | "#later" | undefined;
}) {
  const def = ORDER_STAGES.find((s) => s.id === stageId)!;
  let idx = startIndex;
  return (
    <div className="mb-[var(--gap-lane)] last:mb-0">
      {/* Title + count on row 1; hint alone on row 2 — avoids glued「QS 报价报价·改价」 */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold tracking-tight text-[var(--ink)]">
            {def.label}
          </h3>
          <span className="inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--paper-2)] px-1.5 py-0.5 text-[11px] font-medium tabular-nums leading-none text-[var(--mute)]">
            {items.length}
          </span>
        </div>
        {def.hint && (
          <p className="mt-1 text-[12px] leading-snug text-[var(--faint)]">
            {def.hint}
          </p>
        )}
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

  return (
    <div id="top" className="min-h-full bg-[var(--paper)]">
      <AppHeader title={board.title} />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-[var(--measure)] px-4 pb-16 pt-6 sm:px-6"
      >
        <header className="mb-5">
          <h1 className="text-[1.25rem] font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-[1.375rem]">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1 text-[13px] text-[var(--mute)]">
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
          {/* ── 要我动 ── */}
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
                {view.mine.map((item, i) => {
                  const linkedStage = linkedStageLabel(
                    item.title,
                    view.orders,
                    view.linkedKeys,
                  );
                  return (
                    <ActionCard
                      key={`mine-${item.title}`}
                      item={item}
                      index={mineStart + i + 1}
                      urgent={item.priority === "P0"}
                      tone="act"
                      linkedStage={linkedStage}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 等对方 ── */}
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
                {view.waiting.map((item, i) => {
                  const linkedStage = linkedStageLabel(
                    item.title,
                    view.orders,
                    view.linkedKeys,
                  );
                  return (
                    <ActionCard
                      key={`wait-${item.title}`}
                      item={item}
                      index={waitStart + i + 1}
                      tone="wait"
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
                hint="项目现在在哪一阶段"
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
                      triageHrefFor={triageHrefFor}
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

          {/* ── 稍后 ── */}
          {view.later.length > 0 && (
            <section
              id="later"
              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
            >
              {laterCollapsed ? (
                <details className="group">
                  <summary className="mb-3 flex cursor-pointer list-none items-center gap-2 border-b border-[var(--line)] pb-3 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
                      稍后
                    </span>
                    <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--paper-2)] px-1.5 py-0.5 text-[11px] font-semibold tabular-nums leading-none text-[var(--mute)]">
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
