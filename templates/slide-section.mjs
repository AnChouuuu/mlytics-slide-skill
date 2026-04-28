/**
 * slide-section.mjs — Section Divider (章節分隔)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 6
 *
 * Usage:
 *   addSectionSlide(pptx, { title: 'CDN 產業分析' })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addSectionSlide(pptx, { title }) {
  const s = pptx.addSlide();

  // ── Full-bleed dark background ──
  // x=0 y=0 w=10 h=5.625  fill=#354F52
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.darkTeal }, line: { color: C.darkTeal },
  });

  // ── Title — Verdana 28pt bold, white, centered ──
  // x=0.7906 y=2.2065 w=8.419 h=0.6732
  s.addText(title, {
    x: 0.7906, y: 2.2065, w: 8.419, h: 0.6732,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: 'center',
  });

  // ── Double underline (Forest Green top + Sage bottom) ──
  // Original is a PICTURE extracted from PPTX → assets/section_line.png
  // x=1.8606 y=2.9519 w=6.2789 h=0.2416
  const linePath = join(__dirname, '../assets/section_line.png');
  const lineData = 'data:image/png;base64,' + readFileSync(linePath).toString('base64');
  s.addImage({ data: lineData, x: 1.8606, y: 2.9519, w: 6.2789, h: 0.2416 });

  return s;
}
