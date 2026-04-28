/**
 * slide-content-text.mjs — Content: Single-column Text (純文字單欄)
 *
 * Same header structure as slide-content-split.mjs (Slide 7),
 * but uses full-width text area instead of left-image + right-text.
 *
 * Usage:
 *   addContentTextSlide(pptx, {
 *     sectionLabel: 'CDN 產業概況',
 *     subTitle: '全球 CDN 市場規模持續成長',
 *     bullets: ['2025 年市場規模達 USD 25B', '年複合成長率 12.3%'],
 *   })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addContentTextSlide(pptx, {
  sectionLabel = '',
  subTitle = '',
  bullets = [],
}) {
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
  // x=0.4784 y=1.0406 w=9.0  h=0.4715  Avenir 16pt bold (full width)
  s.addText(subTitle, {
    x: 0.4784, y: 1.0406, w: 9.0, h: 0.4715,
    fontFace: F.body, fontSize: 16, bold: true, color: C.textPrimary,
  });

  // ── Full-width bullets ──
  // x=0.4784 y=1.6041 w=9.1228 h=3.6191
  if (bullets.length > 0) {
    const bulletParas = bullets.map((b, i) => ({
      text: b,
      options: {
        fontFace: F.body,
        fontSize: 14,
        color: C.textPrimary,
        bullet: { code: '25CF', font: 'Avenir', fontSize: 14 },
        lineSpacingMultiple: 1.5,
        breakLine: i < bullets.length - 1,
      },
    }));
    s.addText(bulletParas, {
      x: 0.4784, y: 1.6041, w: 9.1228, h: 3.6191,
      valign: 'top',
    });
  }

  return s;
}
