// Screenshot each Float deck slide to a PNG for quick visual review.
//
// Usage:
//   node screenshot.mjs path/to/deck.html [outDir]
//
// Requires Playwright. One-time setup, run inside this assets/ folder:
//   npm run setup        # npm install && npx playwright install chromium
//
// Writes preview-1.png, preview-2.png, … (one per .slide) into outDir
// (defaults to the deck's own directory).

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve, isAbsolute } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    '\n[float-deck] Playwright is not installed (only needed for screenshots).\n' +
    'Run the one-time setup from the skill\'s assets/ folder:\n\n' +
    '    cd ' + __dirname + '\n' +
    '    npm run setup        # npm install && npx playwright install chromium\n'
  );
  process.exit(1);
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node screenshot.mjs path/to/deck.html [outDir]');
  process.exit(1);
}

const htmlPath = isAbsolute(arg) ? arg : resolve(process.cwd(), arg);
const outDir = process.argv[3]
  ? (isAbsolute(process.argv[3]) ? process.argv[3] : resolve(process.cwd(), process.argv[3]))
  : dirname(htmlPath);

const browser = await chromium.launch();
// 2x for crisp previews; 1440x900 is a representative desktop slide viewport.
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const slides = await page.$$('.slide');
for (let i = 0; i < slides.length; i++) {
  await slides[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await slides[i].screenshot({ path: join(outDir, `preview-${i + 1}.png`) });
}
await browser.close();
console.log('Shot', slides.length, 'slides to', outDir);
