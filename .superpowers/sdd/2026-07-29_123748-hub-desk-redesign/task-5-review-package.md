# T5 b9c6d6c49d864688a03b9066926ea518f8604e7f..2710dff0b0343aebffc8e6bc16a1995460d5a273
2710dff feat(desk): Today / Pipeline / Later dispatch IA
 src/components/Board.tsx       | 287 +++++++++++++++++++++++++----------------
 src/components/FocusStrip.tsx  | 124 ++++++++++++++++++
 src/components/SiteFooter.tsx  |  19 +++
 src/components/StatsNav.tsx    |  55 ++------
 src/components/WorkflowKit.tsx |  80 ++++++++++++
 5 files changed, 405 insertions(+), 160 deletions(-)
diff --git a/src/components/Board.tsx b/src/components/Board.tsx
index 6e14c06..6c9f8d3 100644
--- a/src/components/Board.tsx
+++ b/src/components/Board.tsx
@@ -1,59 +1,34 @@
-import type { BoardData, BoardItem, Priority } from "@/lib/parse-board";
-import { isOrderItem } from "@/lib/parse-board";
+import type { BoardData, BoardItem } from "@/lib/parse-board";
+import { buildDeskView } from "@/lib/board-view";
+import { titleKey } from "@/lib/title-key";
 import {
   ORDER_STAGES,
-  compareByStageThenTitle,
+  stageDef,
   type OrderStageId,
 } from "@/lib/order-stages";
-import Card from "@/components/Card";
+import ActionCard from "@/components/ActionCard";
 import OrderCard from "@/components/OrderCard";
 import AppHeader from "@/components/AppHeader";
-import StatsNav from "@/components/StatsNav";
-
-/** 紧急 → 需跟进 → 订单 */
-const TRIAGE = [
-  {
-    key: "urgent" as const,
-    id: "block-urgent",
-    label: "紧急",
-    tone: "urgent" as const,
-    match: (p: Priority) => p === "P0",
-    sectionTitle: "紧急",
-  },
-  {
-    key: "follow" as const,
-    id: "block-follow",
-    label: "需跟进",
-    tone: "follow" as const,
-    match: (p: Priority) => p === "P1" || p === "P2",
-    sectionTitle: "需跟进",
-  },
-  {
-    key: "orders" as const,
-    id: "block-orders",
-    label: "订单",
-    tone: "orders" as const,
-    sectionTitle: "订单",
-  },
-] as const;
+import FocusStrip from "@/components/FocusStrip";
+import WorkflowKit from "@/components/WorkflowKit";
 
 function SectionHead({
   tone,
   title,
   count,
 }: {
-  tone: string;
+  tone: "urgent" | "orders" | "later";
   title: string;
   count: number;
 }) {
   const color =
     tone === "urgent"
       ? "var(--urgent)"
-      : tone === "follow"
-        ? "var(--follow)"
-        : "var(--orders)";
+      : tone === "orders"
+        ? "var(--pipe)"
+        : "var(--mute)";
   return (
     <h2 className="mb-4 flex items-baseline gap-2 border-b border-[var(--line)] pb-2.5">
       <span
         className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full"
         style={{ background: color }}
@@ -71,14 +46,18 @@ function SectionHead({
 
 function StageLane({
   stageId,
   items,
   startIndex,
+  linkedKeys,
+  hasTodayOrLater,
 }: {
   stageId: OrderStageId;
   items: BoardItem[];
   startIndex: number;
+  linkedKeys: Set<string>;
+  hasTodayOrLater: (key: string) => boolean;
 }) {
   const def = ORDER_STAGES.find((s) => s.id === stageId)!;
   let idx = startIndex;
   return (
     <div className="mb-[var(--gap-lane)] last:mb-0">
@@ -92,37 +71,57 @@ function StageLane({
         </span>
       </div>
       <div className="flex flex-col gap-[var(--gap-card)]">
         {items.map((item) => {
           idx += 1;
+          const key = titleKey(item.title);
+          const hasTodayLink = linkedKeys.has(key) && hasTodayOrLater(key);
           return (
-            <OrderCard key={`order-${item.title}`} item={item} index={idx} />
+            <OrderCard
+              key={`order-${item.title}`}
+              item={item}
+              index={idx}
+              hasTodayLink={hasTodayLink}
+            />
           );
         })}
       </div>
     </div>
   );
 }
 
+/** Resolve pipeline stage label for a triage title, if linked. */
+function linkedStageLabel(
+  title: string,
+  orders: BoardItem[],
+  linkedKeys: Set<string>,
+): string | undefined {
+  const key = titleKey(title);
+  if (!linkedKeys.has(key)) return undefined;
+  const order = orders.find((o) => titleKey(o.title) === key);
+  if (!order?.stage) return undefined;
+  return stageDef(order.stage).label;
+}
+
 export default function Board({ board }: { board: BoardData }) {
-  const allItems: BoardItem[] = board.sections.flatMap((s) => s.items);
+  const view = buildDeskView(board);
   let globalIndex = 0;
 
-  const orderItems = allItems
-    .filter(isOrderItem)
-    .sort(compareByStageThenTitle);
+  const todayOrLaterKeys = new Set([
+    ...view.today.map((i) => titleKey(i.title)),
+    ...view.later.map((i) => titleKey(i.title)),
+  ]);
+  const hasTodayOrLater = (key: string) => todayOrLaterKeys.has(key);
+
+  const laterCollapsed = view.later.length > 3;
 
-  const statItems = TRIAGE.map((s) => ({
-    key: s.key,
-    id: s.id,
-    label: s.label,
-    tone: s.tone,
-    value:
-      s.key === "orders"
-        ? board.stats.orders
-        : board.stats[s.key as "urgent" | "follow"],
-  }));
+  // Pre-assign display indices so Later doesn't need render-time mutation.
+  const todayStart = 0;
+  const pipelineStart = view.today.length;
+  const laterStart =
+    pipelineStart +
+    view.orders.length;
 
   return (
     <div id="top" className="min-h-full bg-[var(--paper)]">
       <AppHeader title={board.title} />
 
@@ -141,78 +140,60 @@ export default function Board({ board }: { board: BoardData }) {
               {board.updated ? ` · ${board.updated}` : ""}
             </p>
           )}
         </header>
 
-        <StatsNav stats={statItems} />
-
-        {board.meetings.length > 0 && (
-          <section className="mb-[var(--gap-section)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-4 py-3.5">
-            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
-              会议
-            </div>
-            <ul className="flex flex-col gap-2 text-[13px] leading-snug text-[var(--ink)]">
-              {board.meetings.map((m, i) => (
-                <li key={i} className="flex gap-2.5">
-                  <span
-                    className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]"
-                    aria-hidden
-                  />
-                  <span>{m}</span>
-                </li>
-              ))}
-            </ul>
-          </section>
-        )}
+        <FocusStrip meetings={view.meetings} stats={view.stats} />
 
         <div className="flex flex-col gap-[var(--gap-section)]">
-          {TRIAGE.filter((b) => b.key !== "orders").map((block) => {
-            const items = allItems.filter((it) => block.match(it.priority));
-            if (items.length === 0) return null;
-            return (
-              <section
-                key={block.id}
-                id={block.id}
-                className="scroll-mt-[calc(var(--banner-height)+1rem)]"
-              >
-                <SectionHead
-                  tone={block.tone}
-                  title={block.sectionTitle}
-                  count={items.length}
-                />
-                <div className="flex flex-col gap-[var(--gap-card)]">
-                  {items.map((item) => {
-                    globalIndex += 1;
-                    return (
-                      <Card
-                        key={`${block.id}-${item.title}`}
-                        item={item}
-                        index={globalIndex}
-                        hideAction={false}
-                        showStripe={block.key === "urgent"}
-                      />
-                    );
-                  })}
-                </div>
-              </section>
-            );
-          })}
+          {/* ── 今日行动 ── */}
+          {view.today.length > 0 && (
+            <section
+              id="today"
+              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
+            >
+              <SectionHead
+                tone="urgent"
+                title="今日行动"
+                count={view.today.length}
+              />
+              <div className="flex flex-col gap-[var(--gap-card)]">
+                {view.today.map((item, i) => {
+                  const linkedStage = linkedStageLabel(
+                    item.title,
+                    view.orders,
+                    view.linkedKeys,
+                  );
+                  return (
+                    <ActionCard
+                      key={`today-${item.title}`}
+                      item={item}
+                      index={todayStart + i + 1}
+                      urgent={item.priority === "P0"}
+                      linkedStage={linkedStage}
+                    />
+                  );
+                })}
+              </div>
+            </section>
+          )}
 
-          {orderItems.length > 0 && (
+          {/* ── 订单管线 ── */}
+          {view.orders.length > 0 && (
             <section
-              id="block-orders"
+              id="pipeline"
               className="scroll-mt-[calc(var(--banner-height)+1rem)]"
             >
               <SectionHead
                 tone="orders"
-                title="订单"
-                count={orderItems.length}
+                title="订单管线"
+                count={view.orders.length}
               />
 
               <div className="mb-4 flex flex-wrap gap-1.5">
                 {ORDER_STAGES.map((s) => {
-                  const n = orderItems.filter((i) => i.stage === s.id).length;
+                  const n = view.orders.filter((i) => i.stage === s.id).length;
                   if (n === 0) return null;
                   return (
                     <a
                       key={s.id}
                       href={`#order-stage-${s.id}`}
@@ -226,13 +207,13 @@ export default function Board({ board }: { board: BoardData }) {
                   );
                 })}
               </div>
 
               {ORDER_STAGES.map((s) => {
-                const items = orderItems.filter((i) => i.stage === s.id);
+                const items = view.orders.filter((i) => i.stage === s.id);
                 if (items.length === 0) return null;
-                const start = globalIndex;
+                const start = pipelineStart + globalIndex;
                 globalIndex += items.length;
                 return (
                   <div
                     key={s.id}
                     id={`order-stage-${s.id}`}
@@ -240,40 +221,120 @@ export default function Board({ board }: { board: BoardData }) {
                   >
                     <StageLane
                       stageId={s.id}
                       items={items}
                       startIndex={start}
+                      linkedKeys={view.linkedKeys}
+                      hasTodayOrLater={hasTodayOrLater}
                     />
                   </div>
                 );
               })}
 
               {(() => {
-                const unstaged = orderItems.filter((i) => !i.stage);
+                const unstaged = view.orders.filter((i) => !i.stage);
                 if (unstaged.length === 0) return null;
                 return (
                   <div>
                     <h3 className="mb-2.5 text-[12px] font-semibold text-[var(--muted)]">
                       未标阶段
                     </h3>
                     <div className="flex flex-col gap-[var(--gap-card)]">
-                      {unstaged.map((item) => {
-                        globalIndex += 1;
+                      {unstaged.map((item, i) => {
+                        const key = titleKey(item.title);
                         return (
                           <OrderCard
                             key={`order-u-${item.title}`}
                             item={item}
-                            index={globalIndex}
+                            index={pipelineStart + globalIndex + i + 1}
+                            hasTodayLink={
+                              view.linkedKeys.has(key) && hasTodayOrLater(key)
+                            }
                           />
                         );
                       })}
                     </div>
                   </div>
                 );
               })()}
             </section>
           )}
+
+          {/* ── 稍后 ── */}
+          {view.later.length > 0 && (
+            <section
+              id="later"
+              className="scroll-mt-[calc(var(--banner-height)+1rem)]"
+            >
+              {laterCollapsed ? (
+                <details className="group">
+                  <summary className="mb-4 flex cursor-pointer list-none items-baseline gap-2 border-b border-[var(--line)] pb-2.5 marker:content-none [&::-webkit-details-marker]:hidden">
+                    <span
+                      className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mute)]"
+                      aria-hidden
+                    />
+                    <span className="text-[14px] font-semibold tracking-tight text-[var(--ink)]">
+                      稍后
+                    </span>
+                    <span className="text-[12px] tabular-nums text-[var(--faint)]">
+                      {view.later.length}
+                    </span>
+                    <span className="ml-auto text-[11px] font-medium text-[var(--faint)] group-open:hidden">
+                      展开
+                    </span>
+                    <span className="ml-auto hidden text-[11px] font-medium text-[var(--faint)] group-open:inline">
+                      收起
+                    </span>
+                  </summary>
+                  <div className="flex flex-col gap-[var(--gap-card)] opacity-90">
+                    {view.later.map((item, i) => {
+                      const linkedStage = linkedStageLabel(
+                        item.title,
+                        view.orders,
+                        view.linkedKeys,
+                      );
+                      return (
+                        <ActionCard
+                          key={`later-${item.title}`}
+                          item={item}
+                          index={laterStart + i + 1}
+                          linkedStage={linkedStage}
+                        />
+                      );
+                    })}
+                  </div>
+                </details>
+              ) : (
+                <>
+                  <SectionHead
+                    tone="later"
+                    title="稍后"
+                    count={view.later.length}
+                  />
+                  <div className="flex flex-col gap-[var(--gap-card)] opacity-90">
+                    {view.later.map((item, i) => {
+                      const linkedStage = linkedStageLabel(
+                        item.title,
+                        view.orders,
+                        view.linkedKeys,
+                      );
+                      return (
+                        <ActionCard
+                          key={`later-${item.title}`}
+                          item={item}
+                          index={laterStart + i + 1}
+                          linkedStage={linkedStage}
+                        />
+                      );
+                    })}
+                  </div>
+                </>
+              )}
+            </section>
+          )}
         </div>
+
+        <WorkflowKit />
       </main>
     </div>
   );
 }
diff --git a/src/components/FocusStrip.tsx b/src/components/FocusStrip.tsx
new file mode 100644
index 0000000..052ae63
--- /dev/null
+++ b/src/components/FocusStrip.tsx
@@ -0,0 +1,124 @@
+"use client";
+
+import { scrollToHash } from "@/lib/smooth-scroll";
+
+export type FocusStats = {
+  urgent: number;
+  today: number;
+  later: number;
+  orders: number;
+};
+
+type Chip = {
+  key: string;
+  label: string;
+  value: number;
+  href: string;
+  tone: "urgent" | "follow" | "orders" | "later";
+};
+
+const TONE: Record<Chip["tone"], string> = {
+  urgent: "var(--urgent)",
+  follow: "var(--follow)",
+  orders: "var(--pipe)",
+  later: "var(--mute)",
+};
+
+/**
+ * Focus strip: meetings dock + jump chips for Today / Pipeline / Later.
+ * Replaces the old StatsNav triage grid.
+ */
+export default function FocusStrip({
+  meetings,
+  stats,
+}: {
+  meetings: string[];
+  stats: FocusStats;
+}) {
+  const chips: Chip[] = [
+    {
+      key: "urgent",
+      label: "紧急",
+      value: stats.urgent,
+      href: "#today",
+      tone: "urgent",
+    },
+    {
+      key: "today",
+      label: "今日",
+      value: stats.today,
+      href: "#today",
+      tone: "follow",
+    },
+    {
+      key: "pipeline",
+      label: "管线",
+      value: stats.orders,
+      href: "#pipeline",
+      tone: "orders",
+    },
+    {
+      key: "later",
+      label: "稍后",
+      value: stats.later,
+      href: "#later",
+      tone: "later",
+    },
+  ];
+
+  return (
+    <section
+      className="mb-6 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]"
+      aria-label="焦点"
+    >
+      {meetings.length > 0 && (
+        <div className="border-b border-[var(--line)] px-3.5 py-3 sm:px-4">
+          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
+            会
+          </div>
+          <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-[var(--ink)]">
+            {meetings.map((m, i) => (
+              <li key={i} className="flex gap-2">
+                <span
+                  className="mt-[0.4em] h-1 w-1 shrink-0 rounded-full bg-[var(--ink)]"
+                  aria-hidden
+                />
+                <span>{m}</span>
+              </li>
+            ))}
+          </ul>
+        </div>
+      )}
+
+      <div
+        className="grid divide-x divide-[var(--line)]"
+        style={{
+          gridTemplateColumns: `repeat(${chips.length}, minmax(0, 1fr))`,
+        }}
+      >
+        {chips.map((c) => (
+          <a
+            key={c.key}
+            href={c.href}
+            onClick={(e) => {
+              e.preventDefault();
+              scrollToHash(c.href, 280);
+              history.replaceState(null, "", c.href);
+            }}
+            className="flex flex-col items-start gap-1.5 px-3 py-3.5 transition-colors duration-150 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-inset sm:px-3.5 sm:py-4"
+          >
+            <span
+              className="text-[1.5rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.65rem]"
+              style={{ color: TONE[c.tone] }}
+            >
+              {c.value}
+            </span>
+            <span className="text-[11px] font-medium leading-none text-[var(--muted)]">
+              {c.label}
+            </span>
+          </a>
+        ))}
+      </div>
+    </section>
+  );
+}
diff --git a/src/components/SiteFooter.tsx b/src/components/SiteFooter.tsx
index 3997818..328705d 100644
--- a/src/components/SiteFooter.tsx
+++ b/src/components/SiteFooter.tsx
@@ -1,8 +1,11 @@
 import Link from "next/link";
 import { SITE_NAME, siteBase } from "@/lib/brand";
 
+const HUB_URL = "https://erict16.github.io/huaming-hub/";
+const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";
+
 /** Ft2 — single-line quiet footer */
 export default function SiteFooter() {
   const base = siteBase();
   const year = new Date().getFullYear();
 
@@ -24,10 +27,26 @@ export default function SiteFooter() {
           </p>
           <nav
             className="flex flex-wrap items-center gap-x-3 gap-y-1"
             aria-label="Footer"
           >
+            <a
+              href={HUB_URL}
+              target="_blank"
+              rel="noopener noreferrer"
+              className="transition-colors duration-150 hover:text-[var(--ink)]"
+            >
+              Hub
+            </a>
+            <a
+              href={SELECTOR_URL}
+              target="_blank"
+              rel="noopener noreferrer"
+              className="transition-colors duration-150 hover:text-[var(--ink)]"
+            >
+              选型
+            </a>
             <Link
               href={`${base}/privacy/`}
               className="transition-colors duration-150 hover:text-[var(--ink)]"
             >
               Privacy
diff --git a/src/components/StatsNav.tsx b/src/components/StatsNav.tsx
index 85c9814..7a81429 100644
--- a/src/components/StatsNav.tsx
+++ b/src/components/StatsNav.tsx
@@ -1,58 +1,19 @@
-"use client";
-
-import { scrollToHash } from "@/lib/smooth-scroll";
-
+/**
+ * @deprecated Replaced by FocusStrip in Task 5 (Today / Pipeline / Later IA).
+ * Kept only so old imports fail loudly if reintroduced without intent.
+ * Do not use — import FocusStrip instead.
+ */
 export type StatTone = "urgent" | "follow" | "orders";
 
 export type StatItem = {
   key: string;
   id: string;
   label: string;
   tone: StatTone;
   value: number;
 };
 
-const TONE: Record<StatTone, string> = {
-  urgent: "var(--urgent)",
-  follow: "var(--follow)",
-  orders: "var(--orders)",
-};
-
-export default function StatsNav({ stats }: { stats: StatItem[] }) {
-  return (
-    <section
-      className="mb-6 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]"
-      aria-label="总览"
-    >
-      <div
-        className="grid divide-x divide-[var(--line)]"
-        style={{
-          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
-        }}
-      >
-        {stats.map((s) => (
-          <a
-            key={s.key}
-            href={`#${s.id}`}
-            onClick={(e) => {
-              e.preventDefault();
-              scrollToHash(`#${s.id}`, 280);
-              history.replaceState(null, "", `#${s.id}`);
-            }}
-            className="flex flex-col items-start gap-1.5 px-3.5 py-3.5 transition-colors duration-150 hover:bg-[var(--paper-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-inset sm:px-4 sm:py-4"
-          >
-            <span
-              className="text-[1.6rem] font-semibold leading-none tracking-tight tabular-nums sm:text-[1.75rem]"
-              style={{ color: TONE[s.tone] }}
-            >
-              {s.value}
-            </span>
-            <span className="text-[11px] font-medium leading-none text-[var(--muted)]">
-              {s.label}
-            </span>
-          </a>
-        ))}
-      </div>
-    </section>
-  );
+/** @deprecated Use FocusStrip */
+export default function StatsNav(_props: { stats: StatItem[] }) {
+  return null;
 }
diff --git a/src/components/WorkflowKit.tsx b/src/components/WorkflowKit.tsx
new file mode 100644
index 0000000..400a3b9
--- /dev/null
+++ b/src/components/WorkflowKit.tsx
@@ -0,0 +1,80 @@
+import { ORDER_STAGES } from "@/lib/order-stages";
+
+const HUB_URL = "https://erict16.github.io/huaming-hub/";
+const SELECTOR_URL = "https://erict16.github.io/oltc-selector/";
+
+/**
+ * Bottom workflow legend: 7 stages, writing rule, Hub + selector links.
+ * Teaching layer for Desk as dispatch core — not decoration.
+ */
+export default function WorkflowKit() {
+  return (
+    <details className="mt-[var(--gap-section)] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)]">
+      <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-semibold text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
+        <span className="flex items-center justify-between gap-2">
+          <span>工作流</span>
+          <span className="text-[11px] font-medium text-[var(--faint)]">
+            图例 · 写法 · 工具
+          </span>
+        </span>
+      </summary>
+
+      <div className="space-y-4 border-t border-[var(--line)] px-4 py-4">
+        {/* 7 stages */}
+        <div>
+          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--faint)]">
+            订单阶段
+          </div>
+          <ol className="flex flex-col gap-1.5">
+            {ORDER_STAGES.map((s, i) => (
+              <li
+                key={s.id}
+                className="flex items-baseline gap-2 text-[13px] leading-snug"
+              >
+                <span className="w-4 shrink-0 tabular-nums text-[11px] text-[var(--faint)]">
+                  {i + 1}
+                </span>
+                <span className="min-w-[2.5rem] font-semibold text-[var(--pipe)]">
+                  {s.short}
+                </span>
+                <span className="text-[var(--ink)]">{s.label}</span>
+                <span className="text-[var(--faint)]">· {s.hint}</span>
+              </li>
+            ))}
+          </ol>
+        </div>
+
+        {/* Writing rule */}
+        <p className="text-[13px] leading-relaxed text-[var(--muted)]">
+          标题可搜邮箱 · Todo=你要动 · Order=项目在哪
+        </p>
+
+        {/* External tools */}
+        <nav
+          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]"
+          aria-label="相关工具"
+        >
+          <a
+            href={HUB_URL}
+            target="_blank"
+            rel="noopener noreferrer"
+            className="font-medium text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
+          >
+            Huaming Hub ↗
+          </a>
+          <span className="text-[var(--line-strong)]" aria-hidden>
+            ·
+          </span>
+          <a
+            href={SELECTOR_URL}
+            target="_blank"
+            rel="noopener noreferrer"
+            className="font-medium text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
+          >
+            选型器 ↗
+          </a>
+        </nav>
+      </div>
+    </details>
+  );
+}
