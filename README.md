# Email Desk

Eric 的邮件跟进看板（公开 GitHub Pages）。

**线上：** https://erict16.github.io/email-desk/  
**仓库：** `C:\Users\TYM\repo\email-desk` · `erict16/email-desk`

---

## 日常怎么更新（只改 Markdown）

只编辑：

```text
content/board.md
```

然后：

```bash
git add content/board.md
git commit -m "chore: desk YYYY-MM-DD"
git push origin main
```

Actions 自动 `next build` → 部署 `out/`。  
**禁止**手改/覆盖根目录 `index.html` 或 `out/` 当日常内容源。

---

## Eric 的内容与文案规则（必读）

### 1. 标题 = 短且可搜（邮箱关键词）

- 从邮件 Subject **截取一段独特关键词**（PO / QS / 项目号 / 短主题），**不要整段超长 Subject**
- 复制标题 → 企业邮搜索能命中即可
- 背景、客户名写在 `meta:`
- 例（对）：`BSHV-HUAMING/2605/02` · `QS2607196R1 HAVEC` · `PO 155798` · `QS2606173R2 EVN UZF`
- 例（错）：整段 `HAVEC_Inquiry OLTC CV for 15MVA-35kV…`（太长）
- 例（也错）：完全自创、邮箱里搜不到的词


### 2. Tag（谁 + 干什么，禁止空标签）

Tag 必须是**人话短句**，一眼知道卡在哪，**禁止**孤零零的状态词。

| ✅ 好 | ❌ 差 |
|------|------|
| 待你发 Invoice/PL/CQ/TR/Form E | 待发单证 |
| 待客户确认外形/3D 图 | 待客户 |
| 待工厂给新提货日 | 等工厂 |
| 待沈工回 QJ6-25 型号 | 等型号 / 等工程 |
| 待放行审批图给 Hoa | 待放图 |
| 需尽快 | ~~今日死线~~（难听，禁用） |

一条卡 1–2 个 tag 即可；颜色按语义自动上色（见 `Card.tsx`）。

### 3. 发件人

- 字段 `people:` 展示为 **`发件人：`**（不要写「相关：」）
- 写名字/公司，如 `Trung (Sanaky)`、`李倩`

### 4. 待办 / 等待条

- **要我动**：UI **`待办 ·`**（浅黄底）= 你下一步，短句
- **等对方**：UI **`等待 ·`**（灰底）= 优先显示 `wait:`，否则 `action:`
- 不要写成长篇 meta（meta 最多两行截断）

### 5. 分区与四块统计（球权调度台）

页面是 **dispatch board**。核心不是「优先级数字」，而是 **球在谁手里**：

| 层 | 问题 | 数据从哪来 |
|----|------|------------|
| **要我动** | 现在你必须回 / 催 / 发？ | `priority: P0\|P1` **且非**等待 |
| **等对方** | 球在客户 / 工厂 / 同事？ | `ball: them` 或有 `wait:`（含 P2 等待） |
| **订单管线** | 单卡在 OS→…→提货 哪一格？ | 有 `stage:` 的订单卡 |
| **稍后** | 可盯可不盯 | `priority: P2` **且非**等待 |
| **会**（焦点条顶） | 今天/本周要参加的会 | frontmatter `meetings:` |

| 统计芯片（可点跳转） | 计数来源 | 锚点 |
|----------------------|----------|------|
| 要我动 | mine 区 | `#mine` |
| 等待 | wait 区 | `#wait` |
| 管线 | 有 `stage:` 的订单卡 | `#pipeline` |
| 稍后 | later 区 | `#later` |

列表顺序：**要我动 → 等对方 → 订单管线（按 stage 竖向）→ 稍后**。

**球权字段（可选，旧卡不写也能渲染）：**

| 字段 | 别名 | 写法 |
|------|------|------|
| `ball` | `球` | `me` / `them`（中文 `我` / `对方`） |
| `wait` | `等待` | 短句：卡在谁 / 等什么 |

判定顺序：`ball: them` → 等对方；`ball: me` → 要我动（覆盖 `wait:`）；仅有 `wait:` → 等对方；都没有 → P0/P1 进要我动、P2 进稍后。

| 场景 | 怎么写 |
|------|--------|
| 你要出 QS / 改单证 / 正式回客户 | `ball: me` + `action:` |
| 等工厂交期 / 客户确认 / 同事出图 | `ball: them` + `wait:` 一句 |
| Anthony/Kimmy 主谈、你只旁听 | **只写 orders**，不要 P0/P1 todo |

**知会已下线**（减信息过载）。`priority: FYI` 仍可写备忘，页面不展示。

**标题互链：** 同标题的 todo 与订单卡互标（「管线 · {阶段}」/「有待办」）。匹配：`trim` + 折叠空白 + 小写。**不合并卡片**。标题必须是邮箱能搜到的同一关键词。

### 5b. 订单管线

按真实邮件流程排阶段（OS 常在技术沟通前）。**没有常规 SC 阶段**——只有个别客户要 Sales Confirmation，写在 `meta`/`tags` 即可。竖向 stage lanes（非 7 列 Kanban）。

```text
OS → 技术 → QS → 等PO → ERP投产 → 单证 → 完工提货
os   tech   qs   po     erp      docs   ship
```

| `stage:` | 含义 |
|----------|------|
| `os` | OS 订货规格（等客户填/改） |
| `tech` / `技术沟通` | 图纸、参数、非标 |
| `qs` / `报价` | QS 报价 / 改价 |
| `po` / `等PO` | 等客户正式 PO |
| `erp` / `投产` | ERP 已下投产、生产中（含合同已签待投产） |
| `docs` / `CI/PL/CO` / `单证` | 发票、装箱单、产地证 |
| `ship` / `提货` / `完工提货` | 生产完工、客户提货/发运 |

旧写法 `sc` / `销售确认` 会解析为 `erp`。

```markdown
## orders | 订单跟踪

### EEMC PO26-025
- stage: erp
- customer: EEMC / Linh
- date: 7/23
- meta: 已投产，预估提货 8/12
- tags: 合同待签
- people: Linh / Hoa
- action: 盯合同确认          # UI：「卡点 ·」
```

规则：

- 一个项目一张订单卡（标题可搜邮箱；与 todo 同标题则自动互链）
- `action` / `next` = 当前卡点（靛蓝底）
- `customer:` 可选
- 今天你必须动手的邮件 → 另写 todo（P0/P1/P2）；订单卡只答「项目在哪」
- `meta` 写一两句就够，别写成长篇邮件摘要

### 6. 会议（替代「本周优先」）

frontmatter 用 `meetings:`，UI 标题 **需参加的会议**：

```yaml
meetings:
  - 周四 7/23 10:30 Teams — HMSG Trading Process（…）
```

### 7. 更新时间

```yaml
updated: "2026-07-22 10:10"   # 务必加引号；可带时分
tz: Asia/Shanghai             # 现在北京；出差新加坡改为 Asia/Singapore
```

页眉显示类似：`Eric Tan · Inbox + Sent · 更新 7月22日 10:10`（短，不甩 GMT）。

### 8. 收信规则（写 board 前）

- **Inbox + 已发送** 对照；Sent 已回的要关掉或降到 done
- CQ / Test Report = Eric；CO = 沈丽玲
- 公开站勿贴未脱敏金额/完整机密附件内容

### 9. 其他 UI 锁

- 宽度约 `52rem`（`--measure`）；暖纸调度台（非 Hub 冷灰目录）
- Sticky 头：全宽表面 + 几何 DeskMark + Email Desk；青绿色 PDF 按钮
- Focus strip：四枚独立 chip（顶部分色条）+ 会议卡
- P0 红条 **仅**在「要我动」区；等对方不打红条；`action`/`wait` 是卡的主句
- 页底：双列工具/法律 footer + 可折叠工作流图例
- Logo / 图标（**lucide-react**，禁止手绘）：
  - Header：`Inbox`；按钮 `Share2` / `Download`
  - Favicon / PWA：`node scripts/icons/build-mark.mjs`（路径抄 lucide Inbox）
  - 改图后 bump `ASSET_V`（`src/lib/brand.ts`）

---

## board.md 模板

```markdown
---
title: 邮件跟进清单
subtitle: Eric Tan · Inbox + Sent
updated: "2026-07-22 10:10"
tz: Asia/Shanghai
meetings:
  - 会议一句（时间·主题·谁）
---

## todo | 你要处理

### BSHV-HUAMING/2605/02
- priority: P0
- ball: me
- date: 7/22
- meta: 背景一句
- tags: 需尽快, 按标红再改
- people: Trung (Sanaky)
- action: 改完 CI/PL 正式重发

### QS2606173R2 EVN UZF
- priority: P1
- ball: them
- wait: 工厂新提货日
- date: 7/18
- meta: Hoa 嫌交期晚
- tags: 交期谈判中
- people: Hoa Nguyen
- action: 有交期再回 Hoa

## orders | 订单跟踪

### EEMC PO26-025
- stage: erp
- customer: EEMC / Linh
- date: 7/23
- ball: them
- wait: 合同客户确认
- meta: 已投产；预估提货 8/12
- tags: 合同待签
- people: Linh
- action: 盯合同确认

```

`## id | 标题` 的 id 可写 `todo` / `orders`（解析保留）。  
**展示分区**：要我动 / 等对方 / 订单管线 / 稍后（见 §5 球权规则）。  
同标题 todo ↔ 订单自动互链。  
`FYI` / `## fyi` 不渲染。旧 `priority: OK` 无 stage 时落入订单「未标阶段」。

---

## 本地开发

```bash
npm install
npm run dev
# http://localhost:3000
```

生产构建：

```bash
npm run build   # → out/ + basePath /email-desk
```

## 技术

- Next.js App Router · `output: "export"` · `basePath: /email-desk`
- Tailwind CSS v4
- `gray-matter` 解析 `content/board.md`
- GitHub Actions → Pages

## 相关 skill

- Hermes：`qq-email`（收发）· `huaming-email-style`（语气）
- UI/文案细则也会写在 `qq-email/references/email-desk-ui.md` 与 greenfield 的 markdown-board 参考里
