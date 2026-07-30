# Email Desk — design system

**Date:** 2026-07-30 · frontend-design pass  
**Subject:** Eric’s mail dispatch for Huaming overseas OLTC export  
**Audience:** Eric (phone + desktop); shareable status for colleagues  
**Job:** In ~3s: what I must do · what’s waiting · where each order sits  

---

## Identity

**Status slip** — export-desk vernacular (CI/PL/Form E world), not SaaS dashboard, not Hub clone, not GitHub Issues skin.

| Axis | Choice | Why |
|------|--------|-----|
| Canvas | Cold stone `#e9ebef` | Not cream AI-default, not Hub `#f5f7fa` twin |
| Structure | Forest `#1e4d3a` | Port/export, not cobalt Hub / teal hospital / GH blue |
| Urgency | Stamp red `#c0392b` | Only loud color — 要我动 / P0 |
| Surface | White slip + 1px line | Document stack |
| Mark | lucide `Inbox` | Dependency, never hand-draw |

**Signature (one bold thing):** left **stamp rail** on cards + filled spine「待办 / 等待 / 卡点」— the card answers “next step” first.

**Rejected (tried):** warm cream+gold · teal instrument · zinc mono · GH blue · Hub cobalt twin · floating pill · heavy footer · hand-drawn mark.

---

## Tokens

| Role | Token | Hex |
|------|-------|-----|
| Page | `--bg` | `#e9ebef` |
| Slip | `--surface` | `#ffffff` |
| Soft | `--paper-2` | `#e0e3e9` |
| Ink | `--ink` | `#12141a` |
| Mute | `--mute` | `#5a6170` |
| Faint | `--faint` | `#8b919c` |
| Line | `--line` | `#d2d6de` |
| Forest | `--pipe` / `--action-ink` | `#1e4d3a` |
| Forest soft | `--action-bg` / `--pipe-soft` | `#e6f0eb` |
| Stamp | `--urgent` | `#c0392b` |
| Stamp soft | `--urgent-soft` | `#fdecea` |
| Wait bg | `--wait-bg` | `#eef0f3` |
| Wait ink | `--wait-ink` | `#5a6170` |
| Radius | `--radius` | `8px` |
| Measure | `--measure` | `38rem` |

---

## Spacing (locked)

| Token | px | Use |
|-------|-----|-----|
| `--gap-stack` | 8 | Related lines in card |
| `--gap-block` | 12 | Title → spine |
| `--gap-card` | 12 | Between cards |
| `--gap-lane` | 32 | Between stages (+ top rule) |
| `--gap-section` | 40 | 要我动 / 等对方 / 管线 |
| `--pad-card-x/y` | 16 / 14 | Card padding |
| Focus → content | 32 | After counter strip |

---

## Type

System UI stack (CJK). Mono only for counts / dates.

| Role | Size | Weight |
|------|------|--------|
| Page title | 22px | 600 |
| Section | 14px | 600 |
| Stage | 13px | 600 |
| Card title | 15px | 600 |
| Spine | 13px | 500 |
| Meta | 12–13px | 400 |
| Counter | 20px | 600 |

---

## Layout

```
sticky header (Inbox · Email Desk | 分享 导出)
page title + meta
meetings (if any)
status strip: 4 counts in one row
── 要我动 ──
  stamp-rail cards
── 等对方 ──
── 订单管线 ──
  stage chips
  stage · hint ………… n
  order cards
── 稍后 ──
collapsed workflow
one-line footer
```

---

## IA (unchanged)

要我动 · 等对方 · 管线 · 稍后 · 会 · ball/wait · searchable titles · no FYI  
