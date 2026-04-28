/**
 * slide-punchline.mjs — Punchline (強調單句)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 8
 *
 * Usage:
 *   addPunchlineSlide(pptx, { text: 'CDN 不只是加速，更是競爭力的基礎' })
 *
 * Layout logic:
 *   - Single line: text box hugs content width; quotes hug the text box
 *   - Multi line:  text box expands to MAX_TEXT_W; quotes at full width
 */

import { C, F, measureTextWidth, measureLineCount } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FONT_PT  = 26;
const LINE_H   = FONT_PT * 1.25 / 72;  // ≈ 0.451" per line
// pptxgenjs text box inset per side ≈ 0.1"; add 0.05" safety → 0.25" total
const BOX_INSET = 0.25;

export function addPunchlineSlide(pptx, { text }) {
  const s = pptx.addSlide();

  const SLIDE_W  = 10;
  const SLIDE_H  = 5.625;
  const QUOTE_W  = 0.256;
  const QUOTE_H  = 0.2432;
  const GAP_X    = 0.18;   // gap: quote ↔ text box
  const GAP_Y    = 0.06;   // gap: quote bottom → text top
  const MARGIN   = 0.7;    // slide edge → quote outer edge (min)

  // Maximum usable text width
  const MAX_TEXT_W = SLIDE_W - 2 * (MARGIN + QUOTE_W + GAP_X);  // ≈ 7.57"

  // Accurate line count using opentype.js (falls back to estimation if unavailable)
  const lines = measureLineCount(text, F.body, true, FONT_PT, MAX_TEXT_W);

  // Single-line: hug content width (measured width + inset padding)
  // Multi-line:  use full MAX_TEXT_W
  let TEXT_W;
  if (lines === 1) {
    const measuredW = measureTextWidth(text, F.body, true, FONT_PT);
    if (measuredW !== null) {
      TEXT_W = Math.min(measuredW + BOX_INSET, MAX_TEXT_W);
    } else {
      // Fallback char-unit estimation
      const CJK_EM = 0.95, LATIN_W = 0.55;
      let u = 0;
      for (const ch of text) u += ch.charCodeAt(0) > 127 ? 1.0 : LATIN_W;
      TEXT_W = Math.min(u * FONT_PT * CJK_EM / 72 + 0.6, MAX_TEXT_W);
    }
  } else {
    TEXT_W = MAX_TEXT_W;
  }

  const TEXT_X    = (SLIDE_W - TEXT_W) / 2;       // center on slide
  const TEXT_H    = lines * LINE_H + 0.08;
  const QUOTE_L_X = TEXT_X - GAP_X - QUOTE_W;     // hug left edge of text box
  const QUOTE_R_X = TEXT_X + TEXT_W + GAP_X;      // hug right edge of text box

  // Center block (quotes + text) vertically on slide
  const BLOCK_H = QUOTE_H + GAP_Y + TEXT_H;
  const BLOCK_Y = (SLIDE_H - BLOCK_H) / 2;
  const QUOTE_Y = BLOCK_Y;
  const TEXT_Y  = QUOTE_Y + QUOTE_H + GAP_Y;

  // ── White background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.white }, line: { color: C.white },
  });

  // ── Left quotation mark ──
  const quoteL = 'data:image/png;base64,' + readFileSync(join(__dirname, '../assets/punchline_quote_left.png')).toString('base64');
  s.addImage({ data: quoteL, x: QUOTE_L_X, y: QUOTE_Y, w: QUOTE_W, h: QUOTE_H });

  // ── Right quotation mark ──
  const quoteR = 'data:image/png;base64,' + readFileSync(join(__dirname, '../assets/punchline_quote_right.png')).toString('base64');
  s.addImage({ data: quoteR, x: QUOTE_R_X, y: QUOTE_Y, w: QUOTE_W, h: QUOTE_H });

  // ── Punchline text — top-aligned, wraps within quote bounds ──
  s.addText(text, {
    x: TEXT_X, y: TEXT_Y, w: TEXT_W, h: TEXT_H,
    fontFace: F.body, fontSize: FONT_PT, bold: true,
    color: C.accent, align: 'center', valign: 'top',
    wrap: true,
  });

  return s;
}
