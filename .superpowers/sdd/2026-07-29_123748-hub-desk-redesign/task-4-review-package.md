# T4 cd6c9d8548ac29cc9d16b6c541b0507aa9734754..b9c6d6c49d864688a03b9066926ea518f8604e7f
b9c6d6c feat(desk): action and pipeline cards with cross-link slots
 src/components/ActionCard.tsx | 97 +++++++++++++++++++++++++++++++++++++++++++
 src/components/Card.tsx       | 24 +++--------
 src/components/OrderCard.tsx  | 95 ++++++++++++++++++++----------------------
 src/lib/tag-class.ts          | 19 +++++++++
 4 files changed, 165 insertions(+), 70 deletions(-)
diff --git a/src/components/ActionCard.tsx b/src/components/ActionCard.tsx
new file mode 100644
index 0000000..ced953e
--- /dev/null
+++ b/src/components/ActionCard.tsx
@@ -0,0 +1,97 @@
+import type { JSX } from "react";
+import type { BoardItem } from "@/lib/parse-board";
+import CopyTitle from "@/components/CopyTitle";
+import { tagClass } from "@/lib/tag-class";
+
+/**
+ * Today / Later action card — action spine is the visual backbone.
+ * P0: left urgent rail (no "P0" chip). Cross-link to pipeline when linkedStage set.
+ */
+export default function ActionCard({
+  item,
+  index,
+  urgent = false,
+  linkedStage,
+}: {
+  item: BoardItem;
+  index: number;
+  urgent?: boolean;
+  linkedStage?: string;
+}): JSX.Element {
+  return (
+    <article
+      className={`rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-[var(--pad-card-x)] py-[var(--pad-card-y)] transition-[border-color,background-color] duration-150 hover:border-[var(--line-strong)] hover:bg-[var(--paper-2)] ${
+        urgent ? "border-l-[3px] border-l-[var(--urgent)]" : ""
+      }`}
+    >
+      <div className="flex flex-col gap-[var(--gap-stack)]">
+        {/* 1. Title row + CopyTitle + date */}
+        <div className="flex items-start justify-between gap-3">
+          <div className="flex min-w-0 items-start gap-1">
+            <h3
+              className="min-w-0 select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
+              title="可复制标题 → 邮箱搜索"
+            >
+              <span className="mr-1.5 font-medium tabular-nums text-[var(--faint)]">
+                {index}.
+              </span>
+              {item.title}
+            </h3>
+            <CopyTitle title={item.title} />
+          </div>
+          {item.date && (
+            <span className="shrink-0 pt-0.5 text-[11px] leading-none tabular-nums text-[var(--faint)]">
+              {item.date}
+            </span>
+          )}
+        </div>
+
+        {/* 2. Action spine */}
+        {item.action && (
+          <p className="rounded-[var(--radius-sm)] bg-[var(--action-bg)] px-2.5 py-1.5 text-[13px] leading-snug text-[var(--action-ink)]">
+            <span className="font-semibold">待办 · </span>
+            {item.action}
+          </p>
+        )}
+
+        {/* 3. Tags */}
+        {item.tags && item.tags.length > 0 && (
+          <div className="flex flex-wrap gap-1.5">
+            {item.tags.map((t) => (
+              <span
+                key={t}
+                className={`inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[10px] font-medium leading-none ${tagClass(t)}`}
+              >
+                {t}
+              </span>
+            ))}
+          </div>
+        )}
+
+        {/* 4. People */}
+        {item.people && (
+          <p className="text-[11px] leading-normal text-[var(--faint)]">
+            发件人：{item.people}
+          </p>
+        )}
+
+        {/* 5. Meta ~2 lines */}
+        {item.meta && (
+          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
+            {item.meta}
+          </p>
+        )}
+
+        {/* 6. Cross-link to pipeline */}
+        {linkedStage && (
+          <a
+            href="#pipeline"
+            className="inline-flex w-fit items-center text-[12px] font-medium leading-none text-[var(--pipe)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
+          >
+            管线 · {linkedStage}
+          </a>
+        )}
+      </div>
+    </article>
+  );
+}
diff --git a/src/components/Card.tsx b/src/components/Card.tsx
index fb7b088..d6bef8b 100644
--- a/src/components/Card.tsx
+++ b/src/components/Card.tsx
@@ -1,27 +1,13 @@
 import type { BoardItem } from "@/lib/parse-board";
+import { tagClass } from "@/lib/tag-class";
 
-function tagClass(label: string): string {
-  const t = label.trim();
-  if (/需尽快|优先|紧急|催你|阻塞/.test(t))
-    return "bg-[var(--urgent-soft)] text-[var(--urgent)]";
-  if (/待你|待发|待打包|待放行|待补|你欠/.test(t))
-    return "bg-[var(--follow-soft)] text-[var(--follow)]";
-  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判/.test(t))
-    return "bg-[var(--follow-soft)] text-[var(--follow)]";
-  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
-    return "bg-[var(--orders-soft)] text-[var(--orders)]";
-  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产/.test(t))
-    return "bg-[var(--paper-2)] text-[var(--muted)]";
-  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy|会议/.test(t))
-    return "bg-[var(--paper-2)] text-[var(--muted)]";
-  if (/缺|售后|物流|补发|顶盖/.test(t))
-    return "bg-[var(--orders-soft)] text-[var(--orders)]";
-  return "bg-[var(--paper-2)] text-[var(--muted)]";
-}
-
+/**
+ * Legacy triage card — Board still imports until Task 5 wires ActionCard.
+ * Prefer ActionCard for Today / Later.
+ */
 export default function Card({
   item,
   index,
   hideAction = false,
   showStripe = false,
 }: {
diff --git a/src/components/OrderCard.tsx b/src/components/OrderCard.tsx
index 642c5b9..7dd0b18 100644
--- a/src/components/OrderCard.tsx
+++ b/src/components/OrderCard.tsx
@@ -1,33 +1,17 @@
+import type { JSX } from "react";
 import type { BoardItem } from "@/lib/parse-board";
 import {
   ORDER_STAGES,
   stageDef,
   stageIndex,
   stageProgress,
   type OrderStageId,
 } from "@/lib/order-stages";
-
-function tagClass(label: string): string {
-  const t = label.trim();
-  if (/需尽快|优先|紧急|催你|阻塞|卡住/.test(t))
-    return "bg-[var(--urgent-soft)] text-[var(--urgent)]";
-  if (/待你|待发|待打包|待放行|待补|你欠|等你/.test(t))
-    return "bg-[var(--follow-soft)] text-[var(--follow)]";
-  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判|等PO|等 PO|PO/.test(t))
-    return "bg-[var(--follow-soft)] text-[var(--follow)]";
-  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
-    return "bg-[var(--orders-soft)] text-[var(--orders)]";
-  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产|已签/.test(t))
-    return "bg-[var(--paper-2)] text-[var(--muted)]";
-  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy|会议/.test(t))
-    return "bg-[var(--paper-2)] text-[var(--muted)]";
-  if (/缺|售后|物流|补发|顶盖|单证|CI|PL|CO/.test(t))
-    return "bg-[var(--orders-soft)] text-[var(--orders)]";
-  return "bg-[var(--paper-2)] text-[var(--muted)]";
-}
+import CopyTitle from "@/components/CopyTitle";
+import { tagClass } from "@/lib/tag-class";
 
 function StageProgress({ current }: { current: OrderStageId }) {
   const cur = stageIndex(current);
   const { current: n, total } = stageProgress(current);
   const def = stageDef(current);
   return (
@@ -40,85 +24,85 @@ function StageProgress({ current }: { current: OrderStageId }) {
           <span
             key={s.id}
             className="h-1.5 w-1.5 rounded-full"
             style={{
               background:
                 i < cur
-                  ? "var(--orders)"
+                  ? "var(--pipe)"
                   : i === cur
                     ? "var(--ink)"
                     : "var(--line-strong)",
               opacity: i === cur ? 1 : i < cur ? 0.55 : 0.45,
             }}
             title={s.label}
           />
         ))}
       </div>
+      <span className="text-[11px] leading-none text-[var(--mute)]">
+        {def.short}
+      </span>
       <span className="text-[11px] leading-none tabular-nums text-[var(--faint)]">
         {n}/{total}
       </span>
     </div>
   );
 }
 
+/**
+ * Pipeline order card — stage dots + 卡点 spine.
+ * Cross-link to Today when hasTodayLink.
+ */
 export default function OrderCard({
   item,
   index,
+  hasTodayLink = false,
 }: {
   item: BoardItem;
   index: number;
-}) {
+  hasTodayLink?: boolean;
+}): JSX.Element {
   const stage = item.stage;
-  const def = stage ? stageDef(stage) : null;
 
   return (
     <article className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--card)] px-[var(--pad-card-x)] py-[var(--pad-card-y)] transition-[border-color,background-color] duration-150 hover:border-[var(--line-strong)] hover:bg-[var(--paper-2)]">
       <div className="flex flex-col gap-[var(--gap-stack)]">
-        <div className="flex items-start justify-between gap-3">
-          <div className="min-w-0">
+        {/* 1. Title + CopyTitle + customer */}
+        <div className="min-w-0">
+          <div className="flex items-start gap-1">
             <h3
-              className="select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
+              className="min-w-0 select-text text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--ink)]"
               title="可复制标题 → 邮箱搜索"
             >
               <span className="mr-1.5 font-medium tabular-nums text-[var(--faint)]">
                 {index}.
               </span>
               {item.title}
             </h3>
-            {(item.customer || def) && (
-              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-none text-[var(--muted)]">
-                {item.customer && (
-                  <span className="font-medium text-[var(--ink)]/80">
-                    {item.customer}
-                  </span>
-                )}
-                {def && (
-                  <span className="inline-flex items-center rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--ink)]">
-                    {def.label}
-                  </span>
-                )}
-              </div>
-            )}
+            <CopyTitle title={item.title} />
           </div>
-          {item.date && (
-            <span className="shrink-0 pt-0.5 text-[11px] leading-none tabular-nums text-[var(--faint)]">
-              {item.date}
-            </span>
+          {item.customer && (
+            <p className="mt-1 text-[12px] font-medium leading-none text-[var(--ink)]/80">
+              {item.customer}
+            </p>
           )}
         </div>
 
+        {/* 2. 7 progress dots */}
         {stage && <StageProgress current={stage} />}
 
-        {item.meta && (
-          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
-            {item.meta}
+        {/* 3. 卡点 spine on pipe-soft */}
+        {item.action && (
+          <p className="rounded-[var(--radius-sm)] bg-[var(--pipe-soft)] px-2.5 py-1.5 text-[13px] leading-snug text-[var(--ink)]">
+            <span className="font-semibold text-[var(--pipe)]">卡点 · </span>
+            {item.action}
           </p>
         )}
 
+        {/* 4. tags / people / one-line meta */}
         {item.tags && item.tags.length > 0 && (
-          <div className="flex flex-wrap gap-1.5 pt-0.5">
+          <div className="flex flex-wrap gap-1.5">
             {item.tags.map((t) => (
               <span
                 key={t}
                 className={`inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[10px] font-medium leading-none ${tagClass(t)}`}
               >
                 {t}
@@ -130,16 +114,25 @@ export default function OrderCard({
         {item.people && (
           <p className="text-[11px] leading-normal text-[var(--faint)]">
             {item.people}
           </p>
         )}
 
-        {item.action && (
-          <p className="mt-0.5 border-l-2 border-[var(--orders)] pl-2.5 text-[13px] leading-snug text-[var(--ink)]">
-            <span className="font-medium text-[var(--orders)]">卡点 </span>
-            {item.action}
+        {item.meta && (
+          <p className="line-clamp-1 text-[13px] leading-relaxed text-[var(--muted)]">
+            {item.meta}
           </p>
         )}
+
+        {/* 5. Cross-link to today */}
+        {hasTodayLink && (
+          <a
+            href="#today"
+            className="inline-flex w-fit items-center text-[12px] font-medium leading-none text-[var(--follow)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
+          >
+            今日有待办
+          </a>
+        )}
       </div>
     </article>
   );
 }
diff --git a/src/lib/tag-class.ts b/src/lib/tag-class.ts
new file mode 100644
index 0000000..dc508e9
--- /dev/null
+++ b/src/lib/tag-class.ts
@@ -0,0 +1,19 @@
+/** Tag chip color heuristics (shared by action / pipeline / legacy cards). */
+export function tagClass(label: string): string {
+  const t = label.trim();
+  if (/需尽快|优先|紧急|催你|阻塞|卡住/.test(t))
+    return "bg-[var(--urgent-soft)] text-[var(--urgent)]";
+  if (/待你|待发|待打包|待放行|待补|你欠|等你/.test(t))
+    return "bg-[var(--follow-soft)] text-[var(--follow)]";
+  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判|等PO|等 PO|PO/.test(t))
+    return "bg-[var(--follow-soft)] text-[var(--follow)]";
+  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
+    return "bg-[var(--orders-soft)] text-[var(--orders)]";
+  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产|已签/.test(t))
+    return "bg-[var(--paper-2)] text-[var(--muted)]";
+  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy|会议/.test(t))
+    return "bg-[var(--paper-2)] text-[var(--muted)]";
+  if (/缺|售后|物流|补发|顶盖|单证|CI|PL|CO/.test(t))
+    return "bg-[var(--orders-soft)] text-[var(--orders)]";
+  return "bg-[var(--paper-2)] text-[var(--muted)]";
+}
