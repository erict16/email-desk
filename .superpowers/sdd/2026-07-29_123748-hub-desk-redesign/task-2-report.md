# Task 2 Report: Title key + board view model

**Status:** DONE  
**Date:** 2026-07-29  
**Commit:** `54bc3f4` — `feat(desk): title key and Today/Pipeline/Later view model`

---

## Summary

Implemented pure TypeScript view-model helpers for the hub desk redesign:

1. **`titleKey`** — normalize card titles for triage ↔ order linking  
2. **`buildDeskView`** — project `BoardData` into Today / Later / Orders + stats + `linkedKeys`  
3. **Smoke check** — `npm run check:view` via mirrored pure `.mjs` asserts (no new deps)

No UI components, no mail API, no `board.md` field renames. `parse-board.ts` left unchanged (existing `BoardData.stats` remain for legacy Board UI; desk stats live on `DeskView`).

---

## Files

| Path | Action |
|------|--------|
| `src/lib/title-key.ts` | Created |
| `src/lib/board-view.ts` | Created |
| `scripts/check-board-view.mjs` | Created |
| `package.json` | Added `"check:view"` script |
| `src/lib/parse-board.ts` | Unchanged (not needed) |

---

## Interfaces delivered

### `src/lib/title-key.ts`

```ts
export function titleKey(title: string): string;
// trim → collapse whitespace → lowercase
```

### `src/lib/board-view.ts`

```ts
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

### Consumes (unchanged)

- `BoardData`, `BoardItem`, `isOrderItem` from `src/lib/parse-board.ts`
- `compareByStageThenTitle` from `src/lib/order-stages.ts`

---

## Implementation notes

### `buildDeskView` behavior

1. Flatten all `board.sections[].items`
2. **today** = all `P0` items, then all `P1` (P0 first; within each priority, source order preserved)
3. **later** = all `P2`
4. **orders** = items where `isOrderItem` is true, sorted with `compareByStageThenTitle` (earlier stage first, then title `localeCompare` zh)
5. **meetings** = pass-through from `board.meetings`
6. **stats**
   - `urgent` = count of P0
   - `today` = count of P0 + P1
   - `later` = count of P2
   - `orders` = length of filtered/sorted orders list
7. **linkedKeys** = intersection of `titleKey` sets from triage items (P0|P1|P2) and order items

### `isOrderItem` interaction

Existing helper already excludes pure triage priorities (`P0`/`P1`/`P2`/`FYI`), so an item cannot appear in both `today`/`later` and `orders` as the same object. Linking is by **normalized title** only (`linkedKeys`), which is the intended dual-list UX for cards that share a title across triage and pipeline sections.

### Check script strategy

Brief allowed pure `.mjs` reimplementation of `titleKey` (no ts-node). Script:

- Mirrors `titleKey` and asserts normalize / collapse / empty / lowercase
- Asserts `linkedKeys` intersection concept
- Asserts priority bucket stats (urgent / today / later)
- Documents “keep in sync with `title-key.ts`”
- Future: can switch to `node --experimental-strip-types` when components land and Node ≥22 is assumed

---

## Verification

```bash
cd ~/Github/email-desk && npm run check:view
```

**Result:** `check-board-view: ok` (exit 0)

---

## Commit

```
54bc3f4 feat(desk): title key and Today/Pipeline/Later view model
```

Files in commit:

- `src/lib/title-key.ts` (new)
- `src/lib/board-view.ts` (new)
- `scripts/check-board-view.mjs` (new)
- `package.json` (`check:view`)

---

## Constraints checklist

- [x] board.md field names stay compatible (parser untouched)
- [x] No mail API
- [x] Produces `titleKey` + `buildDeskView` as specified
- [x] `scripts/check-board-view.mjs` + `npm run check:view`
- [x] Commit message from brief

---

## Concerns

None. Pure TS view model only; UI wiring is out of scope for this task.

Optional follow-up for later tasks:

- Extend `check-board-view.mjs` to import real TS via strip-types once desk UI lands and runtime Node version is known.
- If product wants within-priority sort (e.g. by date/title) for Today, that is not specified here — currently preserves section flatten order within P0/P1/P2.

---

## Ready for next task

Task 3+ can import:

```ts
import { titleKey } from "@/lib/title-key";
import { buildDeskView, type DeskView } from "@/lib/board-view";
import { loadBoard } from "@/lib/parse-board";

const view = buildDeskView(loadBoard());
```
