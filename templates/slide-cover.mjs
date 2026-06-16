/**
 * slide-cover.mjs — Cover slide (封面)
 *
 * Source: "Mlytics slide quick guide and sample.pptx" Slide 4
 * Measured with python-pptx — do NOT change coordinates without re-measuring.
 *
 * Dynamic layout rules:
 *   1. Title box hugs content — height is calculated from actual line count
 *   2. Left vertical bar matches title box height exactly
 *   3. Reporter/Date auto-shifts below the title box (+ fixed gap)
 *
 * Usage:
 *   addCoverSlide(pptx, LOGO, {
 *     topicLabel: '產業分析報告',      // small text above main title (Verdana 20pt)
 *     mainTitle:  'Q2 CDN 產業報告',  // big bold title (Verdana 40pt bold), supports \n
 *     reporter:   'Mlytics Team',
 *     date:       '2026 Q2',
 *   })
 */

import { C, F, measureLineCount } from './base.mjs';

// ── Dynamic layout helpers ─────────────────────────────────────────────────

const PT_TO_IN = 1 / 72;

/**
 * Calculate title block height and derived Y positions.
 * Uses opentype.js accurate measurement (falls back to char-unit estimation).
 * Returns { titleBoxH, reporterY }
 */
function calcLayout(topicLabel, mainTitle, titleY, titleW) {
  const TOPIC_PT     = 20;
  const TITLE_PT     = 40;
  const LINE_SPACING = 1.25; // Verdana default leading factor
  const PARA_GAP     = 0.06; // gap between the two paragraphs (inches)
  const REPORTER_GAP = 0.22; // gap between title box bottom and reporter row

  const topicLines = measureLineCount(topicLabel, F.title, false, TOPIC_PT, titleW);
  const titleLines = measureLineCount(mainTitle,  F.title, true,  TITLE_PT, titleW);

  const topicH    = topicLines * TOPIC_PT * LINE_SPACING * PT_TO_IN;
  const titleH    = titleLines * TITLE_PT * LINE_SPACING * PT_TO_IN;
  const titleBoxH = topicH + PARA_GAP + titleH;

  return {
    titleBoxH,
    reporterY: titleY + titleBoxH + REPORTER_GAP,
  };
}

// ── Main export ────────────────────────────────────────────────────────────

export function addCoverSlide(pptx, LOGO, { topicLabel, mainTitle, reporter, date }) {
  const s = pptx.addSlide();

  // ── White background ──
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.white }, line: { color: C.white },
  });

  // ── Right color blocks ──
  //   Forest Green: large block at top of right section
  //   Dark Teal (left) + Sage (right): thin strip at bottom
  s.addShape(pptx.ShapeType.rect, {
    x: 6.6185, y: 0.8178, w: 3.0876, h: 3.3186,
    fill: { color: C.coverForest }, line: { color: C.coverForest },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 6.6185, y: 4.1364, w: 2.2316, h: 1.1066,
    fill: { color: C.coverDarkTeal }, line: { color: C.coverDarkTeal },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 8.8501, y: 4.1364, w: 0.856, h: 1.1066,
    fill: { color: C.coverSage }, line: { color: C.coverSage },
  });

  // ── Logo ──
  s.addImage({ data: LOGO, x: 0.4203, y: 0.3656, w: 1.6585, h: 0.3184 });

  // ── Dynamic layout calculation ──
  const TITLE_X = 0.5427;
  const TITLE_Y = 1.7349;
  // Right color block starts at x=6.6185; keep text right edge ≤ 6.35" (0.27" gap)
  const TITLE_W = 5.8;
  const BAR_X   = 0.4203;
  const BAR_W   = 0.0994;

  const { titleBoxH, reporterY } = calcLayout(topicLabel, mainTitle, TITLE_Y, TITLE_W);

  // ── Left vertical accent bar — height matches title box ──
  s.addShape(pptx.ShapeType.rect, {
    x: BAR_X, y: TITLE_Y, w: BAR_W, h: titleBoxH,
    fill: { color: C.darkTeal }, line: { color: C.darkTeal },
  });

  // ── Title text box — hug to content ──
  s.addText(
    [
      {
        text: topicLabel + '\n',
        options: { fontFace: F.title, fontSize: 20, bold: false, color: C.textPrimary },
      },
      {
        text: mainTitle,
        options: { fontFace: F.title, fontSize: 40, bold: true, color: C.textPrimary },
      },
    ],
    { x: TITLE_X, y: TITLE_Y, w: TITLE_W, h: titleBoxH, wrap: true, valign: 'top' }
  );

  // ── Reporter / date — auto-positioned below title ──
  s.addText(`Reporter: ${reporter}  |  ${date}`, {
    x: 0.5503, y: reporterY, w: 5.5, h: 0.4209,
    fontFace: F.title, fontSize: 13,
  });

  return s;
}
