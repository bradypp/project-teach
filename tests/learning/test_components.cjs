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
 assert.equal(await page.locator('.notebook-hero').evaluate(node=>getComputedStyle(node).animationName),'none');
 const controls=await page.evaluate(()=>{const box=(selector)=>{const rect=document.querySelector(selector).getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,center:rect.y+rect.height/2}};return {tags:box('.tag-filters'),status:box('[data-filter-status]'),sort:box('#library-sort')}});
 assert.ok(controls.tags.width>controls.sort.width*4);
 assert.ok(Math.abs(controls.status.center-controls.sort.center)<2);
 assert.ok(controls.sort.height<=36);
 await page.locator('#library-sort').click();
 assert.equal(await page.locator('.library-sort-option').first().evaluate(node=>getComputedStyle(node).cursor),'pointer');
 assert.equal(await page.locator('#library-sort').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#library-sort').getAttribute('aria-expanded'),'false');
 await page.evaluate(()=>scrollTo(0,800));
 await page.waitForFunction(()=>document.querySelector('.site-nav').classList.contains('is-scroll-hidden'));
 await page.evaluate(()=>scrollTo(0,500));
 await page.waitForFunction(()=>!document.querySelector('.site-nav').classList.contains('is-scroll-hidden'));
 await page.evaluate(()=>scrollTo(0,0));
 assert.deepEqual(await page.locator('.library-section h2').allTextContents(),['Lessons','Topics','Quizzes','Reference','Research']);
 await page.locator('.tag-filters [data-tag="reliability"]').click();
 await page.locator('.tag-filters [data-tag="reliability"]').hover();
 const pillStyles=await page.evaluate(()=>{const style=node=>{const value=getComputedStyle(node);return {background:value.backgroundColor,color:value.color,shadow:value.boxShadow}};return {active:style(document.querySelector('[data-tag="reliability"]')),inactive:style(document.querySelector('[data-tag="architecture"]'))}});
 assert.notEqual(pillStyles.active.background,pillStyles.inactive.background);
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),8);
 assert.equal(await page.locator('#backpressure').count(),0);
 assert.equal(await page.locator('[data-library-section="references"]').isVisible(),true);
 await page.locator('.tag-filters [data-tag="glossary"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),1);
 await page.locator('.tag-filters [data-tag="resource"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),1);
 await page.locator('[data-tag=""]').click();
 await page.locator('[data-type="lessons"]').click();
 assert.equal(await page.locator('[data-library-section]:visible').count(),1);
 await page.locator('.tag-filters [data-tag="queues"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),2);
 await page.locator('.tag-filters [data-tag="reliability"]').click();
 assert.equal(await page.locator('.tag-filters [aria-pressed="true"]').count(),1);
 assert.equal(await page.locator('.type-filters [aria-pressed="true"]').count(),1);
 await page.locator('[data-type="references"]').click();
 assert.equal(await page.locator('[data-library-section]:visible').count(),1);
 assert.equal(await page.locator('[data-library-section="references"]').isVisible(),true);
 await page.locator('[data-type="research"]').click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),1);
 await page.locator('[data-type=""]').click();
 await page.locator('[data-tag=""]').click();

 await page.locator('#library-sort').click();await page.locator('[data-sort-value="title"]').click();
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/Bound the inbox/);
 await page.locator('#library-sort').click();await page.locator('[data-sort-value="oldest"]').click();
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/Bound the inbox/);
 await page.locator('#library-sort').click();await page.locator('[data-sort-value="newest"]').click();
 assert.match(await page.locator('[data-library-section]').first().locator('.library-entry').first().innerText(),/Read the shape of a backlog/);
 assert.equal(await page.locator('.notebook-tools').count(),0);
 await page.locator('.entry-tags [data-tag="reliability"]').first().click();
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),8);
 assert.equal(new URL(page.url()).searchParams.get('tag'),'reliability');
 await page.locator('[data-tag=""]').click();
 assert.match(await page.locator('.entry-meta time').first().textContent(),/13th Sept 2026 · 12:48/);
 await page.screenshot({path:'/tmp/teach-home-light.png',fullPage:true});
 await page.goto(new URL('lessons/make-retries-boring.html',base).href);
 await page.locator('[data-page-tags] a',{hasText:'idempotency'}).click();
 await page.waitForLoadState('load');
 assert.equal(new URL(page.url()).searchParams.get('tag'),'idempotency');
 assert.equal(await page.locator('.tag-filters [data-tag="idempotency"]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('[data-library-section]:visible .library-entry:visible').count(),1);

 for(const path of [
  'lessons/what-an-acknowledgement-promises.html',
  'lessons/make-retries-boring.html',
  'lessons/bound-the-inbox.html',
  'lessons/recover-abandoned-work.html',
  'lessons/read-backlog-shape.html',
  'topics/reliable-webhook-delivery.html',
  'references/lantern-data-model.html'
 ]) {
  await page.goto(new URL(path,base).href);
  await page.waitForSelector('figure[data-rendered-theme]');
  assert.equal(await page.locator('.diagram-view svg').count(),1);
  const md=await page.evaluate(()=>learningExportMarkdown(document));assert.match(md,/```mermaid/);
  if(path.includes('make-retries-boring')) {
   const note=await page.evaluate(()=>{const rect=document.querySelector('.note').getBBox();const texts=[...document.querySelectorAll('.noteText')].map(node=>node.getBBox());const left=Math.min(...texts.map(box=>box.x));const right=Math.max(...texts.map(box=>box.x+box.width));return {lines:texts.length,width:rect.width,textWidth:right-left}});
   assert.equal(note.lines,1);assert.ok(Math.abs(note.width-note.textWidth-20)<1);
  }
  if(path.includes('recover-abandoned-work')) {
   const tableFill=await page.evaluate(()=>{const table=document.querySelector('#lease table');return {table:table.getBoundingClientRect().width,parent:table.parentElement.getBoundingClientRect().width}});
   assert.ok(Math.abs(tableFill.table-tableFill.parent)<1);
  }
  if(path.includes('bound-the-inbox')) {
   assert.ok(await page.locator('.hljs-keyword').count());assert.match(md,/```python/);assert.match(md,/pending/);
   await page.goto(new URL(path+'#two-bounds',base).href);
   await page.waitForSelector('figure[data-rendered-theme]');
   await page.waitForFunction(()=>{const heading=document.querySelector('#two-bounds h2').getBoundingClientRect();const nav=document.querySelector('.site-nav');return nav.classList.contains('is-scroll-hidden')&&heading.top>=-1&&heading.top<80});
  }
  if(path.includes('read-backlog-shape')) assert.match(md,/```text/);
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
