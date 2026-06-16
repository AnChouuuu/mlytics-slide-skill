/**
 * base.mjs — Mlytics Slide Brand: shared constants & helpers
 * Source: python-pptx measurements from "Mlytics slide quick guide and sample.pptx"
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import PptxGenJS from 'pptxgenjs';

const require = createRequire(import.meta.url);

const __dir = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = join(__dir, '..');

// ── Colors (from actual PPTX measurements) ──────────────────────
export const C = {
  // Cover right-block — exact child values from PPTX group
  coverDarkTeal:  '354F52',   // Child[0] right column
  coverSage:      'A3B18A',   // Child[1] narrow top-left strip
  coverForest:    '588157',   // Child[2] large bottom block

  // Brand palette
  darkTeal:       '354F52',
  forestGreen:    '4A7C59',
  sageGreen:      '7A9E6E',
  accent:         'FF5723',

  // Text
  textPrimary:    '1A1A1A',
  textDark:       '1E3A34',
  textSecond:     '757575',
  textMuted:      '999999',
  textGray:       '666666',

  // Surfaces
  white:          'FFFFFF',
  divider:        'DFDFDF',
  cardBg:         'F5F5F5',
};

// ── Fonts ────────────────────────────────────────────────────────
export const F = {
  title: 'Verdana',
  body:  'Avenir',
  qa:    'Ubuntu',    // Q&A slide uses Ubuntu per original template
};

// ── Logo helpers ─────────────────────────────────────────────────

const LOGO_DARK_TXT  = '/tmp/mlytics_logo_dark.txt';
const LOGO_WHITE_TXT = '/tmp/mlytics_logo_white.txt';

/**
 * loadLogos() — convert SVG → PNG base64 (runs once per session)
 * Returns { LOGO, LOGO_WHITE }
 */
export function loadLogos() {
  if (!existsSync(LOGO_DARK_TXT) || !existsSync(LOGO_WHITE_TXT)) {
    const svgPath = join(SKILL_DIR, 'assets', 'logo.svg');
    execSync(`
      DYLD_LIBRARY_PATH=/opt/homebrew/lib python3 -c "
import cairosvg, base64, re
cairosvg.svg2png(url='${svgPath}', write_to='/tmp/mlytics_logo.png', scale=8)
b64 = 'image/png;base64,' + base64.b64encode(open('/tmp/mlytics_logo.png','rb').read()).decode()
svg = open('${svgPath}').read()
open('/tmp/mlytics_logo_white.svg','w').write(re.sub(r'fill=.*?#[0-9A-Fa-f]{6}.*?\"','fill=\\\"#FFFFFF\\\"', svg))
cairosvg.svg2png(url='/tmp/mlytics_logo_white.svg', write_to='/tmp/mlytics_logo_white.png', scale=8)
b64w = 'image/png;base64,' + base64.b64encode(open('/tmp/mlytics_logo_white.png','rb').read()).decode()
open('${LOGO_DARK_TXT}','w').write(b64)
open('${LOGO_WHITE_TXT}','w').write(b64w)
"
    `, { stdio: 'inherit' });
  }
  return {
    LOGO:       readFileSync(LOGO_DARK_TXT,  'utf8'),
    LOGO_WHITE: readFileSync(LOGO_WHITE_TXT, 'utf8'),
  };
}

// ── PptxGenJS factory ────────────────────────────────────────────
export function createPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9'; // 10" × 5.625"
  return pptx;
}

// ── Font measurement (opentype.js) ───────────────────────────────
// Text box inset: pptxgenjs adds ~0.1" per side horizontally
const TEXT_BOX_INSET = 0.1; // inches, per side

const FONT_CACHE_DIR = join(SKILL_DIR, 'font-cache');

// Avenir variants to extract from the system .ttc (macOS only)
// index → output filename
const AVENIR_EXTRACT = {
  4:  'AvenirHeavy.ttf',   // bold — used when fontFace:'Avenir', bold:true
  11: 'AvenirRoman.ttf',   // regular — used when fontFace:'Avenir', bold:false
};

/**
 * Ensure Avenir .ttf files exist in font-cache/.
 * Extracts from /System/Library/Fonts/Avenir.ttc via Python fonttools.
 * No-ops silently if fonttools is unavailable or not on macOS.
 */
function _ensureAvenirCache() {
  const needed = Object.entries(AVENIR_EXTRACT).filter(
    ([, name]) => !existsSync(join(FONT_CACHE_DIR, name))
  );
  if (needed.length === 0) return;
  const ttcPath = '/System/Library/Fonts/Avenir.ttc';
  if (!existsSync(ttcPath)) return;
  try {
    execSync(`mkdir -p "${FONT_CACHE_DIR}"`, { stdio: 'ignore' });
    const script = needed.map(([idx, name]) =>
      `ttc.fonts[${idx}].save('${join(FONT_CACHE_DIR, name)}')`
    ).join('\n');
    execSync(
      `python3 -c "from fontTools.ttLib import TTCollection; ttc = TTCollection('${ttcPath}'); ${script}"`,
      { stdio: 'ignore' }
    );
  } catch { /* fonttools unavailable — fall back to char estimation */ }
}

// Extract on module load (fast no-op if files already exist)
_ensureAvenirCache();

// Font file map: [fontFace, bold] → absolute path
const FONT_PATHS = {
  'Verdana:bold':   '/System/Library/Fonts/Supplemental/Verdana Bold.ttf',
  'Verdana:normal': '/System/Library/Fonts/Supplemental/Verdana.ttf',
  'Avenir:bold':    join(FONT_CACHE_DIR, 'AvenirHeavy.ttf'),
  'Avenir:normal':  join(FONT_CACHE_DIR, 'AvenirRoman.ttf'),
};

const _fontCache = {};

function _loadFont(fontFace, bold) {
  const key = `${fontFace}:${bold ? 'bold' : 'normal'}`;
  if (_fontCache[key]) return _fontCache[key];
  const path = FONT_PATHS[key];
  if (!path || !existsSync(path)) return null;
  try {
    const ot = require(join(SKILL_DIR, 'node_modules', 'opentype.js'));
    _fontCache[key] = ot.loadSync(path);
    return _fontCache[key];
  } catch {
    return null;
  }
}

/**
 * measureTextWidth(text, fontFace, bold, pt) → width in inches (raw glyph advance)
 * Returns null if the font cannot be loaded (caller should fall back).
 */
export function measureTextWidth(text, fontFace, bold, pt) {
  const font = _loadFont(fontFace, bold);
  if (!font) return null;
  return font.getAdvanceWidth(text, pt) / 72;
}

/**
 * measureLineCount(text, fontFace, bold, pt, boxW) → number of lines
 *
 * boxW: total text box width in inches (including insets).
 * Handles explicit \n line breaks.
 * Falls back to char-unit estimation if font unavailable.
 */
export function measureLineCount(text, fontFace, bold, pt, boxW) {
  const effectiveW = boxW - 2 * TEXT_BOX_INSET;
  const font = _loadFont(fontFace, bold);

  let totalLines = 0;

  for (const seg of text.split('\n')) {
    if (font) {
      // Accurate: measure each word, greedy line-break
      const words = seg.split(/(?<=\s)|(?=[\u4E00-\u9FFF\u3000-\u303F])/);
      let lineW = 0;
      let lineCount = 1;
      for (const w of words) {
        const ww = font.getAdvanceWidth(w, pt) / 72;
        if (lineW + ww > effectiveW && lineW > 0) {
          lineCount++;
          lineW = ww;
        } else {
          lineW += ww;
        }
      }
      totalLines += lineCount;
    } else {
      // Fallback: char-unit estimation
      const CJK_EM = 0.95, LATIN_W = 0.55;
      const upl = (effectiveW * 72) / (pt * CJK_EM);
      let u = 0;
      for (const ch of seg) u += ch.charCodeAt(0) > 127 ? 1.0 : LATIN_W;
      totalLines += Math.max(1, Math.ceil(u / upl));
    }
  }

  return Math.max(1, totalLines);
}
