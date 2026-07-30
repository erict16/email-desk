# Email Desk — design system

**Product:** Email Desk (personal dispatch board)  
**Audience:** Eric · overseas sales  
**Date:** 2026-07-30  
**Direction:** **GitHub Issues / Linear list shell** (proven task UI, not inventing candy colors)

---

## Subject

Mail-driven sales dispatch. Open → know **要我动** vs **等对方** vs order stage.  
Not a marketing site. Not a mail client.

---

## Visual plan (steal structure, not logo)

| Borrow | From |
|--------|------|
| Canvas `#f6f8fa` + white cards + `#d0d7de` borders | GitHub |
| Quiet sticky header, ghost actions | Linear |
| One-line footer, no logo dump | Docs sites |
| Red only for urgency | Both |

**Signature:** left-rail spine on cards (待办 / 等待 / 卡点) — functional, not decorative chrome.

**Rejected (tried, failed):** warm cream paper · teal hospital · pure zinc black-white monochrome · floating pill header · heavy dual-column footer with logo essay.

---

## Tokens

| Role | Token | Hex |
|------|-------|-----|
| Canvas | `--bg` | `#f6f8fa` |
| Card / header | `--surface` | `#ffffff` |
| Ink | `--ink` | `#1f2328` |
| Mute | `--mute` | `#656d76` |
| Faint | `--faint` | `#8c959f` |
| Line | `--line` | `#d0d7de` |
| Line strong | `--line-strong` | `#afb8c1` |
| Urgent | `--urgent` | `#cf222e` |
| Action wash | `--action-bg` | `#ddf4ff` |
| Action text | `--action-ink` | `#0550ae` |
| Wait wash | `--wait-bg` | `#f6f8fa` |
| Wait text | `--wait-ink` | `#656d76` |
| Pipe | `--pipe` | `#0969da` |
| Pipe soft | `--pipe-soft` | `#ddf4ff` |
| Mark tile | `--mark-bg` | `#1f2328` |
| Mark lines | `--mark-fg` | `#ffffff` |
| Mark dot | `--mark-dot` | `#cf222e` |
| Radius | `--radius` | `6px` |
| Measure | `--measure` | `42rem` |

---

## Chrome

**Header:** white sticky, hairline bottom; **lucide `Inbox`** + wordmark; ghost 分享/导出 (`Share2` / `Download`).

**Footer:** same canvas as page, single row of small links + © — **no** logo + blurb block.

**Mark:** only `lucide-react` icons — never hand-draw. Favicon: `node scripts/icons/build-mark.mjs`.

**Stage lane head:** title row + count; hint on **second line** (fixes glued「QS 报价报价·改价」).

---

## IA (unchanged)

要我动 · 等对方 · 订单管线 · 稍后 · 会  
`ball` / `wait` · searchable titles · no FYI on board  

---

## Non-goals

No mail API · no purple gradient SaaS · no 7-col Kanban primary  
