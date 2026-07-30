# Task 5 Report: FocusStrip + Board IA rewrite

**Status:** DONE  
**Date:** 2026-07-29  
**Commit:** `2710dff` — `feat(desk): Today / Pipeline / Later dispatch IA`

---

## Summary

Replaced the old TRIAGE IA (紧急 / 需跟进 / 订单) with **Today / Pipeline / Later** dispatch structure:

1. **`FocusStrip`** — meetings dock + chips 紧急 / 今日 / 管线 / 稍后 → `#today` `#pipeline` `#later`
2. **`WorkflowKit`** — collapsible 7-stage legend, writing rule one-liner, Hub + selector links
3. **`Board`** rewritten around `buildDeskView(board)`:
   - 今日行动 (`#today`) — P0+P1 ActionCards; P0 `urgent`
   - 订单管线 (`#pipeline`) — vertical stage lanes + OrderCards (not 7-col kanban)
   - 稍后 (`#later`) — P2 ActionCards; collapsed `<details>` when count > 3
4. Cross-links via `titleKey` + `linkedKeys` → ActionCard `linkedStage` / OrderCard `hasTodayLink`
5. **SiteFooter** — Hub + 选型 external links + privacy/terms
6. **StatsNav** — deprecated stub (returns null); Board no longer imports it

---

## Files

| Path | Action |
|------|--------|
| `src/components/FocusStrip.tsx` | Created — meetings + 4 jump chips |
| `src/components/WorkflowKit.tsx` | Created — stages legend + rule + tools |
| `src/components/Board.tsx` | Rewritten — DeskView IA only |
| `src/components/SiteFooter.tsx` | Modified — Hub + 选型 links |
| `src/components/StatsNav.tsx` | Deprecated — null stub |

---

## Interfaces used

```ts
buildDeskView(board): DeskView
// today, later, orders, meetings, stats{urgent,today,later,orders}, linkedKeys

titleKey(title): string
stageDef(id): OrderStageDef  // .label for cross-link
ORDER_STAGES                 // vertical lanes + WorkflowKit

ActionCard({ item, index, urgent?, linkedStage? })
OrderCard({ item, index, hasTodayLink? })
```

### Anchors

| id | Content |
|----|---------|
| `#today` | P0 then P1 ActionCards |
| `#pipeline` | Stage lanes + OrderCards |
| `#later` | P2 ActionCards |
| `#order-stage-{id}` | Per-stage lane |

### FocusStrip chips

| Label | value | href | tone |
|-------|-------|------|------|
| 紧急 | stats.urgent | `#today` | urgent |
| 今日 | stats.today | `#today` | follow |
| 管线 | stats.orders | `#pipeline` | pipe |
| 稍后 | stats.later | `#later` | mute |

### Cross-link wiring

```ts
const key = titleKey(item.title);
const linked = view.linkedKeys.has(key);
// ActionCard: linkedStage = stageDef(matchingOrder.stage).label
// OrderCard: hasTodayLink = linked && today/later has same key
```

### Later collapse rule

- `later.length > 3` → `<details>` **closed** by default (展开/收起)
- `later.length ≤ 3` → expanded, normal SectionHead

---

## Verification

```text
npm run check:view  → check-board-view: ok
npm run build       → Compiled successfully; static export OK
```

---

## Concerns / follow-ups

1. **Card.tsx** still in tree as legacy; unused by Board after this task — safe to delete later.
2. **StatsNav.tsx** kept as deprecated null export so accidental re-imports compile but render nothing; prefer delete in a cleanup pass.
3. **Urgent chip** scrolls to `#today` (whole section), not a dedicated P0 sub-anchor — matches brief; P0 cards still lead the list with red rail.
4. **Dev visual** not run in headless agent session; spot-check localhost for meetings dock, P0 rail, stage lanes, collapsed later when board has >3 P2s.
5. External links open new tab (`target="_blank"` + `rel="noopener noreferrer"`).
