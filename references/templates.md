# Mlytics Slide Templates

> ⚠️ 顏色以實際 PPTX 範例為準：Dark Teal = `#354F52`（品牌手冊寫 `#1E3A34` 但有偏差）

## Contents
- Template A: Cover
- Template B: Section Divider
- Template C: Table of Contents
- Template D: Content
- Template E: Metrics

---

## Template A — Cover slide

**When**: First slide of every deck.

```
Layout: left text + vertical accent bar + right color blocks (full-bleed)
┌─────────────────────────────────────────────────────────────┐
│ [M≡ mlytics logo — top left, w=2.01" h=0.35"]              │
│                                    ┌──────────────────────┐ │
│ [Product / Topic label 14pt gray]  │  Forest Green        │ │
│ │ [MAIN TITLE Verdana Bold ~40pt]  │  #4A7C59  (top 53%)  │ │
│ │                                  ├───────────┬──────────┤ │
│ │ [Reporter: Name  |  Date]        │ Dark Teal │   Sage   │ │
│                                    │  #354F52  │ #7A9E6E  │ │
│                                    └───────────┴──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**精確規格（從 PPTX 測量）：**
- Background: `#FFFFFF`
- Logo: dark version, `x=0.35" y=0.18" w=2.01" h=0.35"`
- **左側垂直色條**：`x=0.42" y=1.73" w=0.1" h=1.09"` 顏色 `#354F52`（緊貼標題左側）
- Topic label: Verdana 13pt, `#757575`, `x=0.55" y=2.96"`
- Main title: Verdana Bold 40pt, `#1A1A1A`, `x=0.55" y=1.73"`
- Reporter: Verdana 13pt, `#757575`, below title
- Right color blocks start at `x≈6.4"`, full slide height `h=5.625"`
  - Forest Green `#4A7C59`: `y=0 h=2.8"` (top ~50%)
  - Dark Teal `#354F52`: `x=6.4" y=2.8" w=2.5" h=2.8"` (bottom-left ~72%)
  - Sage Green `#7A9E6E`: `x=8.9" y=2.8" w=1.1" h=2.8"` (bottom-right ~28%)

---

## Template B — Section Divider

**When**: Starting every new section. Use Dark Teal background.

```
Layout: centered text on dark full-bleed background
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [Section Title]                           │
│              ─────────────────────────                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**精確規格：**
- Background: `#354F52` full-bleed (w=10" h=5.625")
- Title: Verdana Bold 28pt, `#FFFFFF`, horizontally + vertically centered
- Divider line below title: `#7A9E6E` (Sage Green), thin, ~50% slide width, centered
- **No logo on section divider slides**

---

## Template C — Table of Contents

**When**: Second slide of the deck, after the cover.

```
Layout: left bullet list (NO title header) + right dark panel
┌────────────────────────────────────┬──────────────────────┐
│  ● Section name 1             p03  │                      │
│                                    │   [Icon / graphic]   │
│  ● Section name 2           p04-23 │                      │
│                                    │   30 min             │
│  ● Section name 3           p24-27 │   (or session time)  │
│                                    │                      │
│  ● Section name 4           p28-32 │                      │
│                                    │                      │
│  ● Section name 5             p33  │                      │
└────────────────────────────────────┴──────────────────────┘
```

**精確規格：**
- **沒有標題行**：條列項目直接從 y≈0.68" 開始，不加「目錄」或「Agenda」標頭
- Left panel background: `#FFFFFF`, width ~63% (x=0 w=6.3")
- Right panel background: `#354F52` (Dark Teal), width ~37% (x=6.3" w=3.7")
- Section names: Avenir Bold 18pt, `#1A1A1A`
- Page numbers: Avenir Bold, `#757575`, right-aligned on same row
- Right panel: white icon/image graphic centered + session duration (e.g. "30 min") in white Avenir Bold 24pt

---

## Template D — Content slide

**When**: All standard content: bullets, explanations, images, charts.

```
Layout: small section label → full-width divider → sub-title → body
┌─────────────────────────────────────────────────────────────┐
│ [Section Category — small Verdana, top-left]                │
├─────────────────────────────────────────────────────────────┤  ← thin line
│                                                             │
│ [Slide Sub-title — Avenir Bold 16pt]                        │
│                             │                               │
│  [Image / Screenshot]       │  • Key point 1               │
│  (left ~50%)                │  • Key point 2               │
│                             │  • Key point 3               │
│                             │                               │
└─────────────────────────────────────────────────────────────┘
```

**精確規格：**
- Background: `#FFFFFF`
- **Section label** (頂部小字分類標籤): Verdana ~18pt, `#1A1A1A`, `x=0.20" y=0.17"`
- **Full-width separator line**: `x=0.17" y=0.64" w=9.67" h=0.04"`, 顏色繼承 theme（深灰）
- **Slide sub-title**: Avenir Bold 16pt, `x=0.48" y=1.04"`
- Left body (image/screenshot placeholder): `x=0.48" y=1.60" w=5.53"`
- Right body (bullets): Avenir 14pt, `#2E2E2E`, `x=5.52"`
- Accent highlights: Forest Green `#4A7C59` for bullet markers

**Single-column variant**: remove right panel, full-width body below sub-title

---

## Template E — Metrics slide

**When**: Showing KPIs, statistics, numbers that need emphasis.

```
Layout: title + full-width sage divider + card grid
┌─────────────────────────────────────────────────────────────┐
│ [Slide Title — Verdana Bold]                                │
├─────────────────────────────────────────────────────────────┤  ← sage line
│                  │                  │                       │
│   [Big Number]   │   [Big Number]   │    [Big Number]       │
│   metric label   │   metric label   │    metric label       │
│   sub note       │   sub note       │    sub note           │
│                  │                  │                       │
└──────────────────┴──────────────────┴───────────────────────┘
```

**精確規格：**
- Card background: `#F5F5F5`
- Top accent bar on each card: `#354F52` (standard) or `#FF5723` (critical KPI only)
- Number: Verdana Bold 46–60pt — `#354F52` (standard) or `#FF5723` (single most critical)
- Label: Avenir 14pt, `#1A1A1A`, centered
- Sub note: Avenir 12pt, `#757575`, centered
- Use `#FF5723` for **at most one** card number per slide

---

## Template F — Section Divider (同 B，僅提醒)

見 Template B。常見錯誤：Section Divider 之後要緊接對應的 Content slides，不可跳過。

---

## Template G — Punchline slide

**When**: 強調單一重點句，通常放在章節中段或高潮處。

```
Layout: centered accent text with decorative quote marks
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   □                                                     □  │
│       [Single punchline sentence — Avenir Bold 26pt]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**精確規格：**
- Background: `#FFFFFF`
- 裝飾方塊：左右各一個小正方形，顏色 `#354F52`，約 `0.26"×0.24"`
  - 左：`x≈1.17" y≈2.75"`；右：`x≈1.77" y≈2.75"`（兩個緊鄰，非兩端）
- 主文：Avenir Bold 26pt，`#FF5723`，水平 + 垂直置中
- **只放一句話**，不超過一行

---

## Template H — Break slide

**When**: 中場休息。

**精確規格：**
- Background: `#FFFFFF`
- 圓形圖片：置中，`x=3.36" y=1.03" w=3.28" h=3.28"`（pptxgenjs 用 ellipse clip）
- 說明文字：Verdana Bold 18pt，`#354F52`，圖片正下方置中 (`y≈4.03"`)

---

## Template I — Q&A slide

**When**: 結尾問答。

**精確規格：**
- Background: `#354F52` **全版滿版** (x=0 y=0 w=10" h=5.625"，不可留白邊)
- 圖示方塊（置中）：`x=3.74" y=1.23" w=2.53" h=2.53"`
- 文字：Verdana Bold 30pt，`#FFFFFF`，圖示下方置中 (`y≈3.15"`)
- **No logo** on Q&A slides（同 Section Divider）
