### Task 2: Title key + board view model

**Files:**
- Create: `~/Github/email-desk/src/lib/title-key.ts`
- Create: `~/Github/email-desk/src/lib/board-view.ts`
- Create: `~/Github/email-desk/scripts/check-board-view.mjs`
- Modify: `~/Github/email-desk/src/lib/parse-board.ts` (stats only if needed)
- Modify: `~/Github/email-desk/package.json` (script `check:view`)

**Interfaces:**
- Produces:

```ts
// title-key.ts
export function titleKey(title: string): string;
// trim → collapse whitespace → lowercase

// board-view.ts
export type DeskView = {
  today: BoardItem[];      // P0 then P1
  later: BoardItem[];      // P2
  orders: BoardItem[];     // isOrderItem, sorted by stage
  meetings: string[];
  stats: {
    urgent: number;  // P0
    today: number;   // P0+P1
    later: number;   // P2
    orders: number;
  };
  /** titleKey → true if appears in both a triage item and an order item */
  linkedKeys: Set<string>;
};

export function buildDeskView(board: BoardData): DeskView;
```

- Consumes: `BoardData`, `isOrderItem`, `compareByStageThenTitle` from existing libs.

- [ ] **Step 1: Write `title-key.ts`**

```ts
export function titleKey(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}
```

- [ ] **Step 2: Write `board-view.ts`** implementing `buildDeskView`:
  - Flatten `board.sections` items
  - `today` = P0 + P1 (P0 first)
  - `later` = P2
  - `orders` = `isOrderItem` + `compareByStageThenTitle`
  - `linkedKeys`: keys present in (P0|P1|P2) set **and** order set
  - stats as above

- [ ] **Step 3: Write `scripts/check-board-view.mjs`** that imports compiled logic via dynamic ts is hard without ts-node — prefer **pure .mjs reimplementation of titleKey for assert** OR run with `npx tsx`. Simplest path without new deps:

```js
// scripts/check-board-view.mjs — mirror titleKey + minimal split asserts
function titleKey(title) {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}
const assert = (c, m) => { if (!c) { console.error(m); process.exit(1); } };
assert(titleKey("  PO 155798 ") === "po 155798", "titleKey normalize");
assert(titleKey("A  B") === "a b", "collapse spaces");
console.log("check-board-view: ok");
```

Also add a second assert file path: export `titleKey` used from components; after components land, extend script to `node --experimental-strip-types` if Node ≥22, else keep mjs mirror + comment “keep in sync with title-key.ts”.

- [ ] **Step 4: Add npm script**

```json
"check:view": "node scripts/check-board-view.mjs"
```

- [ ] **Step 5: Run**

```bash
cd ~/Github/email-desk && npm run check:view
```

Expected: `check-board-view: ok`

- [ ] **Step 6: Commit**

```bash
git add src/lib/title-key.ts src/lib/board-view.ts scripts/check-board-view.mjs package.json
git commit -m "feat(desk): title key and Today/Pipeline/Later view model"
```

---
