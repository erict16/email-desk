### Task 1: Desk design.md + CSS tokens

**Files:**
- Create: `~/Github/email-desk/design.md`
- Modify: `~/Github/email-desk/src/app/globals.css`

**Interfaces:**
- Produces: CSS variables used by all Desk components:

```css
--bg: #f7f6f3;
--surface: #ffffff;
--ink: #1a1a1a;
--mute: #5c5c5c;
--faint: #8a8a8a;
--line: #e6e4df;
--urgent: #c43c2c;
--action-bg: #f3ead2;
--action-ink: #5c4a1f;
--pipe: #1f4d7a;
--pipe-soft: #e8eef4;
--follow: #b86e00;
--radius: 6px;
--measure: 42rem;
```

Keep aliases so old classnames don’t hard-crash mid-migration:

```css
--paper: var(--bg);
--card: var(--surface);
--muted: var(--mute);
--orders: var(--pipe);
--orders-soft: var(--pipe-soft);
```

- [ ] **Step 1: Write `design.md`** with audience (Eric), tokens table, signature (“action bar spine”), non-goals (no mail API, no Kanban primary).

- [ ] **Step 2: Replace `:root` token block in `globals.css`** with the warm dispatch system. Remove hallmark comment header. Keep spacing vars (`--gap-card`, etc.) if still used. Drop heavy dual-shadow if any; prefer 1px border only.

- [ ] **Step 3: Smoke-check tokens**

```bash
cd ~/Github/email-desk && npm run build
```

Expected: build succeeds (visual may look half-migrated until later tasks).

- [ ] **Step 4: Commit**

```bash
cd ~/Github/email-desk
git add design.md src/app/globals.css
git commit -m "style(desk): lock warm dispatch tokens and design.md"
```

---
