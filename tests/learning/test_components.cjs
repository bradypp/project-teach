const {chromium}=require('playwright');
const {resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
 try {
 const page=await browser.newPage({viewport:{width:1100,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=pathToFileURL(resolve('examples/.learning/index.html')).href;
 await page.goto(base);
 assert.deepEqual(await page.locator('.library-section h2').allTextContents(),['Lessons','Topics','Quizzes','References','Glossary']);
 await page.locator('.tag-filters [data-tag="reliability"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),2);
 assert.equal(await page.locator('#backpressure').count(),0);
 assert.equal(await page.locator('.library-section').last().isVisible(),true);
 await page.locator('[data-tag=""]').click();
 await page.locator('[data-type="lessons"]').click();
 assert.equal(await page.locator('[data-library-section]:visible').count(),1);
 await page.locator('.tag-filters [data-tag="queues"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),1);
 await page.locator('.tag-filters [data-tag="reliability"]').click();
 assert.equal(await page.locator('.tag-filters [aria-pressed="true"]').count(),1);
 assert.equal(await page.locator('.type-filters [aria-pressed="true"]').count(),1);
 await page.locator('[data-type="references"]').click();
 assert.equal(await page.locator('[data-library-section]:visible').count(),0);
 assert.equal(await page.locator('.library-section').last().isVisible(),true);
 await page.locator('[data-type=""]').click();
 await page.locator('[data-tag=""]').click();

 await page.selectOption('#library-sort','title');
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/When a retry/);
 await page.selectOption('#library-sort','oldest');
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/Why queues/);
 await page.selectOption('#library-sort','newest');
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/When a retry/);
 assert.equal(await page.locator('.notebook-tools').count(),0);
 await page.locator('.entry-tags [data-tag="reliability"]').first().click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),2);
 await page.locator('[data-tag=""]').click();
 assert.match(await page.locator('.entry-meta time').first().textContent(),/12th Sept 2026 · 18:11/);
 await page.screenshot({path:'/tmp/teach-home-light.png',fullPage:true});
 for(const path of ['lessons/queues.html','lessons/retries.html','topics/reliable-work.html','references/capacity.html']) {
  await page.goto(new URL(path,base).href);
  await page.waitForSelector('figure[data-rendered-theme]');
  assert.equal(await page.locator('.diagram-view svg').count(),1);
  const md=await page.evaluate(()=>learningExportMarkdown(document));assert.match(md,/```mermaid/);
  if(path.includes('queues')) {assert.ok(await page.locator('.hljs-keyword').count());assert.match(md,/```python/);assert.match(md,/return|pending/);}
  await page.locator('[data-theme-toggle]').click();
  const theme=await page.locator('html').getAttribute('data-theme');
  await page.waitForSelector(`figure[data-rendered-theme="${theme}"]`);
  assert.equal(await page.locator('.notebook-tools a').getAttribute('href'),'../index.html');
  await page.screenshot({path:'/tmp/teach-'+path.split('/').pop()+'.png',fullPage:true});
 }
 assert.deepEqual(errors,[]);
 console.log('Components, diagram theme changes, export, filtering and sorting pass.');
 }finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
