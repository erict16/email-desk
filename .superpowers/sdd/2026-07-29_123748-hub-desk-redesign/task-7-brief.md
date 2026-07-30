### Task 7: Hub design.md + fonts + tokens

**Files:**
- Modify: `~/Github/huaming-hub/design.md`
- Modify: `~/Github/huaming-hub/src/app/layout.tsx`
- Modify: `~/Github/huaming-hub/src/app/globals.css`

**Interfaces:**
- Fonts from `next/font/google`:

```ts
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
// --font-plex-sans, --font-plex-mono
// Remove Space_Grotesk, Inter, JetBrains_Mono
```

- Tokens (spec):

```css
--paper: #f3f5f8;
--paper-2: #ffffff;
--paper-3: #e8eef4;
--ink: #0c1f33;
--ink-2: #3d5166;
--ink-3: #6b7f92;
--rule: #d5dee8;
--accent: #0a4a82;
--accent-soft: #e6f0f8;
--btn-bg: #0a4a82;
--radius: 4px;
--font-display: var(--font-plex-sans), ...;
--font-body: var(--font-plex-sans), ...;
--font-mono: var(--font-plex-mono), ...;
```

Add signature: `body` or `.hm-root` top border `2px solid var(--accent)` OR header bottom cobalt hairline.

- [ ] **Step 1: Rewrite `design.md`** to match spec (audience, tokens, signature = mono model codes + cobalt top rule).

- [ ] **Step 2: Swap fonts in `layout.tsx`; map CSS variables.**

- [ ] **Step 3: Update `globals.css` tokens + radius 4px; ensure `.hm-btn-primary` forces white text.**

- [ ] **Step 4: Build**

```bash
cd ~/Github/huaming-hub && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add design.md src/app/layout.tsx src/app/globals.css
git commit -m "style(hub): IBM Plex cold-paper design system"
```

---
