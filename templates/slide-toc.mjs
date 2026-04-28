/**
 * slide-toc.mjs — Table of Contents (目錄)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 5
 *
 * Usage:
 *   addTocSlide(pptx, {
 *     sections: [
 *       { name: 'CDN 產業概況',   page: 'p03' },
 *       { name: '市場趨勢分析',   page: 'p04' },
 *     ],
 *     duration: '30 min',   // shown in right panel
 *   })
 *
 * Key observations from PPTX XML:
 * - Section names: bullet ● (U+25CF), Avenir 18pt bold, lineSpacing 150%
 * - Page numbers: Avenir 18pt bold italic #999999, lineSpacing 200%, no bullet
 * - Clock image extracted from original PPTX → assets/clock.png
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addTocSlide(pptx, { sections = [], duration = '30 min' }) {
  const s = pptx.addSlide();

  // ── Right dark teal panel ──
  s.addShape(pptx.ShapeType.rect, {
    x: 6.3389, y: 0, w: 3.6611, h: 5.625,
    fill: { color: C.darkTeal }, line: { color: C.darkTeal },
  });

  // ── Section names — ONE text box, bullet ●, lineSpacing 150% ──
  // x=0.3316 y=0.6821 w=4.5902 h=4.5912  Avenir 18pt bold
  // breakLine:true ends the paragraph without creating a trailing empty bullet paragraph
  const nameParas = sections.map((sec, i) => ({
    text: sec.name,
    options: {
      fontFace: F.body,
      fontSize: 18,
      bold: true,
      color: C.textPrimary,
      bullet: { code: '25CF', font: 'Avenir', fontSize: 18 },
      lineSpacingMultiple: 1.5,
      breakLine: i < sections.length - 1,
    },
  }));
  s.addText(nameParas, {
    x: 0.3316, y: 0.6821, w: 4.5902, h: 4.5912,
    valign: 'top',
  });

  // ── Page numbers — ONE text box, bold italic #999999, lineSpacing 150% ──
  // x=5.0358 y=0.6821 w=0.8793 h=4.5912
  // lineSpacing matches names box so rows align vertically
  const pageParas = sections.map((sec, i) => ({
    text: sec.page,
    options: {
      fontFace: F.body,
      fontSize: 18,
      bold: true,
      italic: true,
      color: '999999',
      lineSpacingMultiple: 1.5,
      breakLine: i < sections.length - 1,
    },
  }));
  s.addText(pageParas, {
    x: 5.0358, y: 0.6821, w: 0.8793, h: 4.5912,
    valign: 'top',
  });

  // ── Right panel: clock image (extracted from original PPTX) ──
  // x=7.4123 y=1.6509 w=1.5143 h=1.5143
  const clockPath = join(__dirname, '../assets/clock.png');
  const clockData = 'data:image/png;base64,' + readFileSync(clockPath).toString('base64');
  s.addImage({ data: clockData, x: 7.4123, y: 1.6509, w: 1.5143, h: 1.5143 });

  // ── Right panel: duration text ──
  // x=6.8283 y=3.0813 w=2.6824 h=0.606  Avenir 24pt bold #FFFFFF CENTER
  s.addText(duration, {
    x: 6.8283, y: 3.0813, w: 2.6824, h: 0.606,
    fontFace: F.body, fontSize: 24, bold: true, color: C.white, align: 'center',
  });

  return s;
}
