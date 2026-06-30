// Bake the live SVG fractalNoise grain into a flat 200x200 PNG tile.
//
// You normally DON'T need this — a pre-baked tile already ships at
// ../assets/grain-tile.png. Re-run only if you change the noise parameters
// (baseFrequency / numOctaves) and want the baked tile to match.
//
// Usage:
//   node bake-grain.mjs [output.png]   (default: ../assets/grain-tile.png)
//
// The parameters here MUST match the live filter in assets/page.css:
//   feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'
//
// Requires Playwright. First-time setup (run once, inside this folder):
//   cd scripts && npm run setup

import { fileURLToPath } from 'url';
import { dirname, join, resolve, isAbsolute } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const out = process.argv[2]
  ? (isAbsolute(process.argv[2]) ? process.argv[2] : resolve(process.cwd(), process.argv[2]))
  : join(__dirname, '..', 'assets', 'grain-tile.png');

const html = `<!doctype html><html><head><style>
  html,body{margin:0;padding:0}
  #t{width:200px;height:200px;
     background-image:url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
     background-size:200px 200px;background-repeat:no-repeat;}
</style></head><body><div id="t"></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
const el = await page.$('#t');
const buf = await el.screenshot({ type: 'png' });
writeFileSync(out, buf);
await browser.close();
console.log('Wrote', out, `(${buf.length} bytes)`);
