// Fresh installed-template fixture: readable sizing, wrapping, overflow and export.
const { chromium } = require('playwright');
const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { tmpdir } = require('node:os');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
 const root = mkdtempSync(join(tmpdir(), 'teach-diagrams-'));
 const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH});
 try {
  execFileSync('python3', [resolve('.agents/skills/learning/teach/scripts/library.py'), 'new', root, 'lesson', 'diagrams', '--title', 'Readable diagrams']);
  const source = `flowchart LR
 A["Authenticate the caller"] --> B["Persist the investigation"] --> C["Retrieve authorised evidence"] --> D["Deduplicate candidates"] --> E["Pack the model context"] --> F["Generate a supported answer"] --> G["Persist the result"]`;
  const compact = 'flowchart LR\n A[Request] --> B[Retrieve] --> C[Pack] --> D[Answer] --> E[Check]';
  const wrapped = 'flowchart TD\n A["`Retrieve authorised evidence while retaining source identity and version`"] --> B["`Check support`"]';
  const file = join(root, 'lessons/diagrams.html');
  const figure = (id, text) => `<figure class="diagram" id="${id}"><pre class="mermaid">${text}</pre><figcaption>${id} caption</figcaption></figure>`;
  writeFileSync(file, readFileSync(file,'utf8').replace('</main>', figure('wide',source)+figure('compact',compact)+figure('wrapped',wrapped)+'</main>'));
  const page=await browser.newPage({viewport:{width:1100,height:900}});
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  for (const width of [1100,390]) {
   await page.setViewportSize({width,height:900});
   for(const theme of ['light','dark']) {
    await page.goto(pathToFileURL(file).href+'?theme='+theme);
    await page.waitForSelector(`#wrapped[data-rendered-theme="${theme}"]`);
    const dimensions=await page.locator('#wide').evaluate(figure=>{
     const svg=figure.querySelector('svg'), view=figure.querySelector('.diagram-view');
     return {rendered:svg.getBoundingClientRect().width,natural:svg.viewBox.baseVal.width,scroll:view.scrollWidth,available:view.clientWidth,
      textSizes:[...svg.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)*t.getScreenCTM().a),
      pageWidth:document.documentElement.scrollWidth, viewport:innerWidth,
      left:svg.getBoundingClientRect().left-view.getBoundingClientRect().left};
    });
    assert.ok(Math.abs(dimensions.rendered-dimensions.natural*0.875)<1,'Oversized diagrams must stop shrinking at the readability floor');
    assert.ok(dimensions.textSizes.length>0);
    assert.ok(dimensions.textSizes.every(size=>size>=13.9),'Labels must remain readable');
    assert.ok(dimensions.scroll>dimensions.available,'Wide fixture must scroll');
    assert.ok(dimensions.pageWidth<=dimensions.viewport,'Only diagram may overflow');
    assert.ok(dimensions.left>=0,'Left edge must remain reachable');
    assert.equal(await page.locator('#wide .diagram-view').getAttribute('tabindex'),'0');
    assert.equal(await page.locator('#wide .diagram-scroll-hint').isVisible(),true);
    await page.locator('#wide .diagram-view').focus();
    assert.notEqual(await page.locator('#wide .diagram-view').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('#wide .diagram-view').scrollLeft>0);
    const label=await page.locator('#wrapped .nodeLabel').first().evaluate(n=>{
     const style=getComputedStyle(n.querySelector('p') || n);
     return {height:n.getBoundingClientRect().height,font:parseFloat(style.fontSize),width:n.getBoundingClientRect().width};
    });
    assert.ok(label.height>label.font*2,'Markdown label must wrap');
    assert.ok(label.width<=181,'Wrapped label must respect shared width');
    const markdown=await page.evaluate(()=>learningExportMarkdown(document));
    assert.ok(markdown.includes(source)); assert.ok(markdown.includes(wrapped));
    assert.ok(!markdown.includes('Scroll horizontally'));
    await page.screenshot({path:`/tmp/teach-diagrams-${width}-${theme}.png`,fullPage:true});
   }
  }
  // A five-stage horizontal flow can fit with slight shrinking, then grow
  // back to natural size when room is available without changing direction.
  await page.setViewportSize({width:1100,height:900});
  await page.locator('#compact .diagram-view').evaluate(view=>{
   const width=view.querySelector('svg').viewBox.baseVal.width;
   const css=getComputedStyle(view);
   view.style.width=(width*0.95+parseFloat(css.paddingLeft)+parseFloat(css.paddingRight))+'px';
  });
  await page.waitForFunction(()=>{
   const svg=document.querySelector('#compact svg');
   return Math.abs(svg.getBoundingClientRect().width/svg.viewBox.baseVal.width-0.95)<0.005;
  });
  assert.equal(await page.locator('#compact .diagram-scroll-hint').isVisible(),false);
  const positions=await page.locator('#compact .node').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().x));
  assert.ok(positions.every((x,i)=>i===0 || x>positions[i-1]),'Compact flow stays horizontal');
  await page.locator('#compact .diagram-view').evaluate(view=>view.style.width='');
  await page.waitForFunction(()=>{
   const svg=document.querySelector('#compact svg');
   return Math.abs(svg.getBoundingClientRect().width-svg.viewBox.baseVal.width)<1;
  });
  // Resize and theme changes must refresh overflow affordances without duplicates.
  await page.setViewportSize({width:1100,height:900});
  await page.waitForFunction(()=>!document.querySelector('#wrapped .diagram-view').hasAttribute('tabindex'));
  assert.equal(await page.locator('#wrapped .diagram-scroll-hint').isVisible(),false);
  await page.locator('[data-theme-toggle]').click();
  const theme=await page.locator('html').getAttribute('data-theme');
  await page.waitForSelector(`#wide[data-rendered-theme="${theme}"]`);
  assert.equal(await page.locator('#wide .diagram-scroll-hint').count(),1);
  assert.deepEqual(errors,[]);
  console.log('Diagram text size, wrapping, keyboard overflow, resizing, themes and source export pass.');
 } finally {await browser.close();rmSync(root,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
