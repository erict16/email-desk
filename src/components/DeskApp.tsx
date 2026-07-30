"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { BoardData, BoardItem } from "@/lib/board-types";
import { buildDeskView } from "@/lib/board-view";
import { filterItems } from "@/lib/filter-board";
import { titleKey } from "@/lib/title-key";
import { stageDef } from "@/lib/order-stages";
import {
  type BlockerCategory,
  type ZoneFilter,
  isBlockedItem,
  matchesBlockerCategory,
  matchesZone,
} from "@/lib/blocker-classify";
import {
  itemDoneKey,
  loadLocalDone,
  saveLocalDone,
} from "@/lib/local-done";
import AppHeader from "@/components/AppHeader";
import ActionCard from "@/components/ActionCard";
import PipelineBoard from "@/components/PipelineBoard";
import WorkflowKit from "@/components/WorkflowKit";
import FilterBar from "@/components/FilterBar";
import CommandPalette, {
  type PaletteEntry,
} from "@/components/CommandPalette";
import { useToast, copyText } from "@/components/ToastProvider";
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

function applyFilters(
  items: BoardItem[],
  zone: ZoneFilter,
  zoneOf: "mine" | "waiting" | "later" | "order",
  cats: Set<BlockerCategory>,
  query: string,
  done: Set<string>,
  hideDone: boolean,
): BoardItem[] {
  return filterItems(items, query).filter((item) => {
    if (hideDone && done.has(itemDoneKey(item.title))) return false;
    if (!matchesZone(item, zone, zoneOf)) return false;
    if (cats.size > 0 && !matchesBlockerCategory(item, cats)) return false;
    // category filter only meaningful when blocked or all with cats
    if (cats.size > 0 && zone === "mine" && !isBlockedItem(item)) {
      // allow mine without being blocked if no category? user selected category → require match
      return matchesBlockerCategory(item, cats);
    }
    return true;
  });
}

export default function DeskApp({ board }: { board: BoardData }) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<ZoneFilter>("all");
  const [categories, setCategories] = useState<Set<BlockerCategory>>(
    () => new Set(),
  );
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [hideDone, setHideDone] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const view = useMemo(() => buildDeskView(board), [board]);

  useEffect(() => {
    setDone(loadLocalDone());
  }, []);

  const toggleDone = useCallback((title: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      const k = itemDoneKey(title);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      saveLocalDone(next);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((c: BlockerCategory) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }, []);

  // Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const allTriage = useMemo(
    () => [...view.mine, ...view.waiting, ...view.later],
    [view.mine, view.waiting, view.later],
  );

  const counts = useMemo(() => {
    const q = query;
    const base = {
      all: filterItems([...allTriage, ...view.orders], q).length,
      blocked: filterItems(
        [...allTriage, ...view.orders].filter(isBlockedItem),
        q,
      ).length,
      mine: filterItems(view.mine, q).length,
      waiting: filterItems(view.waiting, q).length,
    };
    return base;
  }, [allTriage, view.mine, view.waiting, view.orders, query]);

  const mine = useMemo(
    () =>
      applyFilters(
        view.mine,
        zone,
        "mine",
        categories,
        query,
        done,
        hideDone,
      ),
    [view.mine, zone, categories, query, done, hideDone],
  );
  const waiting = useMemo(
    () =>
      applyFilters(
        view.waiting,
        zone,
        "waiting",
        categories,
        query,
        done,
        hideDone,
      ),
    [view.waiting, zone, categories, query, done, hideDone],
  );
  const later = useMemo(
    () =>
      applyFilters(
        view.later,
        zone,
        "later",
        categories,
        query,
        done,
        hideDone,
      ),
    [view.later, zone, categories, query, done, hideDone],
  );
  const orders = useMemo(
    () =>
      applyFilters(
        view.orders,
        zone === "mine" || zone === "waiting" ? "all" : zone,
        "order",
        categories,
        query,
        done,
        hideDone,
      ),
    [view.orders, zone, categories, query, done, hideDone],
  );

  // When zone is mine/waiting, still show pipeline lightly filtered by query only
  const pipelineOrders = useMemo(() => {
    if (zone === "mine" || zone === "waiting") {
      return filterItems(view.orders, query).filter(
        (i) => !(hideDone && done.has(itemDoneKey(i.title))),
      );
    }
    return orders;
  }, [zone, view.orders, query, hideDone, done, orders]);

  const triageHrefFor = (title: string) => {
    const key = titleKey(title);
    if (!view.linkedKeys.has(key)) return undefined;
    const z = view.triageZoneByKey.get(key);
    if (z === "mine") return "#mine" as const;
    if (z === "wait") return "#wait" as const;
    if (z === "later") return "#later" as const;
    return undefined;
  };

  const paletteEntries: PaletteEntry[] = useMemo(() => {
    const out: PaletteEntry[] = [];
    for (const item of view.mine)
      out.push({ item, zone: "mine", zoneLabel: "要我动" });
    for (const item of view.waiting)
      out.push({ item, zone: "waiting", zoneLabel: "等对方" });
    for (const item of view.later)
      out.push({ item, zone: "later", zoneLabel: "稍后" });
    for (const item of view.orders)
      out.push({ item, zone: "order", zoneLabel: "管线" });
    return out;
  }, [view]);

  const onPaletteSelect = (e: PaletteEntry) => {
    const href =
      e.zone === "mine"
        ? "#mine"
        : e.zone === "waiting"
          ? "#wait"
          : e.zone === "later"
            ? "#later"
            : "#pipeline";
    document.getElementById(href.slice(1))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    history.replaceState(null, "", href);
  };

  const empty =
    mine.length + waiting.length + later.length + pipelineOrders.length === 0;

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
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        entries={paletteEntries}
        onSelect={onPaletteSelect}
        onCopy={async (t) => {
          const ok = await copyText(t);
          toast(ok ? "Copied for email search!" : "复制失败");
        }}
      />

      <main
        id="email-desk-print"
        className="mx-auto w-full max-w-[var(--measure)] px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6"
      >
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
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

        {view.meetings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-5 overflow-hidden rounded-xl border border-[var(--line)] bg-gradient-to-r from-[var(--primary-soft)] via-[var(--surface)] to-[var(--wait-soft)] p-4 shadow-[var(--shadow-card)] sm:p-5"
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

        <FilterBar
          zone={zone}
          onZone={setZone}
          categories={categories}
          onToggleCategory={toggleCategory}
          counts={counts}
          hideDone={hideDone}
          onHideDone={setHideDone}
          doneCount={done.size}
        />

        {empty && (
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
              调整筛选或按 ⌘K 搜索
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setZone("all");
                setCategories(new Set());
              }}
              className="mt-4 text-[13px] font-medium text-[var(--primary)] hover:underline"
            >
              重置筛选
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-5">
            {(zone === "all" || zone === "mine" || zone === "blocked") &&
              mine.length > 0 && (
                <section id="mine" className="scroll-mt-[var(--header-offset)]">
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
                          view.orders,
                          view.linkedKeys,
                        )}
                        done={done.has(itemDoneKey(item.title))}
                        onToggleDone={() => toggleDone(item.title)}
                      />
                    ))}
                  </div>
                </section>
              )}

            {(zone === "all" ||
              zone === "waiting" ||
              zone === "blocked") &&
              waiting.length > 0 && (
                <section id="wait" className="scroll-mt-[var(--header-offset)]">
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
                          view.orders,
                          view.linkedKeys,
                        )}
                        done={done.has(itemDoneKey(item.title))}
                        onToggleDone={() => toggleDone(item.title)}
                      />
                    ))}
                  </div>
                </section>
              )}

            {zone === "all" && later.length > 0 && (
              <section id="later" className="scroll-mt-[var(--header-offset)]">
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
                          view.orders,
                          view.linkedKeys,
                        )}
                        done={done.has(itemDoneKey(item.title))}
                        onToggleDone={() => toggleDone(item.title)}
                      />
                    ))}
                  </div>
                </details>
              </section>
            )}
          </div>

          <div className="lg:col-span-7">
            {pipelineOrders.length > 0 && (
              <PipelineBoard
                orders={pipelineOrders}
                triageHrefFor={triageHrefFor}
                done={done}
                onToggleDone={toggleDone}
              />
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
