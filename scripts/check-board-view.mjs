/**
 * Lightweight asserts for desk view helpers (ball-in-court + titleKey).
 * Mirrors logic in src/lib — keep in sync when changing partition rules.
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

function parseBall(raw) {
  if (!raw) return undefined;
  const k = String(raw).trim().toLowerCase().replace(/\s+/g, "");
  if (["me", "i", "mine", "我", "自己", "eric"].includes(k)) return "me";
  if (
    ["them", "they", "other", "others", "对方", "别人", "客户", "工厂", "wait"].includes(
      k,
    )
  ) {
    return "them";
  }
  return undefined;
}

function isWaitingItem(item) {
  if (item.ball === "them") return true;
  if (item.ball === "me") return false;
  return Boolean(item.wait && String(item.wait).trim());
}

/**
 * Partition triage by ball-in-court (mirrors buildDeskView).
 */
function partition(items) {
  const triage = items.filter(
    (i) => i.priority === "P0" || i.priority === "P1" || i.priority === "P2",
  );
  const mine = triage.filter(
    (i) =>
      (i.priority === "P0" || i.priority === "P1") && !isWaitingItem(i),
  );
  const waiting = triage.filter((i) => isWaitingItem(i));
  const later = triage.filter(
    (i) => i.priority === "P2" && !isWaitingItem(i),
  );
  return {
    mine,
    waiting,
    later,
    stats: {
      mine: mine.length,
      waiting: waiting.length,
      later: later.length,
    },
  };
}

// Legacy: no ball/wait → all P0/P1 mine, P2 later
const legacy = partition([
  { priority: "P0", title: "A" },
  { priority: "P0", title: "B" },
  { priority: "P1", title: "C" },
  { priority: "P2", title: "D" },
  { priority: "ORDER", title: "E" },
]);
assert(legacy.stats.mine === 3, "legacy: P0+P1 → mine");
assert(legacy.stats.waiting === 0, "legacy: no waiting");
assert(legacy.stats.later === 1, "legacy: P2 → later");

// Explicit ball: them → wait zone
const withBall = partition([
  { priority: "P0", title: "QS", ball: "me" },
  { priority: "P0", title: "EVN", ball: "them", wait: "工厂新提货日" },
  { priority: "P1", title: "UE", wait: "沈工图纸" }, // wait-only → them
  { priority: "P2", title: "SG", ball: "me" }, // P2 + me stays later? wait no - P2 not mine
  { priority: "P2", title: "Watch", wait: "客户" }, // P2 + wait → waiting
]);
assert(withBall.mine.map((i) => i.title).join() === "QS", "ball me only in mine");
assert(
  withBall.waiting.map((i) => i.title).sort().join() === "EVN,UE,Watch",
  "waiting: them + wait-only + P2 wait",
);
assert(withBall.later.map((i) => i.title).join() === "SG", "P2 me → later");

// ball: me wins over wait:
assert(!isWaitingItem({ ball: "me", wait: "x" }), "ball me overrides wait");
assert(isWaitingItem({ ball: "them" }), "ball them is waiting");
assert(isWaitingItem({ wait: "工厂" }), "wait-only is waiting");
assert(!isWaitingItem({}), "default not waiting");

assert(parseBall("对方") === "them", "parseBall 对方");
assert(parseBall("我") === "me", "parseBall 我");
assert(parseBall("me") === "me", "parseBall me");

// Red bar rule (logic only): mine ∩ P0
const redBar = (item, zone) => zone === "mine" && item.priority === "P0";
assert(redBar({ priority: "P0" }, "mine") === true, "red bar mine P0");
assert(redBar({ priority: "P0" }, "wait") === false, "no red bar on wait");
assert(redBar({ priority: "P1" }, "mine") === false, "no red bar P1");

console.log("check-board-view: ok");
