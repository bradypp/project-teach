const { chromium } = require('playwright');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
  try {
    const page = await browser.newPage({viewport: {width: 1100, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = pathToFileURL(resolve('examples/.notebook/index.html')).href;
    await page.goto(base);
    assert.equal(await page.locator('.notebook-hero').evaluate(node => getComputedStyle(node).animationName), 'none');
    assert.deepEqual(await page.locator('.library-section h2').allTextContents(), ['Lessons', 'Topics', 'Quizzes', 'Reference', 'Research']);
    const controls = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect();
      return {tags: box('.tag-filters').width, status: box('[data-filter-status]').y, sort: box('#library-sort').y};
    });
    assert.ok(controls.tags > 300);
    assert.ok(Math.abs(controls.status - controls.sort) < 12);
    await page.locator('#library-sort').click();
    assert.equal(await page.locator('#library-sort').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#library-sort').getAttribute('aria-expanded'), 'false');
    await page.locator('.tag-filters [data-tag="reliability"]').click();
    assert.ok(await page.locator('[data-library-section]:visible .library-entry:visible').count() > 0);
    assert.equal(new URL(page.url()).searchParams.get('tag'), 'reliability');
    await page.locator('.tag-filters [data-tag=""]').click();
    await page.locator('.type-filters [data-type="lessons"]').click();
    assert.equal(await page.locator('[data-library-section]:visible').count(), 1);
    await page.locator('#library-sort').click();
    await page.locator('[data-sort-value="title"]').click();
    assert.match(await page.locator('[data-library-section="lessons"] .library-entry').first().innerText(), /A citation needs the source revision/);
    await page.screenshot({path: '/tmp/teach-home-light.png', fullPage: true});

    await page.goto(new URL('lessons/citation-source-revision.html', base).href);
    await page.waitForSelector('figure[data-rendered-theme]');
    assert.equal(await page.locator('.diagram-view svg').count(), 2);
    assert.equal(await page.locator('figure.diagram').first().locator('.node').count(), 5);
    assert.equal(await page.locator('figure.diagram').first().locator('.nodeLabel').evaluateAll(labels => labels.filter(label => label.innerHTML.includes('<br>')).length), 3);
    const markdown = await page.evaluate(() => learningExportMarkdown(document));
    assert.match(markdown, /```mermaid/);
    assert.match(markdown, /Evidence\npacket/);
    assert.match(markdown, /Evidence envelope\nwith source identity/);
    assert.equal(await page.locator('.page-contents a').count(), 3);
    await page.locator('[data-theme-toggle]').click();
    const theme = await page.locator('html').getAttribute('data-theme');
    await page.waitForSelector(`figure[data-rendered-theme="${theme}"]`);
    assert.equal(await page.locator('figure[data-rendered-theme]').count(), 2);
    await page.screenshot({path: '/tmp/teach-citation-lesson-dark.png', fullPage: true});

    await page.goto(new URL('references/glossary.html', base).href);
    assert.ok(await page.locator('.page-intro .page-contents a').count() > 0);
    await page.locator('.page-contents a[href="#source-version"]').click();
    assert.equal(new URL(page.url()).hash, '#source-version');
    await page.setViewportSize({width: 390, height: 844});
    for (const appearance of ['light', 'dark']) {
      await page.goto(new URL(`lessons/citation-source-revision.html?theme=${appearance}`, base).href);
      await page.waitForSelector(`figure[data-rendered-theme="${appearance}"]`);
      const display = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewport: innerWidth,
        scrollable: [...document.querySelectorAll('figure.diagram .diagram-view')].map(view => view.scrollWidth > view.clientWidth),
        wrapped: [...document.querySelectorAll('figure.diagram .nodeLabel')].some(label => label.innerHTML.includes('<br>')),
      }));
      assert.equal(display.pageWidth, display.viewport);
      assert.deepEqual(display.scrollable, [true, false]);
      assert.equal(display.wrapped, true);
    assert.equal(await page.locator('figure.diagram .diagram-view').first().getAttribute('tabindex'), '0');
    }
    assert.deepEqual(errors, []);
    console.log('Switchboard library controls, lesson diagrams, export, theme changes and glossary contents pass.');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
