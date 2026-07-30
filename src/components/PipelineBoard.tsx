"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import {
  ORDER_STAGES,
  type OrderStageId,
} from "@/lib/order-stages";
import OrderCard from "@/components/OrderCard";
import { LayoutGrid, Rows3 } from "lucide-react";

import { itemDoneKey } from "@/lib/local-done";

type Props = {
  orders: BoardItem[];
  triageHrefFor: (title: string) => "#mine" | "#wait" | "#later" | undefined;
  done?: Set<string>;
  onToggleDone?: (title: string) => void;
};

/**
 * Desktop: horizontal Kanban columns.
 * Mobile / accordion mode: stage tabs + list.
 */
export default function PipelineBoard({
  orders,
  triageHrefFor,
  done,
  onToggleDone,
}: Props) {
  const [mode, setMode] = useState<"kanban" | "tabs">("kanban");
  const [active, setActive] = useState<OrderStageId | "all">("all");

  const byStage = useMemo(() => {
    const map = new Map<OrderStageId, BoardItem[]>();
    for (const s of ORDER_STAGES) map.set(s.id, []);
    for (const o of orders) {
      if (o.stage && map.has(o.stage)) map.get(o.stage)!.push(o);
    }
    return map;
  }, [orders]);

  const stagesWithItems = ORDER_STAGES.filter(
    (s) => (byStage.get(s.id)?.length ?? 0) > 0,
  );

  const listOrders =
    active === "all"
      ? orders
      : (byStage.get(active) ?? []);

  return (
    <div id="pipeline" className="scroll-mt-20">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
            订单管线
            <span className="ml-2 text-[13px] font-semibold tabular-nums text-[var(--faint)]">
              {orders.length}
            </span>
          </h2>
          <p className="mt-1 text-[12px] text-[var(--faint)]">
            OS → 技术 → QS → PO → 投产 → 单证 → 提货
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5">
          <button
            type="button"
            onClick={() => setMode("kanban")}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium transition-colors ${
              mode === "kanban"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "text-[var(--mute)] hover:text-[var(--ink)]"
            }`}
            aria-pressed={mode === "kanban"}
          >
            <LayoutGrid size={14} />
            看板
          </button>
          <button
            type="button"
            onClick={() => setMode("tabs")}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium transition-colors ${
              mode === "tabs"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "text-[var(--mute)] hover:text-[var(--ink)]"
            }`}
            aria-pressed={mode === "tabs"}
          >
            <Rows3 size={14} />
            列表
          </button>
        </div>
      </div>

      {/* stage chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setActive("all");
            setMode("tabs");
          }}
          className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
            active === "all" && mode === "tabs"
              ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border-[var(--line)] bg-[var(--surface)] text-[var(--mute)] hover:border-[var(--primary)]/30"
          }`}
        >
          全部 {orders.length}
        </button>
        {stagesWithItems.map((s) => {
          const n = byStage.get(s.id)?.length ?? 0;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActive(s.id);
                setMode("tabs");
              }}
              className={`stage-badge stage-badge-${s.id} rounded-full px-3 py-1 text-[12px] font-medium transition-opacity hover:opacity-90 ${
                active === s.id && mode === "tabs" ? "ring-2 ring-[var(--primary)]/40" : ""
              }`}
            >
              {s.short} {n}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {mode === "kanban" ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="-mx-1 overflow-x-auto pb-2"
          >
            <div className="flex min-w-max gap-3 px-1">
              {stagesWithItems.map((s) => {
                const items = byStage.get(s.id) ?? [];
                return (
                  <div
                    key={s.id}
                    id={`order-stage-${s.id}`}
                    className="kanban-col flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl"
                  >
                    <div className="kanban-col-header flex items-center justify-between border-b border-[var(--line)] px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`stage-badge stage-badge-${s.id} rounded-md px-1.5 py-0.5 text-[11px] font-semibold`}
                        >
                          {s.short}
                        </span>
                        <span className="text-[12px] text-[var(--faint)]">
                          {s.hint}
                        </span>
                      </div>
                      <span className="text-[12px] tabular-nums text-[var(--faint)]">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2.5 p-2.5">
                      {items.map((item, i) => (
                        <OrderCard
                          key={item.title}
                          item={item}
                          index={i + 1}
                          triageHref={triageHrefFor(item.title)}
                          compact
                          done={done?.has(itemDoneKey(item.title))}
                          onToggleDone={
                            onToggleDone
                              ? () => onToggleDone(item.title)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`tabs-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {listOrders.map((item, i) => (
              <OrderCard
                key={item.title}
                item={item}
                index={i + 1}
                triageHref={triageHrefFor(item.title)}
                done={done?.has(itemDoneKey(item.title))}
                onToggleDone={
                  onToggleDone ? () => onToggleDone(item.title) : undefined
                }
              />
            ))}
            {listOrders.length === 0 && (
              <p className="rounded-xl border border-dashed border-[var(--line)] px-4 py-8 text-center text-[13px] text-[var(--faint)]">
                无匹配订单
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
