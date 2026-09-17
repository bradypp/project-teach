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
  const helper=resolve('skills/teach/scripts/library.py');
  execFileSync('python3',[helper,'new',root,'lesson','mechanism','--title','A small experiment']);
  execFileSync('python3',[helper,'theme',root,'ocean']);
  const file=join(root,'lessons/mechanism.html');
  const content=`<article><h2 id="model">A useful model</h2><p>Keep <em>meaning</em> and <a href="../index.html#notes">sources</a>.</p>
   <ul><li>One useful case</li><li>Another case</li></ul><pre><code class="language-python">if x &lt; 3:\n    print(x)</code></pre>
   <table><thead><tr><th>Choice</th><th>Cost</th></tr></thead><tbody><tr><td>A</td><td>Small</td></tr></tbody></table>
   <figure class="diagram" id="theme-diagram"><pre class="mermaid">flowchart LR\n A[Request] --&gt; B[Answer]</pre><figcaption>A small flow</figcaption></figure>
   <figure data-export-text="A buffer absorbs a temporary burst."><svg aria-label="Queue"><rect width="20" height="20"/></svg></figure>
   <button>Run simulation</button><p hidden>Unrevealed answer</p></article>`;
  writeFileSync(file,readFileSync(file,'utf8').replace('</main>',content+'</main>'));
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  const context=await browser.newContext({viewport:{width:1400,height:800},colorScheme:'light'});
  // Exercise graceful fallback when persistence is unavailable for local files.
  await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('unavailable')}}));
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(file).href);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  assert.equal(await page.locator('html').getAttribute('data-palette'),'ocean');
  await page.waitForSelector('#theme-diagram[data-rendered-theme="light"][data-rendered-palette="ocean"]');
  assert.equal(await page.locator('link[data-teach-theme]').getAttribute('href'),'../assets/theme.css');
  const readPalette=()=>page.evaluate(()=>Object.fromEntries(['--paper','--paper-deep','--surface','--ink','--muted','--line-strong','--accent','--button-ink','--focus','--success','--danger','--code-bg','--code-ink','--chart-1'].map(name=>[name,getComputedStyle(document.documentElement).getPropertyValue(name).trim().toLowerCase()])));
  const contrast=(foreground,background)=>{
   const channel=value=>{value=parseInt(value,16)/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4};
   const luminance=color=>0.2126*channel(color.slice(1,3))+0.7152*channel(color.slice(3,5))+0.0722*channel(color.slice(5,7));
   const [lighter,darker]=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
   return (lighter+0.05)/(darker+0.05);
  };
  const assertPaletteContrast=(palette,checkBoundary=true)=>{
   for(const [foreground,background] of [['--ink','--surface'],['--muted','--surface'],['--accent','--surface'],['--success','--surface'],['--danger','--surface'],['--button-ink','--accent'],['--code-ink','--code-bg']]) assert.ok(contrast(palette[foreground],palette[background])>=4.5,`${foreground} on ${background}`);
   if(checkBoundary) assert.ok(contrast(palette['--line-strong'],palette['--surface'])>=3,'strong border on surface');
   assert.ok(contrast(palette['--focus'],palette['--surface'])>=3,'focus on surface');
  };
  let palette=await readPalette();
  assert.equal(palette['--paper'],'#f6f8fa');
  assert.equal(palette['--paper-deep'],'#eaeff5');
  assert.equal(palette['--chart-1'],'#0969da');
  assertPaletteContrast(palette);
  const anchors={
   parchment:{light:['#eee8de','#9f452f'],dark:['#171614','#efa07e']},
   ocean:{light:['#f6f8fa','#0969da'],dark:['#0d1117','#79c0ff']},
   forest:{light:['#f4f7f2','#247a43'],dark:['#0f1712','#73d99a']},
   plum:{light:['#f8f6fa','#7b3fb2'],dark:['#151118','#d2a8ff']},
   graphite:{light:['#f6f6f5','#3f5f73'],dark:['#111312','#8eb8cf']},
  };
  for(const [paletteName,appearances] of Object.entries(anchors)){
   await page.evaluate(name=>teachTheme.setPalette(name),paletteName);
   for(const [appearance,[paper,accent]] of Object.entries(appearances)){
    await page.evaluate(value=>teachTheme.set(value),appearance);
    const current=await readPalette();
    assert.equal(current['--paper'],paper,`${paletteName} ${appearance} paper`);
    assert.equal(current['--accent'],accent,`${paletteName} ${appearance} accent`);
    assertPaletteContrast(current,paletteName!=='parchment');
   }
  }
  await page.evaluate(()=>{teachTheme.setPalette(null);teachTheme.set('light')});
  const mainBox=await page.locator('main').boundingBox();
  assert.ok(Math.abs(mainBox.width-1000)<1);
  const themeBox=await page.locator('[data-theme-toggle]').boundingBox();
  assert.ok(themeBox.y < 150);assert.ok(Math.abs(themeBox.width-themeBox.height)<1);assert.ok(Math.abs(themeBox.width-40)<1);
  const paletteButton=page.locator('[data-palette-button]');
  assert.equal(await paletteButton.locator('[data-palette-label]').textContent(),'Ocean');
  assert.equal(await page.locator('[data-palette-option]').count(),6);
  await paletteButton.press('ArrowDown');
  assert.equal(await paletteButton.getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('[data-palette-option]').first().evaluate(node=>node===document.activeElement),true);
  await page.locator('[data-palette-option]').first().press('End');
  assert.equal(await page.locator('[data-palette-value="graphite"]').evaluate(node=>node===document.activeElement),true);
  await page.locator('[data-palette-value="graphite"]').press('Escape');
  assert.equal(await paletteButton.getAttribute('aria-expanded'),'false');
  await paletteButton.click();
  await page.locator('[data-palette-value="forest"]').click();
  await page.waitForSelector('#theme-diagram[data-rendered-palette="forest"]');
  assert.equal(await page.locator('html').getAttribute('data-palette'),'forest');
  assert.equal(await paletteButton.locator('[data-palette-label]').textContent(),'Forest');
  assert.match(page.url(),/palette=forest/);
  palette=await readPalette();
  assert.equal(palette['--paper'],'#f4f7f2');
  assert.equal(palette['--accent'],'#247a43');
  assertPaletteContrast(palette);
  await paletteButton.click();
  await page.locator('[data-palette-value=""]').click();
  assert.equal(await page.locator('html').getAttribute('data-palette'),'ocean');
  assert.doesNotMatch(page.url(),/palette=/);
  assert.equal(await page.locator('[data-theme-system]').count(),0);
  assert.equal(await page.locator('.site-nav .notebook-link-icon svg').count(),1);
  assert.equal(await page.locator('[data-export-status]').isVisible(),false);
  assert.equal(await page.locator('[data-chat] .button-label').textContent(),'Copy follow-up');
  await page.setViewportSize({width:390,height:844});
  for(const paletteName of Object.keys(anchors)){
   await page.evaluate(name=>teachTheme.setPalette(name),paletteName);
   for(const appearance of ['light','dark']){
    await page.evaluate(value=>teachTheme.set(value),appearance);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${paletteName} ${appearance} mobile width`);
   }
  }
  await page.evaluate(()=>{teachTheme.setPalette(null);teachTheme.set('light')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:'/tmp/teach-notebook-ocean-light-mobile.png',fullPage:true});
  await page.setViewportSize({width:1400,height:800});
  let md=await page.evaluate(()=>learningExportMarkdown(document));
  assert.match(md,/# A small experiment/);assert.match(md,/## A useful model/);
  assert.match(md,/```python\nif x < 3:\n    print\(x\)\n```/);
  assert.match(md,/\| Choice \| Cost \|/);assert.match(md,/\| A \| Small \|/);
  assert.match(md,/A buffer absorbs a temporary burst\./);
  assert.match(md,/file:.*index.html#notes/);
  assert.doesNotMatch(md,/Run simulation|Unrevealed answer|Save Markdown|Theme/);
  await page.locator('[data-copy]').click();
  await page.waitForFunction(()=>document.querySelector('[data-export-status]')?.textContent);
  assert.equal(await page.locator('[data-export-status]').isVisible(),true);
  // Rewrapping for a different layout must not change the content export.
  await page.evaluate(()=>{const article=document.querySelector('article');const section=document.createElement('section');article.replaceWith(section);section.append(article)});
  assert.equal(await page.evaluate(()=>learningExportMarkdown(document)),md);
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.waitForSelector('#theme-diagram[data-rendered-theme="dark"][data-rendered-palette="ocean"]');
  palette=await readPalette();
  assert.equal(palette['--paper'],'#0d1117');
  assert.equal(palette['--paper-deep'],'#0b0f14');
  assert.equal(palette['--code-bg'],'#0b0f14');
  assert.equal(palette['--chart-1'],'#79c0ff');
  assertPaletteContrast(palette);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:'/tmp/teach-notebook-ocean-dark-mobile.png',fullPage:true});
  await page.setViewportSize({width:1400,height:800});
  await page.screenshot({path:'/tmp/teach-notebook-dark.png',fullPage:true});
  await page.evaluate(()=>teachTheme.setPalette('forest'));
  await page.waitForSelector('#theme-diagram[data-rendered-palette="forest"]');
  await page.locator('nav a').click();
  assert.match(page.url(),/theme=dark/);assert.match(page.url(),/palette=forest/);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.locator('html').getAttribute('data-palette'),'forest');
  assert.equal(await page.locator('[data-copy]').count(),0);
  assert.match(await page.evaluate(()=>learningExportMarkdown(document)),/A small experiment/);
  await page.getByRole('link',{name:'A small experiment'}).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.locator('html').getAttribute('data-palette'),'forest');
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.screenshot({path:'/tmp/teach-notebook-light.png',fullPage:true});
  const savedContext=await browser.newContext();
  const savedPage=await savedContext.newPage();
  await savedPage.goto(pathToFileURL(file).href);
  assert.equal(await savedPage.evaluate(()=>teachTheme.get()),'system');
  assert.equal(await savedPage.evaluate(()=>teachTheme.getPalette()),'ocean');
  await savedPage.evaluate(()=>localStorage.setItem('teach-palette','missing-palette'));
  await savedPage.reload();
  assert.equal(await savedPage.locator('html').getAttribute('data-palette'),'ocean');
  assert.equal(await savedPage.evaluate(()=>localStorage.getItem('teach-palette')),null);
  await savedPage.locator('[data-palette-button]').click();
  await savedPage.locator('[data-palette-value="plum"]').click();
  assert.equal(await savedPage.evaluate(()=>localStorage.getItem('teach-palette')),'plum');
  await savedPage.reload();
  assert.equal(await savedPage.locator('html').getAttribute('data-palette'),'plum');
  await savedPage.locator('[data-palette-button]').click();
  await savedPage.locator('[data-palette-value=""]').click();
  assert.equal(await savedPage.evaluate(()=>localStorage.getItem('teach-palette')),null);
  assert.equal(await savedPage.locator('html').getAttribute('data-palette'),'ocean');
  if (await savedPage.locator('html').getAttribute('data-theme') !== 'dark') await savedPage.locator('[data-theme-toggle]').click();
  assert.equal(await savedPage.evaluate(()=>localStorage.getItem('teach-theme')),'dark');
  await savedPage.reload();
  assert.equal(await savedPage.locator('html').getAttribute('data-theme'),'dark');
  await savedContext.close();
  writeFileSync(join(root,'assets/theme.css'),':root { --paper: #fff; --surface: #fff; --ink: #111; --ink-soft: #222; --muted: #555; --line: #aaa; --accent: #234; --shadow-border: none; --shadow-paper: none; }');
  const customContext=await browser.newContext();
  const customPage=await customContext.newPage();
  await customPage.goto(pathToFileURL(file).href);
  assert.equal(await customPage.locator('[data-palette-button]').count(),0);
  assert.equal(await customPage.locator('html').getAttribute('data-palette'),null);
  assert.equal(await customPage.locator('[data-theme-toggle]').count(),1);
  await customContext.close();
  assert.deepEqual(errors,[]);
  console.log('Notebook checks passed: full export, layout independence, controls on index, theme fallback/navigation.');
 } finally {if(browser)await browser.close();rmSync(root,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1});
