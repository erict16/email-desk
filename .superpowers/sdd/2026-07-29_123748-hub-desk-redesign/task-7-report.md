# Task 7 Report: Hub design.md + fonts + tokens

**Status:** DONE  
**Date:** 2026-07-29  
**Repo:** `~/Github/huaming-hub`  
**Commit:** `cfea272` — `style(hub): IBM Plex cold-paper design system`

---

## Summary

Locked the Hub **cold-paper** visual system: IBM Plex Sans/Mono, exact token hexes, 4px radius, white primary CTAs, signature mono model codes + 2px cobalt top rule.

### Changes

1. **`design.md`** — Full rewrite for cold paper catalogue:
   - Tokens table with locked hexes
   - Type: IBM Plex Sans (display + body) · IBM Plex Mono (codes/kickers)
   - Radius 4px; accent ≤ 5%
   - **Signature:** mono model codes + cobalt top rule

2. **`src/app/layout.tsx`** — Fonts from `next/font/google`:
   - `IBM_Plex_Sans` → `--font-plex-sans` (400/500/600/700)
   - `IBM_Plex_Mono` → `--font-plex-mono` (400/500)
   - Removed Space_Grotesk, Inter, JetBrains_Mono

3. **`src/app/globals.css`**
   - Tokens: `--paper #f3f5f8`, `--paper-2 #ffffff`, `--paper-3 #e8eef4`, `--ink #0c1f33`, `--ink-2 #3d5166`, `--ink-3 #6b7f92`, `--rule #d5dee8`, `--accent #0a4a82`, `--accent-soft #e6f0f8`, `--btn-bg #0a4a82`, `--radius 4px`
   - Font vars: `--font-display` / `--font-body` → plex-sans; `--font-mono` → plex-mono
   - `.hm-root { border-top: 2px solid var(--accent); }`
   - `.hm-btn-primary` keeps `color: #ffffff !important`
   - `.hm-product-code` uses mono (signature scannable type numbers)

---

## Build

```text
npm run build  →  OK (Next.js 15.5.22 static export)
Routes: / · /downloads · /products · /zh · /zh/downloads · /zh/products · _not-found
```

Lint: existing `@next/next/no-img-element` warning in `SiteHeader.tsx` only (pre-existing).

---

## Git

| Step | Result |
|------|--------|
| `git commit -m "style(hub): IBM Plex cold-paper design system"` | `cfea272` |
| Push | Not requested for this task (branch ahead of origin by 1) |

---

## Files

| Path | Action |
|------|--------|
| `design.md` | Rewritten — cold paper + Plex + signature |
| `src/app/layout.tsx` | Font swap to IBM Plex Sans/Mono |
| `src/app/globals.css` | Tokens, radius, top rule, mono product codes |

---

## Concerns

- Not pushed; deploy waits on later ship task if any.
- `--radius-sm` set to `2px` (was `4px` when radius was `6px`) so hierarchy stays; not specified in brief hex list.
- Home/entry IA still pre-redesign structure (how-to strip etc.); this task is tokens/fonts only.
- Untracked `docs/` left out of commit (by design).
- None blocking; build green.
