"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { BoardData } from "@/lib/board-types";
import { buildDeskView } from "@/lib/board-view";
import { filterItems } from "@/lib/filter-board";
import { titleKey } from "@/lib/title-key";
import { stageDef } from "@/lib/order-stages";
import AppHeader from "@/components/AppHeader";
import ActionCard from "@/components/ActionCard";
import PipelineBoard from "@/components/PipelineBoard";
import WorkflowKit from "@/components/WorkflowKit";
import { Calendar, Inbox } from "lucide-react";

function linkedStageLabel(
  title: string,
  orders: { title: string; stage?: string }[],
  linkedKeys: Set<string>,
): string | undefined {
  const key = titleKey(title);
  if (!linkedKeys.has(key)) return undefined;
  const order = orders.find((o) => titleKey(o.title) === key);
  if (!order?.stage) return undefined;
  return stageDef(order.stage as never).label;
}

export default function DeskApp({ board }: { board: BoardData }) {
  const [query, setQuery] = useState("");
  const view = useMemo(() => buildDeskView(board), [board]);

  const mine = useMemo(
    () => filterItems(view.mine, query),
    [view.mine, query],
  );
  const waiting = useMemo(
    () => filterItems(view.waiting, query),
    [view.waiting, query],
  );
  const later = useMemo(
    () => filterItems(view.later, query),
    [view.later, query],
  );
  const orders = useMemo(
    () => filterItems(view.orders, query),
    [view.orders, query],
  );

  const triageHrefFor = (title: string) => {
    const key = titleKey(title);
    if (!view.linkedKeys.has(key)) return undefined;
    const zone = view.triageZoneByKey.get(key);
    if (zone === "mine") return "#mine" as const;
    if (zone === "wait") return "#wait" as const;
    if (zone === "later") return "#later" as const;
    return undefined;
  };

  const empty =
    mine.length + waiting.length + later.length + orders.length === 0;

  return (
    <div id="top" className="min-h-full">
      <AppHeader
        title={board.title}
        updated={board.updated}
        stats={{
          mine: view.stats.mine,
          waiting: view.stats.waiting,
          orders: view.stats.orders,
          later: view.stats.later,
        }}
        query={query}
        onQueryChange={setQuery}
      />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-[var(--measure)] px-4 pb-16 pt-6 sm:px-6"
      >
        {/* page intro */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-[1.5rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[1.65rem]">
            {board.title}
          </h1>
          {board.subtitle && (
            <p className="mt-1.5 text-[13px] text-[var(--mute)]">
              {board.subtitle}
              {board.updated ? (
                <span className="text-[var(--faint)]">
                  {" · "}
                  {board.updated}
                </span>
              ) : null}
            </p>
          )}
        </motion.header>

        {/* meetings spotlight */}
        {view.meetings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 overflow-hidden rounded-xl border border-[var(--line)] bg-gradient-to-r from-[var(--primary-soft)] via-[var(--surface)] to-[var(--wait-soft)] p-4 shadow-[var(--shadow-card)] sm:p-5"
            aria-label="本周会议"
          >
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--primary)]">
              <Calendar size={14} aria-hidden />
              本周会议
            </div>
            <ul className="flex flex-col gap-2">
              {view.meetings.map((m, i) => (
                <li
                  key={i}
                  className="text-[13px] leading-relaxed text-[var(--ink)] sm:text-[14px]"
                >
                  {m}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {empty && query && (
          <div className="mb-8 rounded-xl border border-dashed border-[var(--line)] px-6 py-12 text-center">
            <Inbox
              className="mx-auto mb-3 text-[var(--faint)]"
              size={28}
              strokeWidth={1.5}
            />
            <p className="text-[14px] font-medium text-[var(--ink)]">
              无匹配结果
            </p>
            <p className="mt-1 text-[13px] text-[var(--faint)]">
              试试 PO 号、客户名或状态关键词
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 text-[13px] font-medium text-[var(--primary)] hover:underline"
            >
              清除搜索
            </button>
          </div>
        )}

        {/* two-column: priority | pipeline */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          {/* left: actions */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {mine.length > 0 && (
              <section id="mine" className="scroll-mt-24">
                <SectionLabel
                  tone="action"
                  title="要我动"
                  count={mine.length}
                  hint="现在要回 / 催 / 发"
                />
                <div className="flex flex-col gap-3">
                  {mine.map((item, i) => (
                    <ActionCard
                      key={item.title}
                      item={item}
                      index={i + 1}
                      urgent={item.priority === "P0"}
                      tone="act"
                      linkedStage={linkedStageLabel(
                        item.title,
                        orders,
                        view.linkedKeys,
                      )}
                    />
                  ))}
                </div>
              </section>
            )}

            {waiting.length > 0 && (
              <section id="wait" className="scroll-mt-24">
                <SectionLabel
                  tone="wait"
                  title="等对方"
                  count={waiting.length}
                  hint="球在客户 / 工厂 / 同事"
                />
                <div className="flex flex-col gap-3">
                  {waiting.map((item, i) => (
                    <ActionCard
                      key={item.title}
                      item={item}
                      index={i + 1}
                      tone="wait"
                      linkedStage={linkedStageLabel(
                        item.title,
                        orders,
                        view.linkedKeys,
                      )}
                    />
                  ))}
                </div>
              </section>
            )}

            {later.length > 0 && (
              <section id="later" className="scroll-mt-24">
                <details className="group">
                  <summary className="mb-3 flex cursor-pointer list-none items-baseline gap-2 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[14px] font-semibold text-[var(--ink)]">
                      稍后
                    </span>
                    <span className="text-[13px] tabular-nums text-[var(--faint)]">
                      {later.length}
                    </span>
                    <span className="ml-auto text-[12px] text-[var(--faint)]">
                      展开 / 收起
                    </span>
                  </summary>
                  <div className="flex flex-col gap-3 opacity-90">
                    {later.map((item, i) => (
                      <ActionCard
                        key={item.title}
                        item={item}
                        index={i + 1}
                        linkedStage={linkedStageLabel(
                          item.title,
                          orders,
                          view.linkedKeys,
                        )}
                      />
                    ))}
                  </div>
                </details>
              </section>
            )}

            {!mine.length && !waiting.length && !query && (
              <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-8 text-center text-[13px] text-[var(--faint)]">
                暂无待办或等待项
              </p>
            )}
          </div>

          {/* right: pipeline */}
          <div className="lg:col-span-7">
            {orders.length > 0 ? (
              <PipelineBoard
                orders={orders}
                triageHrefFor={triageHrefFor}
              />
            ) : (
              !query && (
                <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-8 text-center text-[13px] text-[var(--faint)]">
                  暂无管线订单
                </p>
              )
            )}
          </div>
        </div>

        <WorkflowKit />
      </main>
    </div>
  );
}

function SectionLabel({
  tone,
  title,
  count,
  hint,
}: {
  tone: "action" | "wait";
  title: string;
  count: number;
  hint?: string;
}) {
  const pill =
    tone === "action"
      ? "bg-[var(--action-soft)] text-[var(--action-ink)]"
      : "bg-[var(--wait-soft)] text-[var(--wait-ink)]";
  return (
    <div className="mb-3.5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h2>
        <span
          className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${pill}`}
        >
          {count}
        </span>
      </div>
      {hint && (
        <p className="mt-1 text-[12px] text-[var(--faint)]">{hint}</p>
      )}
    </div>
  );
}
