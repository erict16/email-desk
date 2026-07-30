# Task 8 Report: Hub i18n + Home IA

**Status:** DONE  
**Date:** 2026-07-29  
**Repo:** `/Users/youming/Github/huaming-hub` (branch `main`)  
**Commit:** `a73f58c` — `feat(hub): docs-first home IA without howto block`

---

## What was done

### 1. `src/lib/i18n.ts` — docs-first home strings

Rewrote `en.home` / `zh.home`:

| Area | EN | ZH |
|------|----|----|
| Kicker | Unofficial · Huaming | 非官方 · 华明 |
| H1 | OLTC / DETC documents & series | 有载 / 无励磁分接开关资料与系列 |
| Lead | One short functional line (PDFs on intl site) | Same density |
| CTAs | Browse documents · Product series · Selector | 浏览资料 · 产品系列 · 选型 |
| Docs band | title + count desc + Open docs | 技术资料 / 打开资料 |
| Series | Product series · All series | 产品系列 · 全部系列 |
| Selector strip | title + first-pass note + Open tool | 选型 strip |

**Removed:** `meta`, entry-grid keys (`entriesLabel`, `entry*`), howto keys (`howTitle`, `how1*`…`how3*`).

### 2. `src/components/HomePage.tsx` — structure rewrite

```
1. Hero: kicker + h1 + lead + CTAs
   - Docs primary → /downloads
   - Products secondary → /products
   - Selector secondary external → oltc-selector
2. Docs band: title + PDF count + link /downloads
3. Series preview: all productSeries compact rows (mono code · name · blurb)
   + All series → /products
4. Selector one-line tool strip (external)
```

**Removed entirely:** 01/02/03 howto section and three-entry grid.

### 3. `src/components/SiteHeader.tsx` — nav order

**Before:** Home · Products · Docs · Selector  
**After:** Docs · Products · Selector (logo remains home)

Matches redesign IA: 资料 | 系列 | 选型 ↗.

### 4. Supporting (needed for new bands)

- `src/app/globals.css` — replaced entry-grid + howto styles with `.hm-home-band`, `.hm-series-preview*`, `.hm-tool-strip*`
- `design.md` — home layout line updated to docs-first structure

**Not touched (Task 9):** DownloadExplorer, DownloadsPage, ProductsPage polish.

---

## Verification

```bash
cd ~/Github/huaming-hub && npm run build
ls out/index.html out/zh/index.html out/downloads/index.html
```

| Check | Result |
|-------|--------|
| Compile / types | ✓ |
| Static export | ✓ |
| `out/index.html` | ✓ present |
| `out/zh/index.html` | ✓ present |
| `out/downloads/index.html` | ✓ present |
| Nav order in export | Docs → Products → Selector |
| Howto block absent | ✓ (no `hm-howto` / How to use) |
| Docs count on home | 45 PDFs in band copy |
| Lint | Pre-existing `no-img-element` on SiteHeader only |

---

## Files changed

| Path | Action |
|------|--------|
| `src/lib/i18n.ts` | Home strings docs-first; drop howto/entry keys |
| `src/components/HomePage.tsx` | Full IA rewrite |
| `src/components/SiteHeader.tsx` | Nav Docs · Products · Selector |
| `src/app/globals.css` | Home band / series / tool-strip styles |
| `design.md` | Home layout one-liner |

---

## Git

| Step | Result |
|------|--------|
| `git commit -m "feat(hub): docs-first home IA without howto block"` | `a73f58c` |
| Push | Not requested |

Branch: `main` ahead of `origin/main` by 2 (Task 7 + Task 8).

---

## Concerns

- Series preview lists **all** `productSeries` (9 rows). Design wireframe said “6 series”; brief said map `productSeries` — kept full list for accuracy. Cap later if density feels high.
- Footer nav still Products · Docs · Selector (not reordered this task; Task 9 may touch footer).
- `t.nav.home` remains in i18n but unused in header (logo is home). Harmless.
- Untracked `docs/` left out of commit (by design).
- Not pushed; deploy waits on ship task if any.

None blocking; build green.
