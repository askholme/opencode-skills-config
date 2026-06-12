// Render a Float landscape-A4 HTML document to PDF via Playwright/Chromium.
//
// Usage:
//   node render-pdf.mjs <input.html> [output.pdf] [--no-grain | --grain-png <tile.png>]
//
// Defaults:
//   output      -> <input basename>.pdf next to the input
//   grain       -> baked PNG tile (assets/grain-tile.png next to this script's
//                  ../assets) swapped in for the live SVG filter. The live
//                  feTurbulence filter is correct but expensive to repaint,
//                  which makes the resulting PDF sluggish to scroll/zoom. The
//                  baked tile looks identical and is cheap.
//
// Flags:
//   --no-grain            disable grain entirely (lightest PDF)
//   --grain-png <path>    use a specific baked PNG tile
//
// Requires Playwright. First-time setup (run once, inside this folder):
//   cd scripts && npm run setup
// which runs:  npm install && npx playwright install chromium

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve, isAbsolute, basename, extname } from 'path';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve Playwright. If it isn't installed yet, fail with an actionable hint
// instead of a raw ERR_MODULE_NOT_FOUND. The dependency lives next to this
// script (scripts/node_modules) so the skill is self-contained.
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    '\n[float-pdf] Playwright is not installed.\n' +
    'Run the one-time setup from the skill\'s scripts/ folder:\n\n' +
    '    cd ' + __dirname + '\n' +
    '    npm run setup        # npm install && npx playwright install chromium\n'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (!args.length || args[0].startsWith('--')) {
  console.error('Usage: node render-pdf.mjs <input.html> [output.pdf] [--no-grain | --grain-png <tile.png>]');
  process.exit(1);
}

const abs = (p) => (isAbsolute(p) ? p : resolve(process.cwd(), p));

const inputHtml = abs(args[0]);
let outputPdf = null;
let noGrain = false;
let grainPng = join(__dirname, '..', 'assets', 'grain-tile.png');

for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (a === '--no-grain') noGrain = true;
  else if (a === '--grain-png') grainPng = abs(args[++i]);
  else if (!a.startsWith('--')) outputPdf = abs(a);
}

if (!outputPdf) {
  outputPdf = join(dirname(inputHtml), basename(inputHtml, extname(inputHtml)) + '.pdf');
}

// Build the grain-override CSS injected after load.
let grainCss = '';
if (noGrain) {
  grainCss = `.page::after { display: none !important; }`;
} else if (existsSync(grainPng)) {
  const dataUri = 'data:image/png;base64,' + readFileSync(grainPng).toString('base64');
  grainCss = `
    .page::after {
      background-image: url("${dataUri}") !important;
      mix-blend-mode: normal !important;
      opacity: 0.045 !important;
    }`;
} else {
  console.warn('Grain tile not found at', grainPng, '— keeping live SVG grain (PDF may be heavier).');
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(inputHtml).href, { waitUntil: 'networkidle' });
if (grainCss) await page.addStyleTag({ content: grainCss });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

await page.pdf({
  path: outputPdf,
  width: '297mm',
  height: '210mm',
  printBackground: true,
});

await browser.close();
console.log('Wrote', outputPdf);
