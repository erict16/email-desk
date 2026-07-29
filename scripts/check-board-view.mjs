/**
 * Lightweight asserts for desk view helpers.
 * titleKey is mirrored from src/lib/title-key.ts — keep in sync.
 * (No ts-node dep; pure .mjs for CI/local smoke.)
 */
function titleKey(title) {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}

const assert = (c, m) => {
  if (!c) {
    console.error(m);
    process.exit(1);
  }
};

assert(titleKey("  PO 155798 ") === "po 155798", "titleKey normalize");
assert(titleKey("A  B") === "a b", "collapse spaces");
assert(titleKey("  ") === "", "empty after trim");
assert(titleKey("Hello") === "hello", "lowercase");

// linkedKeys concept: intersection of triage keys and order keys
function linkedKeysFrom(triageTitles, orderTitles) {
  const triage = new Set(triageTitles.map(titleKey));
  const orders = new Set(orderTitles.map(titleKey));
  const linked = new Set();
  for (const k of triage) {
    if (orders.has(k)) linked.add(k);
  }
  return linked;
}

const linked = linkedKeysFrom(
  ["  PO 155798 ", "Other"],
  ["po 155798", "Unrelated"],
);
assert(linked.has("po 155798"), "linkedKeys intersection");
assert(!linked.has("other"), "no false positive for triage-only");
assert(!linked.has("unrelated"), "no false positive for order-only");

// DeskView split counts (priority buckets)
function splitStats(items) {
  const p0 = items.filter((i) => i.priority === "P0");
  const p1 = items.filter((i) => i.priority === "P1");
  const p2 = items.filter((i) => i.priority === "P2");
  const today = [...p0, ...p1];
  return {
    urgent: p0.length,
    today: today.length,
    later: p2.length,
  };
}

const sample = [
  { priority: "P0", title: "A" },
  { priority: "P0", title: "B" },
  { priority: "P1", title: "C" },
  { priority: "P2", title: "D" },
  { priority: "ORDER", title: "E" },
];
const stats = splitStats(sample);
assert(stats.urgent === 2, "urgent = P0 count");
assert(stats.today === 3, "today = P0+P1 count");
assert(stats.later === 1, "later = P2 count");

console.log("check-board-view: ok");
