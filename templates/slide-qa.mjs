/**
 * slide-qa.mjs — Q&A Slide (問答)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 10
 *
 * Usage:
 *   addQaSlide(pptx, { caption: 'Q & A' })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addQaSlide(pptx, { caption = 'Q & A' } = {}) {
  const s = pptx.addSlide();

  // ── Full-bleed dark teal background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.darkTeal }, line: { color: C.darkTeal },
  });

  // ── Mlytics ME circle icon (extracted from original PPTX) ──
  // x=3.7367 y=1.2285 w=2.5265 h=2.5265
  const iconData = 'data:image/png;base64,' + readFileSync(join(__dirname, '../assets/qa_icon.png')).toString('base64');
  s.addImage({ data: iconData, x: 3.7367, y: 1.2285, w: 2.5265, h: 2.5265 });

  // ── Caption text ──
  // x=1.7077 y=3.1491 w=6.5846 h=0.707  Ubuntu 30pt bold #FFFFFF CENTER
  s.addText(caption, {
    x: 1.7077, y: 3.1491, w: 6.5846, h: 0.707,
    fontFace: F.qa, fontSize: 30, bold: true,
    color: C.white, align: 'center',
  });

  return s;
}
