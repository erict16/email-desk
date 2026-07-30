"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BoardItem } from "@/lib/board-types";
import { ORDER_STAGES, type OrderStageId } from "@/lib/order-stages";
import OrderCard from "@/components/OrderCard";
import { LayoutGrid, Rows3 } from "lucide-react";
import { itemDoneKey } from "@/lib/local-done";

type Props = {
  orders: BoardItem[];
  triageHrefFor: (title: string) => "#mine" | "#wait" | "#later" | undefined;
  done?: Set<string>;
  onToggleDone?: (title: string) => void;
};

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpoint]);
  return mobile;
}

/**
 * Mobile: default list/tabs (readable full-width cards).
 * Desktop: optional horizontal Kanban.
 */
export default function PipelineBoard({
  orders,
  triageHrefFor,
  done,
  onToggleDone,
}: Props) {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<"kanban" | "tabs">("tabs");
  const [active, setActive] = useState<OrderStageId | "all">("all");
  const [userPicked, setUserPicked] = useState(false);

  // Prefer tabs on mobile, kanban on desktop — until user overrides
  useEffect(() => {
    if (!userPicked) {
      setMode(isMobile ? "tabs" : "kanban");
    }
  }, [isMobile, userPicked]);

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
    active === "all" ? orders : (byStage.get(active) ?? []);

  const pickMode = (m: "kanban" | "tabs") => {
    setUserPicked(true);
    setMode(m);
  };

  return (
    <div id="pipeline" className="scroll-mt-[var(--header-offset,7rem)]">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4 sm:gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">
            订单管线
            <span className="ml-2 text-[13px] font-semibold tabular-nums text-[var(--faint)]">
              {orders.length}
            </span>
          </h2>
          <p className="mt-1 text-[11px] leading-snug text-[var(--faint)] sm:text-[12px]">
            OS → 技术 → QS → PO → 投产 → 单证 → 提货
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5">
          <button
            type="button"
            onClick={() => pickMode("tabs")}
            className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-[12px] font-medium sm:gap-1.5 sm:px-2.5 ${
              mode === "tabs"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "text-[var(--mute)]"
            }`}
            aria-pressed={mode === "tabs"}
          >
            <Rows3 size={14} />
            列表
          </button>
          <button
            type="button"
            onClick={() => pickMode("kanban")}
            className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-[12px] font-medium sm:gap-1.5 sm:px-2.5 ${
              mode === "kanban"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "text-[var(--mute)]"
            }`}
            aria-pressed={mode === "kanban"}
          >
            <LayoutGrid size={14} />
            看板
          </button>
        </div>
      </div>

      {/* stage chips — always horizontal scroll on mobile */}
      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mb-4 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => {
            setActive("all");
            pickMode("tabs");
          }}
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[12px] font-medium ${
            active === "all" && mode === "tabs"
              ? "border-[var(--primary)]/40 bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border-[var(--line)] bg-[var(--surface)] text-[var(--mute)]"
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
                pickMode("tabs");
              }}
              className={`stage-badge stage-badge-${s.id} shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                active === s.id && mode === "tabs"
                  ? "ring-2 ring-[var(--primary)]/40"
                  : ""
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
            className="relative -mx-3 sm:-mx-1"
          >
            {/* edge fade — hints horizontal scroll */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-4"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-6"
              aria-hidden
            />
            <div className="overflow-x-auto overscroll-x-contain px-3 pb-2 sm:px-1 [scrollbar-width:thin]">
              <div className="flex snap-x snap-mandatory gap-3 pb-1">
                {stagesWithItems.map((s) => {
                  const items = byStage.get(s.id) ?? [];
                  return (
                    <div
                      key={s.id}
                      id={`order-stage-${s.id}`}
                      className="kanban-col flex w-[min(85vw,280px)] shrink-0 snap-start flex-col overflow-hidden rounded-xl sm:w-[280px]"
                    >
                      <div className="kanban-col-header flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`stage-badge stage-badge-${s.id} shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold`}
                          >
                            {s.short}
                          </span>
                          <span className="truncate text-[12px] text-[var(--faint)]">
                            {s.hint}
                          </span>
                        </div>
                        <span className="shrink-0 text-[12px] tabular-nums text-[var(--faint)]">
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
            </div>
            {isMobile && (
              <p className="mt-1 text-center text-[11px] text-[var(--faint)]">
                左右滑动查看各阶段
              </p>
            )}
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
