// Regression checks for whole-page export and theme navigation, not per-lesson QA.
const {chromium}=require('playwright');
const {mkdtempSync,readFileSync,writeFileSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join,resolve}=require('node:path');
const {pathToFileURL}=require('node:url');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
(async()=>{
 const root=mkdtempSync(join(tmpdir(),'teach-notebook-'));
 let browser;
 try {
  const helper=resolve('.agents/skills/learning/teach/scripts/library.py');
  execFileSync('python3',[helper,'new',root,'lesson','mechanism','--title','A small experiment']);
  const file=join(root,'lessons/mechanism.html');
  const content=`<article><h2 id="model">A useful model</h2><p>Keep <em>meaning</em> and <a href="../index.html#notes">sources</a>.</p>
   <ul><li>One useful case</li><li>Another case</li></ul><pre><code class="language-python">if x &lt; 3:\n    print(x)</code></pre>
   <table><thead><tr><th>Choice</th><th>Cost</th></tr></thead><tbody><tr><td>A</td><td>Small</td></tr></tbody></table>
   <figure data-export-text="A buffer absorbs a temporary burst."><svg aria-label="Queue"><rect width="20" height="20"/></svg></figure>
   <button>Run simulation</button><p hidden>Unrevealed answer</p></article>`;
  writeFileSync(file,readFileSync(file,'utf8').replace('</main>',content+'</main>'));
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  const context=await browser.newContext({viewport:{width:1000,height:800},colorScheme:'light'});
  // Exercise graceful fallback when persistence is unavailable for local files.
  await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('unavailable')}}));
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(file).href);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  let md=await page.evaluate(()=>learningExportMarkdown(document));
  assert.match(md,/# A small experiment/);assert.match(md,/## A useful model/);
  assert.match(md,/```python\nif x < 3:\n    print\(x\)\n```/);
  assert.match(md,/\| Choice \| Cost \|/);assert.match(md,/\| A \| Small \|/);
  assert.match(md,/A buffer absorbs a temporary burst\./);
  assert.match(md,/file:.*index.html#notes/);
  assert.doesNotMatch(md,/Run simulation|Unrevealed answer|Save Markdown|Theme/);
  // Rewrapping for a different layout must not change the content export.
  await page.evaluate(()=>{const article=document.querySelector('article');const section=document.createElement('section');article.replaceWith(section);section.append(article)});
  assert.equal(await page.evaluate(()=>learningExportMarkdown(document)),md);
  await page.locator('[data-theme-choice]').selectOption('dark');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.screenshot({path:'/tmp/teach-notebook-dark.png',fullPage:true});
  await page.locator('nav a').click();
  assert.match(page.url(),/theme=dark/);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.locator('[data-copy]').count(),1);
  assert.match(await page.evaluate(()=>learningExportMarkdown(document)),/A small experiment/);
  await page.getByRole('link',{name:'A small experiment'}).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.locator('[data-theme-choice]').selectOption('system');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.screenshot({path:'/tmp/teach-notebook-light.png',fullPage:true});
  const savedContext=await browser.newContext();
  const savedPage=await savedContext.newPage();
  await savedPage.goto(pathToFileURL(file).href);
  await savedPage.locator('[data-theme-choice]').selectOption('dark');
  assert.equal(await savedPage.evaluate(()=>localStorage.getItem('teach-theme')),'dark');
  await savedPage.reload();
  assert.equal(await savedPage.locator('html').getAttribute('data-theme'),'dark');
  await savedContext.close();
  assert.deepEqual(errors,[]);
  console.log('Notebook checks passed: full export, layout independence, controls on index, theme fallback/navigation.');
 } finally {if(browser)await browser.close();rmSync(root,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1});
