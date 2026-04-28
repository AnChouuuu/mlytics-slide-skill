/**
 * slide-metrics.mjs — Metrics / KPI Cards (2×2)
 *
 * Same header structure as Content slides (section label + separator + sub-title).
 * Content area below y=1.6041 holds a 2×2 KPI card grid.
 *
 * Usage:
 *   addMetricsSlide(pptx, {
 *     sectionLabel: 'CDN 產業概況',
 *     subTitle: '關鍵數據一覽',
 *     cards: [
 *       { number: 'USD 25B', label: '全球 CDN 市場規模',  note: '2025 年',        accent: false },
 *       { number: '12.3%',  label: '年複合成長率 CAGR',  note: '2024–2029',      accent: true  },
 *       { number: '65%',    label: '企業採用率',          note: '受調查企業',      accent: false },
 *       { number: '3×',     label: '效能提升',            note: '相較傳統架構',    accent: false },
 *     ],
 *   })
 *
 * Rules:
 * - accent: true → orange top bar (#FF5723); false → dark teal (#354F52)
 * - Maximum 1 accent card per slide
 * - cards array: 1–4 items (extra items silently dropped)
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Card grid — content area starts at y=1.6041
const COL_X  = [0.4784, 5.28];
const ROW_Y  = [1.65, 3.5];
const CARD_W = 4.3;
const CARD_H = 1.75;
const BAR_H  = 0.07;

export function addMetricsSlide(pptx, { sectionLabel = '', subTitle = '', cards = [] }) {
  const s = pptx.addSlide();

  // ── White background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.white }, line: { color: C.white },
  });

  // ── Section label ──
  // x=0.1987 y=0.1707 w=4.4022 h=0.5049  Verdana 18pt #1A1A1A
  s.addText(sectionLabel, {
    x: 0.1987, y: 0.1707, w: 4.4022, h: 0.5049,
    fontFace: F.title, fontSize: 18, color: C.textPrimary,
  });

  // ── Horizontal separator (double-colour: Forest Green + Sage) ──
  const sepPath = join(__dirname, '../assets/content_sep.png');
  const sepData = 'data:image/png;base64,' + readFileSync(sepPath).toString('base64');
  s.addImage({ data: sepData, x: 0.1667, y: 0.6364, w: 9.6667, h: 0.1784 });

  // ── Sub-title ──
  // x=0.4784 y=1.0406 w=9.0 h=0.4715  Avenir 16pt bold
  s.addText(subTitle, {
    x: 0.4784, y: 1.0406, w: 9.0, h: 0.4715,
    fontFace: F.body, fontSize: 16, bold: true, color: C.textPrimary,
  });

  // ── KPI Cards (2×2) ──
  const maxCards = Math.min(cards.length, 4);
  for (let i = 0; i < maxCards; i++) {
    const col  = i % 2;
    const row  = Math.floor(i / 2);
    const cx   = COL_X[col];
    const cy   = ROW_Y[row];
    const card = cards[i];
    const barColor = card.accent ? C.accent : C.darkTeal;

    // Card white background with border
    s.addShape(pptx.ShapeType.rect, {
      x: cx, y: cy, w: CARD_W, h: CARD_H,
      fill: { color: C.white }, line: { color: C.divider, width: 1 },
    });

    // Colored top bar
    s.addShape(pptx.ShapeType.rect, {
      x: cx, y: cy, w: CARD_W, h: BAR_H,
      fill: { color: barColor }, line: { color: barColor },
    });

    // Big number — Verdana 48pt bold
    s.addText(card.number, {
      x: cx + 0.15, y: cy + BAR_H + 0.08, w: CARD_W - 0.3, h: 0.75,
      fontFace: F.title, fontSize: 48, bold: true,
      color: card.accent ? C.accent : C.textDark,
      valign: 'middle',
    });

    // Label — Avenir 11pt
    s.addText(card.label, {
      x: cx + 0.15, y: cy + BAR_H + 0.85, w: CARD_W - 0.3, h: 0.3,
      fontFace: F.body, fontSize: 11, color: C.textPrimary,
    });

    // Note — Avenir 10pt muted
    if (card.note) {
      s.addText(card.note, {
        x: cx + 0.15, y: cy + BAR_H + 1.2, w: CARD_W - 0.3, h: 0.25,
        fontFace: F.body, fontSize: 10, color: C.textMuted,
      });
    }
  }

  return s;
}
