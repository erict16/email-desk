# Review package Task 2
BASE 9266b2197fd3e6028a429be06d84038670613fb5 HEAD 54bc3f439071fc2ebfd1424675060df03228572c
54bc3f4 feat(desk): title key and Today/Pipeline/Later view model
 package.json                 |  3 +-
 scripts/check-board-view.mjs | 66 ++++++++++++++++++++++++++++++++++++++++++++
 src/lib/board-view.ts        | 58 ++++++++++++++++++++++++++++++++++++++
 src/lib/title-key.ts         |  4 +++
 4 files changed, 130 insertions(+), 1 deletion(-)
diff --git a/package.json b/package.json
index 7aff9a9..794f89e 100644
--- a/package.json
+++ b/package.json
@@ -1,17 +1,18 @@
 {
   "name": "email-desk",
   "version": "2.0.0",
   "private": true,
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
-    "lint": "eslint"
+    "lint": "eslint",
+    "check:view": "node scripts/check-board-view.mjs"
   },
   "dependencies": {
     "gray-matter": "^4.0.3",
     "next": "^15.5.2",
     "react": "^19.1.1",
     "react-dom": "^19.1.1"
   },
   "devDependencies": {
diff --git a/scripts/check-board-view.mjs b/scripts/check-board-view.mjs
new file mode 100644
index 0000000..df169a1
--- /dev/null
+++ b/scripts/check-board-view.mjs
@@ -0,0 +1,66 @@
+/**
+ * Lightweight asserts for desk view helpers.
+ * titleKey is mirrored from src/lib/title-key.ts — keep in sync.
+ * (No ts-node dep; pure .mjs for CI/local smoke.)
+ */
+function titleKey(title) {
+  return title.trim().replace(/\s+/g, " ").toLowerCase();
+}
+
+const assert = (c, m) => {
+  if (!c) {
+    console.error(m);
+    process.exit(1);
+  }
+};
+
+assert(titleKey("  PO 155798 ") === "po 155798", "titleKey normalize");
+assert(titleKey("A  B") === "a b", "collapse spaces");
+assert(titleKey("  ") === "", "empty after trim");
+assert(titleKey("Hello") === "hello", "lowercase");
+
+// linkedKeys concept: intersection of triage keys and order keys
+function linkedKeysFrom(triageTitles, orderTitles) {
+  const triage = new Set(triageTitles.map(titleKey));
+  const orders = new Set(orderTitles.map(titleKey));
+  const linked = new Set();
+  for (const k of triage) {
+    if (orders.has(k)) linked.add(k);
+  }
+  return linked;
+}
+
+const linked = linkedKeysFrom(
+  ["  PO 155798 ", "Other"],
+  ["po 155798", "Unrelated"],
+);
+assert(linked.has("po 155798"), "linkedKeys intersection");
+assert(!linked.has("other"), "no false positive for triage-only");
+assert(!linked.has("unrelated"), "no false positive for order-only");
+
+// DeskView split counts (priority buckets)
+function splitStats(items) {
+  const p0 = items.filter((i) => i.priority === "P0");
+  const p1 = items.filter((i) => i.priority === "P1");
+  const p2 = items.filter((i) => i.priority === "P2");
+  const today = [...p0, ...p1];
+  return {
+    urgent: p0.length,
+    today: today.length,
+    later: p2.length,
+  };
+}
+
+const sample = [
+  { priority: "P0", title: "A" },
+  { priority: "P0", title: "B" },
+  { priority: "P1", title: "C" },
+  { priority: "P2", title: "D" },
+  { priority: "ORDER", title: "E" },
+];
+const stats = splitStats(sample);
+assert(stats.urgent === 2, "urgent = P0 count");
+assert(stats.today === 3, "today = P0+P1 count");
+assert(stats.later === 1, "later = P2 count");
+
+console.log("check-board-view: ok");
diff --git a/src/lib/board-view.ts b/src/lib/board-view.ts
new file mode 100644
index 0000000..d4cb99b
--- /dev/null
+++ b/src/lib/board-view.ts
@@ -0,0 +1,58 @@
+import type { BoardData, BoardItem } from "@/lib/parse-board";
+import { isOrderItem } from "@/lib/parse-board";
+import { compareByStageThenTitle } from "@/lib/order-stages";
+import { titleKey } from "@/lib/title-key";
+
+export type DeskView = {
+  today: BoardItem[]; // P0 then P1
+  later: BoardItem[]; // P2
+  orders: BoardItem[]; // isOrderItem, sorted by stage
+  meetings: string[];
+  stats: {
+    urgent: number; // P0
+    today: number; // P0+P1
+    later: number; // P2
+    orders: number;
+  };
+  /** titleKey → true if appears in both a triage item and an order item */
+  linkedKeys: Set<string>;
+};
+
+export function buildDeskView(board: BoardData): DeskView {
+  const all = board.sections.flatMap((s) => s.items);
+
+  const p0 = all.filter((i) => i.priority === "P0");
+  const p1 = all.filter((i) => i.priority === "P1");
+  const p2 = all.filter((i) => i.priority === "P2");
+
+  const today = [...p0, ...p1];
+  const later = p2;
+  const orders = all
+    .filter(isOrderItem)
+    .slice()
+    .sort(compareByStageThenTitle);
+
+  const triageKeys = new Set(
+    [...p0, ...p1, ...p2].map((i) => titleKey(i.title)),
+  );
+  const orderKeys = new Set(orders.map((i) => titleKey(i.title)));
+
+  const linkedKeys = new Set<string>();
+  for (const key of triageKeys) {
+    if (orderKeys.has(key)) linkedKeys.add(key);
+  }
+
+  return {
+    today,
+    later,
+    orders,
+    meetings: board.meetings,
+    stats: {
+      urgent: p0.length,
+      today: today.length,
+      later: later.length,
+      orders: orders.length,
+    },
+    linkedKeys,
+  };
+}
diff --git a/src/lib/title-key.ts b/src/lib/title-key.ts
new file mode 100644
index 0000000..08d6891
--- /dev/null
+++ b/src/lib/title-key.ts
@@ -0,0 +1,4 @@
+/** Normalize card titles for cross-list linking (triage ↔ order). */
+export function titleKey(title: string): string {
+  return title.trim().replace(/\s+/g, " ").toLowerCase();
+}
