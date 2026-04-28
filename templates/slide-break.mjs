/**
 * slide-break.mjs — Break Slide (中場休息)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 9
 *
 * Usage:
 *   addBreakSlide(pptx, { message: '10 分鐘休息時間' })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addBreakSlide(pptx, { message = '10 min break' }) {
  const s = pptx.addSlide();

  // ── White background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.white }, line: { color: C.white },
  });

  // ── Three-dot decoration (Sage / Forest Green / Dark Teal circles) ──
  // Original is a GIF extracted from PPTX → assets/break_dots.gif
  // x=3.3608 y=1.0326 w=3.2782 h=3.2782
  const dotsData = 'data:image/gif;base64,' + readFileSync(join(__dirname, '../assets/break_dots.gif')).toString('base64');
  s.addImage({ data: dotsData, x: 3.3608, y: 1.0326, w: 3.2782, h: 3.2782 });

  // ── Message text ──
  // x=2.3536 y=4.0344 w=5.2927 h=0.5049  Verdana 18pt bold #354F52 CENTER
  s.addText(message, {
    x: 2.3536, y: 4.0344, w: 5.2927, h: 0.5049,
    fontFace: F.title, fontSize: 18, bold: true,
    color: C.darkTeal, align: 'center',
  });

  return s;
}
