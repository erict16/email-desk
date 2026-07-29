# Email Desk — ball-in-court redesign (方案 A)

**Date:** 2026-07-30  
**Status:** approved by Eric (chat) — awaiting final review of this file before plan  
**Live:** https://erict16.github.io/email-desk/  
**Repo:** `~/Github/email-desk`  

---

## 1. Goal / non-goals

### Goal

1. Open Desk and in ~3 seconds separate **what Eric must do** from **what is waiting on someone else**.
2. Keep the order pipeline answering **where each order sits** (OS → tech → QS → PO → ERP → docs → ship).
3. `content/board.md` remains the only daily content source; **new fields are optional**; existing cards still render without edits.
4. Public static site: no amounts / confidential attachment bodies.

### Non-goals

- No Spark / enterprise mail API or live mailbox sync.
- No merge of todo + order into a single card model (that was approach B).
- No 7-column horizontal Kanban as primary view.
- No FYI column back on the main board (`priority: FYI` may stay in markdown as notes; still not rendered).
- No quote calc, type selection, or send-mail UI inside Desk.

---

## 2. Why this design (workflow grounding)

From Eric’s real Inbox + Sent (Huaming overseas sales) and the current `board.md`:

| Role | Examples | Desk treatment |
|------|----------|----------------|
| **Eric acts** | QS for Q30122; rework CI/PL for Sanaky BSHV; formal reply to Cameron on PO 155798 | **要我动** |
| **Waiting on others** | Factory delivery date for EVN UZF; Yoeli confirm before release; customer contract confirm | **等对方** |
| **Watch only** | Anthony/Kimmy-led Clough / HAVEC threads | Pipeline only; no P0/P1 todo |

Previous IA mixed “I must reply” and “ball is with factory/customer” under Today (P0/P1), so scan failed the real job.

**Chosen approach: A — Today split by ball-in-court**, not a full card-model rewrite.

---

## 3. Information architecture

```
┌─ sticky header ──────────────────────────────┐
│ logo · Email Desk · updated · share · MD     │
├─ focus strip ────────────────────────────────┤
│ meetings (if any)                            │
│ [要我动 n] [等待 n] [管线 n] [稍后 n]          │
├─ ① 要我动  #mine ────────────────────────────┤
│ P0 (red bar) then P1 · action spine “待办 ·” │
├─ ② 等对方  #wait ────────────────────────────┤
│ no red bar · spine “等待 ·”                  │
├─ ③ 订单管线 #pipeline ───────────────────────┤
│ vertical stage lanes (unchanged stage set)   │
├─ ④ 稍后    #later ───────────────────────────┤
│ P2 that are not waiting                      │
├─ collapsible workflow legend ────────────────┤
└──────────────────────────────────────────────┘
```

### Partition rules (hard)

| Zone | Rule |
|------|------|
| **要我动 (mine)** | Triage item (`priority` ∈ {P0, P1}) **and not** waiting |
| **等对方 (wait)** | Triage item with `priority` ∈ {P0, P1, P2} **and** waiting |
| **订单管线** | Items with `stage:` (same as today; `isOrderItem`) |
| **稍后 (later)** | `priority: P2` **and not** waiting |

### Waiting detection (priority order)

1. Explicit `ball: them` / `球: 对方` → waiting  
2. Explicit `ball: me` / `球: 我` → mine (even if `wait:` is set)  
3. Non-empty `wait:` / `等待:` → waiting  
4. Neither field → default: P0/P1 → **mine**, P2 → **later**

**P0 on waiting cards:** allowed for authoring notes, but **no urgent red bar**. Red bar only on **mine ∩ P0**.

### Focus strip chips

| Chip | Anchor | Count |
|------|--------|-------|
| 要我动 | `#mine` | mine zone size |
| 等待 | `#wait` | wait zone size |
| 管线 | `#pipeline` | order count |
| 稍后 | `#later` | later zone size |

**Removed:** standalone 「紧急」chip. P0 urgency is the red bar on mine cards only.

Meetings stay at the top of the focus strip (frontmatter `meetings:`), unchanged in spirit.

---

## 4. `board.md` fields

### Existing (unchanged)

`priority`, `meta`, `action` / `next`, `date`, `tags`, `people`, `stage`, `customer`, frontmatter `updated` / `tz` / `meetings`.

### New optional

| Field | Aliases | Values |
|-------|---------|--------|
| `ball` | `球` | `me` / `them` (中文 `我` / `对方` accepted) |
| `wait` | `等待` | short free text: who/what is blocking |

### Authoring conventions

| Situation | Write |
|-----------|--------|
| Eric must QS / reply / resend docs | `ball: me` + `action:` next step |
| Waiting on customer / factory / internal | `ball: them` + `wait:` one short phrase |
| Watch-only deal (others lead) | **orders only**; no P0/P1 todo |
| Same deal needs both act + stage | same searchable **title** on todo + order → cross-link |

### Examples

```markdown
### BSHV-HUAMING/2605/02
- priority: P0
- ball: me
- action: 按标红改完 CI/PL/Form E 后正式重发 Trung

### QS2606173R2 EVN UZF
- priority: P1
- ball: them
- wait: 工厂新提货日
- action: 有交期再回 Hoa

### EEMC PO26-025
- stage: erp
- ball: them
- wait: 合同客户确认
- action: 盯合同确认
```

`meta` may stay narrative; UI shows **at most two lines** (truncate).

---

## 5. Visual system

Keep warm-paper dispatch tokens from `design.md`. Add wait spine only:

| Token | Hex | Use |
|-------|-----|-----|
| `--wait-bg` | `#ebe8e2` | Waiting card spine background |
| `--wait-ink` | `#5a5248` | Waiting spine text |
| existing `--action-bg` / `--action-ink` | | Mine spine `待办 · {action}` |
| existing `--urgent` | | Left bar on **mine + P0 only** |
| existing `--pipe` | | Pipeline stages / 卡点 |

### Card layouts

**Mine (action card)**

- Copyable title · date  
- Spine: `待办 · {action}`  
- Tags · 发件人 · meta (2-line clamp)  
- If linked order: `管线 · {stage}`  

**Wait (action card, wait tone)**

- Same structure  
- Spine: `等待 · {wait if set else action}`  
- No red bar  

**Order card**

- Existing structure + optional quiet line `等待 · {wait}` when `ball: them` or `wait` set  
- Cross-link 「今日有待办」 when title matches a triage card in mine **or** wait  

---

## 6. Data flow / components

| Layer | Change |
|-------|--------|
| `parse-board.ts` | Parse `ball`/`球`, `wait`/`等待` → `ball?: 'me' \| 'them'`, `wait?: string` |
| `board-view.ts` | Expose `mine`, `waiting`, `later`, `orders`; stats `{ mine, waiting, later, orders }`; keep `linkedKeys` (triage = mine∪waiting∪later) |
| `Board.tsx` | Four sections with anchors `#mine` `#wait` `#pipeline` `#later` |
| `ActionCard` | Prop/tone for wait vs act; conditional red bar |
| `OrderCard` | Optional wait line |
| `FocusStrip` / stats | Four chips as above |
| `design.md` + `README.md` | Tokens + writing rules |
| `scripts/check-board-view.mjs` | Cases: default me; wait-only → them; explicit ball |

### Compatibility

Unmodified current `board.md`: all P0+P1 land in **要我动**, all P2 in **稍后**. No silent drop. Eric adds `ball`/`wait` over daily updates.

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Authors forget `ball`; waits stay under mine | Default **me** is safer (over-remind); README + agent update habit |
| P2 + wait | Goes to **等对方**, not 稍后 (ball over priority digit) |
| Order cards noisy with ball | Only show wait line when `them` or non-empty `wait` |
| Dual cards still dual-write | Accepted; title cross-link remains the link |

---

## 8. Success criteria

- [ ] Card with `ball: them` or only `wait:` appears under **等对方**, not **要我动**
- [ ] Legacy P0/P1 without new fields still under **要我动**
- [ ] Red bar only on **要我动 ∩ P0**
- [ ] Title copy, todo↔order cross-link, seven-stage pipeline still work
- [ ] Single-column mobile scan; no new runtime deps
- [ ] `npm run build` passes with current `board.md` unchanged

---

## 9. Implementation outline (not a plan)

1. Types + parser for `ball` / `wait`  
2. `buildDeskView` split + tests in check script  
3. Board sections + ActionCard wait tone + focus strip  
4. OrderCard optional wait line  
5. design.md / README authoring  
6. Optional: light pass on live `board.md` to tag obvious waits (EVN UZF, contract confirms, etc.) — content chore, can be same or follow-up PR  

---

## 10. Approval record

- **Approach:** A (Today split by ball-in-court) — Eric confirmed  
- **Design sections:** Eric confirmed 「可以」2026-07-30  
- **Focus strip:** drop standalone 紧急 chip — included as designed  
