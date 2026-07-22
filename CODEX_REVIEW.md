# Email Desk — Code Review

**Repo:** `erict16/email-desk`  
**Branch reviewed:** `main` @ `bf0b462` (+ this review branch)  
**Date:** 2026-07-22  
**Method:** Full source read (Codex CLI unavailable on this Windows host — missing `@openai/codex-win32-x64` optional binary from npm). Review performed in-repo by Hermes with the same checklist Codex would use.

**Live:** https://erict16.github.io/email-desk/

---

## Summary

Email Desk is a small, well-scoped static board: **Next.js export + one Markdown content file + GH Pages**. The product rules (who+what tags, mailbox-search titles, meetings, no FYI todos, WorkBuddy colors) are now documented in `README.md` and mostly enforced in UI. Architecture fits a solo daily desk: low ops, zero backend.

Main risks are not “framework complexity” but **(1) public content leakage**, **(2) UI edge polish still brittle (left stripe / favicon)**, and **(3) zero automated tests** around `parse-board` / content shape.

Overall: **shippable MVP**, ready for content-only cadence if the open High/Medium items below are tracked.

---

## What's good

| Area | Note |
|------|------|
| Content/UI split | Daily path is only `content/board.md` → push. Correct for Eric. |
| Static export | `output: 'export'`, `basePath: /email-desk`, `trailingSlash` — Pages-friendly. |
| Stats ↔ sections | Single mapping table in `Board.tsx` (P0 / P1+P2 / FYI / OK) — easy to reason about. |
| Tag copy rules | README + skill docs push “who+what”; `tagClass` is heuristic but good enough. |
| Timezone display | `tz: Asia/Shanghai` → `北京时间 10:20 am`; switchable to Singapore later. |
| FYI/done actions | `hideAction` prevents fake todos in 知会/已完成. |
| Asset cache-bust | `?v=girlN` on favicon/logo — needed for Pages CDN. |
| README | Now encodes product locks (titles, tags, 发件人, meetings). |

---

## Issues

### High

1. **Public board can leak sensitive commercial detail**  
   - `content/board.md` is on a **public** repo/Pages site.  
   - Cards currently include PO/QS numbers, customer names, internal process notes.  
   - **Fix:** Keep a private scrub checklist in README (already partial); consider a pre-commit or CI grep for currency amounts / long account tables. Never paste full SOA numbers into board.

2. **No tests for `parse-board.ts`**  
   - Time formatting, meetings fallback, priority→stats are easy to break silently.  
   - **Fix:** Add a tiny node test (or vitest) with fixture markdown → assert stats + `北京时间 10:20 am` + meetings parse.

### Medium

3. **React keys use card titles** (`Board.tsx` ~199)  
   - Duplicate titles across sections → key collision / wrong reuse.  
   - **Fix:** `key={\`${block.id}-${globalIndex}-${item.title}\`}` or stable id field in markdown.

4. **Asymmetric `border-l-[3px]` + `rounded-xl` still browser-dependent**  
   - WorkBuddy often paints left accent as the border itself (correct approach now in `Card.tsx`).  
   - Some engines still soften thick left borders at radii. If still imperfect after this PR: use  
     `box-shadow: inset 3px 0 0 var(--urgent)` with uniform `border: 1px solid …` (inset shadow follows the padding box cleanly).  
   - Keep **only** on 紧急 cards.

5. **Favicon optical size vs WorkBuddy**  
   - WorkBuddy frog is a full-bleed solid mark. Girl logo has large white field → even full-tile PNGs look “smaller” at 16×16.  
   - **Mitigations already:** opaque tile, less padding, slight face zoom (`girl7`).  
   - **If still small:** generate a dedicated 32×32 mark with tighter crop on the face (not the full portrait) for `icons.icon` sizes.

6. **`formatUpdated` Date branch has dead code**  
   - `const hour = Number(get("hour"))` unused (`parse-board.ts`).  
   - **Fix:** delete unused locals; optionally unit-test both Date and string paths.

7. **Stale root `index.html` / `index.html.bak`**  
   - Risk that someone deploys repo root instead of Actions `out/`.  
   - **Fix:** delete bak; add a one-line warning in README; ensure Pages source stays Actions-only.

8. **Section order in markdown (`todo`/`done`/`fyi`) ignored for display**  
   - Display order is forced by `STATS` (good), but authors may think `## done` position matters.  
   - **Fix:** Document clearly (README already partial): *priority field drives placement, not `##` order*.

### Low

9. **Hover `translate-y` on many cards** can feel jittery on long lists — optional reduce to shadow-only.  
10. **Global index numbering** restarts logic is fine but renumbers when filters change counts — expected.  
11. **`layout.tsx` indentation** of `apple` icon entry is slightly messy — cosmetic.  
12. **Dark mode** tokens exist but product is light-first; fine for now.

---

## Security / public-site content risks

- Treat every board line as **world-readable**.  
- Prefer operational next-steps over contract terms, unit prices, bank details.  
- `people:` is OK (names already in email headers); avoid personal mobiles.  
- Share button copies the public URL — fine; don’t put draft secrets in query strings.

---

## Suggested next PRs (max 5)

1. **test(parse-board):** fixtures for stats, meetings, BJ/SG clock labels.  
2. **fix(ui):** if left stripe still soft at corners, switch urgent accent to `inset box-shadow`.  
3. **chore:** remove `index.html.bak`; add CI content lint (no `$` amounts / long tables).  
4. **feat(favicon):** face-cropped 32×32 + 16×16 multi-size icons.  
5. **chore(keys):** stable card ids in markdown (`id: sanaky-air-docs`).

---

## UI checklist vs Eric feedback (2026-07-22)

| Request | Status |
|---------|--------|
| No harsh「死线」 | Done (`需尽快`) |
| who+what tags | Done in content + README |
| Meetings replace 本周优先 | Done |
| 知会 no 待办 | Done |
| Order 知会 before 已完成 | Done |
| Labels 已完成 / 知会 | Done |
| Section title: thin **horizontal** line + crisp mark | Done (SVG, not system emoji) |
| Left stripe **only** on 紧急 | Done |
| Stripe flush like WorkBuddy | **border-left approach** (this push); verify in browser |
| Subtitle drop Inbox+Sent | Done (`Eric Tan`) |
| 北京时间 10:20 am | Done |
| Favicon larger | Full-bleed opaque tile `girl7` — optical vs frog still different art |

---

## Reviewer note on Codex CLI

```
npm i -g @openai/codex  → fails: Missing optional dependency @openai/codex-win32-x64
npm i @openai/codex-win32-x64 → 404 on registry.npmjs.org
```

When the Windows binary package is published again, re-run:

```bash
codex exec --sandbox danger-full-access "Re-review email-desk; update CODEX_REVIEW.md"
```
