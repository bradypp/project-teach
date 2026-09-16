// Optional maintainer tool: requires Playwright and Chromium.
// Run from the repository root. Set CHROMIUM_PATH for a system browser.
const { chromium } = require('playwright');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { mkdirSync } = require('node:fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 3200 }, deviceScaleFactor: 1 });
    const images = resolve('docs/images');
    mkdirSync(images, { recursive: true });
    async function open(file) {
      await page.goto(pathToFileURL(resolve('examples/.learning', file)).href + '?theme=light');
      await page.evaluate(() => document.fonts.ready);
    }
    await open('index.html');
    await page.locator('main').screenshot({ path: resolve(images, 'notebook.png') });
    await open('lessons/agent-runtime.html');
    await page.waitForSelector('figure.diagram svg');
    await page.locator('figure.diagram').screenshot({ path: resolve(images, 'runtime.png') });
    await open('quizzes/context-lab.html');
    await page.locator('#context-experiment').screenshot({ path: resolve(images, 'context-lab.png') });
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(pathToFileURL(resolve('docs/title-card.html')).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    await page.screenshot({ path: resolve(images, 'title-card.png') });
    console.log('Captured notebook, runtime, context lab and title card.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
