---
name: mlytics-slide
description: 製作符合 Mlytics 品牌規範的簡報。當使用者要求建立簡報、製作投影片、或建立 PowerPoint 時使用。使用方式：/mlytics-slide <主題或大綱>。例如：/mlytics-slide Q2業績報告，5頁，包含3個KPI指標
---

# Creating Mlytics Slide Decks

## 如何使用

使用者傳入的內容：`$ARGUMENTS`

- 若有提供主題或大綱，依照內容規劃投影片
- 若未提供任何內容，詢問使用者：「請提供簡報主題、大綱或頁數需求」
- 預設結構：Cover → TOC → Section Dividers → Content slides → Q&A

---

## 版型決策樹

每張投影片套用之前，先問：**「這張投影片的用途是什麼？」**

```
這張投影片的用途是什麼？
├─ 整份簡報的第一張          → Cover          (slide-cover.mjs)
├─ 列出所有章節 / 議程        → TOC            (slide-toc.mjs)       ← 固定第二張
├─ 開始新章節                → Section Divider (slide-section.mjs)
├─ 呈現 KPI / 數字指標        → Metrics         (slide-metrics.mjs)
├─ 強調單一句話               → Punchline       (slide-punchline.mjs)
├─ 中場休息                  → Break           (slide-break.mjs)
├─ 結尾問答                  → Q&A             (slide-qa.mjs)
└─ 其他（說明、圖表、條列）
    ├─ 有圖片搭配說明文字      → Content Split   (slide-content-split.mjs)  ← 左圖右文
    └─ 純文字 / 條列          → Content Text    (slide-content-text.mjs)   ← 全寬單欄
```

---

## 版型使用方式（template import）

所有版型函式放在 `~/.claude/skills/mlytics-slide-brand/templates/`。
**每次產生簡報，請用以下方式引入並呼叫：**

```javascript
import { createPptx, loadLogos } from '~/.claude/skills/mlytics-slide-brand/templates/base.mjs';
import { addCoverSlide }         from '~/.claude/skills/mlytics-slide-brand/templates/slide-cover.mjs';
import { addTocSlide }           from '~/.claude/skills/mlytics-slide-brand/templates/slide-toc.mjs';
import { addSectionSlide }       from '~/.claude/skills/mlytics-slide-brand/templates/slide-section.mjs';
import { addContentSplitSlide }  from '~/.claude/skills/mlytics-slide-brand/templates/slide-content-split.mjs';
import { addContentTextSlide }   from '~/.claude/skills/mlytics-slide-brand/templates/slide-content-text.mjs';
import { addPunchlineSlide }     from '~/.claude/skills/mlytics-slide-brand/templates/slide-punchline.mjs';
import { addBreakSlide }         from '~/.claude/skills/mlytics-slide-brand/templates/slide-break.mjs';
import { addQaSlide }            from '~/.claude/skills/mlytics-slide-brand/templates/slide-qa.mjs';
import { addMetricsSlide }       from '~/.claude/skills/mlytics-slide-brand/templates/slide-metrics.mjs';

const pptx = createPptx();
const { LOGO } = loadLogos();   // 僅 Cover 需要

// 範例：完整一份簡報
addCoverSlide(pptx, LOGO, { topicLabel: '產業分析報告', mainTitle: 'Q2 CDN 報告', reporter: 'Mlytics Team', date: '2026 Q2' });
addTocSlide(pptx, { sections: [{ name: 'CDN 市場概況', page: 'p03' }], duration: '30 min' });
addSectionSlide(pptx, { title: 'CDN 市場概況' });
addContentTextSlide(pptx, { sectionLabel: 'CDN 市場概況', subTitle: '市場規模與趨勢', bullets: ['重點一', '重點二'] });
addMetricsSlide(pptx, { sectionLabel: 'CDN 產業概況', subTitle: '關鍵數據一覽', cards: [{ number: 'USD 25B', label: '市場規模', note: '2025', accent: false }] });
addQaSlide(pptx);

// ⚠️ 永遠存到桌面，檔名使用報告主題（英文、無空格）
// 例：~/Desktop/Q2_CDN_Report.pptx、~/Desktop/AIGC_NOWnews_Weekly.pptx
const DESKTOP = `${process.env.HOME}/Desktop`;
await pptx.writeFile({ fileName: `${DESKTOP}/<topic_slug>.pptx` });
```

### 各函式簽名一覽

| 函式 | 必填參數 | 說明 |
|------|---------|------|
| `addCoverSlide(pptx, LOGO, opts)` | `topicLabel`, `mainTitle`, `reporter`, `date` | **唯一**需要 LOGO 的版型；`mainTitle` 支援 `\n` 換行；標題框高度動態計算，垂直線條與 Reporter 自動跟隨 |
| `addTocSlide(pptx, opts)` | `sections: [{name, page}]` | `duration` 選填，預設 `'30 min'` |
| `addSectionSlide(pptx, opts)` | `title` | 全版深色背景 |
| `addContentSplitSlide(pptx, opts)` | `sectionLabel`, `subTitle`, `bullets` | 左圖（灰色 placeholder）+ 右文 |
| `addContentTextSlide(pptx, opts)` | `sectionLabel`, `subTitle`, `bullets` | 全寬條列 |
| `addPunchlineSlide(pptx, opts)` | `text` | 只放一句話 |
| `addBreakSlide(pptx, opts)` | `message` 選填 | 預設「10 min break」 |
| `addQaSlide(pptx, opts)` | `caption` 選填 | 預設「Q & A」 |
| `addMetricsSlide(pptx, opts)` | `sectionLabel`, `subTitle`, `cards: [{number, label, note?, accent?}]` | 最多 4 張卡片（2×2）；`accent:true` 用橘色，每張最多 1 個 |

---

## 輸出規則（強制）

每次產生簡報**必須**遵守以下規則，不可使用 `/tmp` 或其他路徑：

- **存檔位置**：一律存到使用者桌面 `~/Desktop/`
- **檔案命名**：以報告主題命名，英文、底線分隔、無空格
  - 範例：`Q2_CDN_Report.pptx`、`AIGC_NOWnews_Weekly.pptx`、`Annual_Review_2026.pptx`
- **程式寫法**：
  ```javascript
  const DESKTOP = `${process.env.HOME}/Desktop`;
  await pptx.writeFile({ fileName: `${DESKTOP}/Your_Report_Name.pptx` });
  ```
- 完成後告知使用者：「✅ 已儲存至桌面：`檔案名稱.pptx`」

---

## Hard constraints

這六條規則不可違反，違反任何一條必須重做。

1. 標題一律使用 **Verdana Bold**
2. 內文一律使用 **Avenir**
3. 每張投影片最多 **3 種顏色**（白色與黑/灰色階不計）
4. 每張投影片最多 **3 種字級**；標題永遠最大
5. 強調色 `#FF5723` 每張最多出現 **1–2 次**，只用於最重要的元素
6. Punchline 只放 **一句** 簡短文字

---

## Logo 放置規則

> ⚠️ **Logo 只放在 Cover（封面）**，其他版型一律不加 Logo。

| 版型 | Logo |
|------|------|
| Cover | ✅ 深色版 logo（`LOGO`），位置已內建於 `slide-cover.mjs` |
| 其他所有版型 | ❌ 不加 |

---

## Quick color tokens

| 用途 | Hex |
|------|-----|
| Dark Teal（section 背景、cover 色塊） | `#354F52` |
| Forest Green（主要色塊） | `#4A7C59` |
| Sage Green（分隔線、輔助） | `#7A9E6E` |
| CTA / Accent | `#FF5723` |
| 內文主色 | `#1A1A1A` |
| 次要文字 | `#757575` |
| 分隔線 | `#DFDFDF` |
| 頁面背景 | `#FFFFFF` |

**60-30-10 規則**：同一張投影片使用三種綠色時，Dark Teal 約佔 60%、Forest Green 約 30%、Sage Green 約 10%。

---

## Quick font sizes

| 層級 | 字型 | 大小 | 字重 |
|------|------|------|------|
| Cover title | Verdana | 40pt | Bold |
| Section divider title | Verdana | 28pt | Bold |
| Content section label | Verdana | 18pt | Regular |
| Content sub-title | Avenir | 16pt | Bold |
| TOC items | Avenir | 18pt | Bold |
| Body bullets | Avenir | 14pt | Regular |
| Metrics number | Verdana | 48pt | Bold |
| Metrics label | Avenir | 11pt | Regular |
| Q&A caption | Ubuntu | 30pt | Bold |

---

## Slide creation workflow

建立時依序完成以下檢查：

1. 規劃結構（Cover → TOC → Section Dividers → Content → Q&A）
2. 對每張投影片套用決策樹，選出正確版型
3. 呼叫對應的 `addXxxSlide()` 函式
4. 逐張檢查（見下方）
5. 全套一致性檢查（見下方）

**逐張檢查**（每張完成後）：
- 標題是 Verdana Bold？
- 內文是 Avenir？
- 顏色 ≤ 3 種？
- `#FF5723` 出現 ≤ 2 次？
- 字級 ≤ 3 種，且標題最大？
- 若是 Punchline：只有一句話？

**全套檢查**（最後一次）：
- Section Divider 全部使用 Dark Teal `#354F52` 背景？
- 一般內容投影片全部使用白色 `#FFFFFF` 背景？
- Logo **只出現在 Cover**？
- 整套視覺風格一致？

---

## Common mistakes

| 錯誤 | 正確 |
|------|------|
| 每張投影片都加 Logo | Logo **只放 Cover** |
| 標題用 Arial 或 Calibri | Verdana Bold |
| `#FF5723` 用在每個條列項 | 每張最多 1–2 次 |
| Punchline 放 3 句話 | 只放一句 |
| 內文比標題大 | 標題永遠最大 |
| 一般內容投影片用深色背景 | 深色背景只用於 Section Divider、Q&A |
| 一張投影片用 5 種顏色 | 最多 3 種 |
| 三種綠色均等使用 | 60-30-10 比例 |
| 自行計算座標 | 直接呼叫 templates/ 函式，座標已內建 |
