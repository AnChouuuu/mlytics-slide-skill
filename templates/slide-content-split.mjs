/**
 * slide-content-split.mjs — Content: Left Image + Right Text (左圖右文)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 7
 *
 * Usage:
 *   addContentSplitSlide(pptx, {
 *     sectionLabel: 'CDN 產業概況',
 *     subTitle: '全球 CDN 市場規模持續成長',
 *     bullets: ['2025 年市場規模達 USD 25B', '年複合成長率 12.3%'],
 *     imagePlaceholder: true,  // default: show grey rect
 *   })
 */

import { C, F } from './base.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function addContentSplitSlide(pptx, {
  sectionLabel = '',
  subTitle = '',
  bullets = [],
  image = null,          // optional base64 data URL — replaces grey placeholder
  imagePlaceholder = true,
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

  // ── Horizontal separator (double-colour line: Forest Green + Sage) ──
  // x=0.1667 y=0.6364 w=9.6667 h=0.1784  — original PICTURE extracted from PPTX
  const sepPath = join(__dirname, '../assets/content_sep.png');
  const sepData = 'data:image/png;base64,' + readFileSync(sepPath).toString('base64');
  s.addImage({ data: sepData, x: 0.1667, y: 0.6364, w: 9.6667, h: 0.1784 });

  // ── Sub-title ──
  // x=0.4784 y=1.0406 w=5.5256 h=0.4715  Avenir 16pt bold
  s.addText(subTitle, {
    x: 0.4784, y: 1.0406, w: 5.5256, h: 0.4715,
    fontFace: F.body, fontSize: 16, bold: true, color: C.textPrimary,
  });

  // ── Left image area ──
  // Box: x=0.4784 y=1.6041 w=4.5855 h=3.5206
  if (image) {
    // Fit image at 16:9 (slide screenshots) into the box without distortion.
    // Fit by width, then vertically center within the box.
    const BOX_X = 0.4784, BOX_Y = 1.6041, BOX_W = 4.5855, BOX_H = 3.5206;
    const imgH = BOX_W / (16 / 9);            // ≈ 2.579"
    const imgY = BOX_Y + (BOX_H - imgH) / 2; // vertically centered
    s.addImage({ data: image, x: BOX_X, y: imgY, w: BOX_W, h: imgH });
  } else if (imagePlaceholder) {
    s.addShape(pptx.ShapeType.rect, {
      x: 0.4784, y: 1.6041, w: 4.5855, h: 3.5206,
      fill: { color: C.cardBg }, line: { color: C.divider, width: 1 },
    });
    s.addText('[ Image ]', {
      x: 0.4784, y: 1.6041, w: 4.5855, h: 3.5206,
      fontFace: F.body, fontSize: 14, color: C.textMuted, align: 'center', valign: 'middle',
    });
  }

  // ── Right bullets ──
  // x=5.5172 y=1.6041 w=3.6037 h=3.6191  Avenir 14pt, bullet ●
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
      x: 5.5172, y: 1.6041, w: 3.6037, h: 3.6191,
      valign: 'top',
    });
  }

  return s;
}
