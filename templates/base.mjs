/**
 * base.mjs — Mlytics Slide Brand: shared constants & helpers
 * Source: python-pptx measurements from "Mlytics slide quick guide and sample.pptx"
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PptxGenJS from 'pptxgenjs';

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
