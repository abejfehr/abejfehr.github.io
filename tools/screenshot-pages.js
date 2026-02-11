const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4000';

// Pages you want screenshots of
const pages = [
  { name: 'home', path: '/', delay: 4000 },
  { name: 'posts', path: '/posts' },
  { name: 'post', path: '/posts/building-a-desktop-train-departure-sign' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../screenshots');

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  for (const p of pages) {
    const url = BASE_URL + p.path;
    const filePath = path.join(OUTPUT_DIR, `${p.name}.png`);

    console.log(`📸 Screenshotting ${url}`);

    await page.goto(url, { waitUntil: 'networkidle' });

    if (p.delay) {
      console.log(`⏳ Waiting ${p.delay}ms`);
      await page.waitForTimeout(p.delay);
    }

    await page.screenshot({
      path: filePath,
      fullPage: true,
    });
  }

  await browser.close();
  console.log('✅ Screenshots complete');
})().catch(err => {
  console.error('❌ Screenshot failed');
  console.error(err);
  process.exit(1);
});
