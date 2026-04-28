/**
 * slide-punchline.mjs — Punchline (強調單句)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 8
 *
 * Usage:
 *   addPunchlineSlide(pptx, { text: 'CDN 不只是加速，更是競爭力的基礎' })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addPunchlineSlide(pptx, { text }) {
  const s = pptx.addSlide();

  // ── White background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.white }, line: { color: C.white },
  });

  // ── Left quotation mark (Sage/Forest Green, extracted from original PPTX) ──
  // x=0.8461 y=2.1765 w=0.256 h=0.2432
  const quoteL = 'data:image/png;base64,' + readFileSync(join(__dirname, '../assets/punchline_quote_left.png')).toString('base64');
  s.addImage({ data: quoteL, x: 0.8461, y: 2.1765, w: 0.256, h: 0.2432 });

  // ── Right quotation mark ──
  // x=8.8981 y=2.1765 w=0.256 h=0.2432
  const quoteR = 'data:image/png;base64,' + readFileSync(join(__dirname, '../assets/punchline_quote_right.png')).toString('base64');
  s.addImage({ data: quoteR, x: 8.8981, y: 2.1765, w: 0.256, h: 0.2432 });

  // ── Punchline text ──
  // x=0.4851 y=2.3909 w=9.0302 h=0.6398  Avenir 26pt bold #FF5723 CENTER
  s.addText(text, {
    x: 0.4851, y: 2.3909, w: 9.0302, h: 0.6398,
    fontFace: F.body, fontSize: 26, bold: true,
    color: C.accent, align: 'center', valign: 'middle',
  });

  return s;
}
