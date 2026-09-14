// Mixed practice and custom state must survive every content page's handoff.
const { chromium } = require("playwright");
const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");

(async () => {
  const root = mkdtempSync(join(tmpdir(), "teach mixed practice-"));
  const assets = resolve(".agents/skills/learning/teach/assets");
  const helper = resolve(".agents/skills/learning/teach/scripts/library.py");
  const components = ["choice-question", "open-question", "multi-step-question", "scenario-question", "visual-experiment"]
    .map((name) => readFileSync(join(assets, `templates/${name}.html`), "utf8"))
    .join("\n").replace("data-question disabled", "data-question");
  const custom = `
    <section data-export-summary="Puzzle state: tile A is at position 2.">
      <h2>Route puzzle</h2><p>Choose a route using the current tile arrangement.</p>
      <svg data-export-ignore aria-label="Tile A at position 2"><rect width="20" height="20"/></svg>
      <label for="route">Route policy</label>
      <select id="route" multiple><option value="a">Preserve order</option><option value="b">Skip blocked tile</option></select>
      <label><input id="confirm-route" type="checkbox" />Keep the first tile</label>
      <label for="route-plan">Route reasoning</label><textarea id="route-plan"></textarea>
    </section>
    <section data-export-text="Legacy visual: two connected nodes.">
      <h2>Legacy widget context</h2>
      <label for="legacy-plan">Legacy prediction</label><textarea id="legacy-plan"></textarea>
      <output>Visible result: node B reached.</output>
      <canvas aria-label="Two connected nodes"></canvas>
    </section>
    <input type="hidden" value="internal-only-value" />
    <textarea hidden>hidden-only-answer</textarea>
    <input data-export-ignore value="ignored-control-value" />
    <div data-export-ignore>decorative-only-text</div>`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true,
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    });
    const context = await browser.newContext({ viewport: { width: 1100, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const markdown = () => page.evaluate(() => learningExportMarkdown(document));
    const files = [];
    for (const kind of ["quiz", "lesson", "topic", "reference", "glossary", "research"]) {
      execFileSync("python3", [helper, "new", root, kind, kind, "--title", `Mixed ${kind}`]);
      const folder = ["reference", "glossary"].includes(kind) ? "references" : kind === "quiz" ? "quizzes" : kind === "research" ? "research" : `${kind}s`;
      const file = join(root, folder, `${kind}.html`);
      files.push(file);
      const insertion = kind === "quiz" ? "</form>" : "</main>";
      writeFileSync(file, readFileSync(file, "utf8").replace(insertion, components + custom + insertion));
      await page.goto(pathToFileURL(file).href);
      await page.waitForSelector(".diagram-view svg");
      let copied = await markdown();
      assert.match(copied, /flowchart TB/);
      assert.match(copied, /event is still pending locally/);
      assert.doesNotMatch(copied, /20 \+ \(9|worker has 6|durable remote receipt|internal-only-value|decorative-only-text|hidden-only-answer|ignored-control-value/);
      assert.equal((copied.match(/Feedback viewed: no/g) || []).length, 8);

      // Answers, current controls, latest run and custom JavaScript-only state.
      await page.locator('input[name="q1"][value="a"]').check();
      await page.locator("#reasoning-1").fill("My reflection\nAn assumption changed.");
      await page.locator("#burst-count").fill("50");
      if (kind === "quiz") {
        await page.locator("#burst-count").press("Enter");
        assert.equal(await page.locator("#reasoning-1").inputValue(), "My reflection\nAn assumption changed.");
      }
      await page.locator("#burst-reason").fill("Start with twenty; add thirty.");
      await page.locator("#receipt-plan").fill("Ask for a durable receipt.");
      await page.locator("#queue-prediction").fill("The backlog grows.");
      await page.locator("#queue-reflection").fill("Starting work matters.");
      await page.locator("#route").selectOption(["a", "b"]);
      await page.locator("#confirm-route").check();
      await page.locator("#route-plan").fill("Preserve the tile order.");
      await page.locator("#legacy-plan").fill("Follow the two nodes.");
      await page.evaluate(() => document.querySelector("[data-export-summary]").dataset.exportSummary = "Puzzle state: tile A is at position 3.");
      await page.locator("[data-run-experiment]").click();
      assert.equal(await page.locator("[data-queue-plot]").isVisible(), true);
      assert.match(await page.locator("[data-experiment-result]").textContent(), /20, 35, 50/);
      // Keyboard range input updates the current setting without rerunning.
      await page.locator("#queue-arrivals").focus();
      await page.keyboard.press("ArrowLeft");
      assert.equal(await page.locator("#queue-arrivals").inputValue(), "8");
      copied = await markdown();
      for (const text of ["My reflection", "An assumption changed.", "Start with twenty; add thirty.",
        "Ask for a durable receipt.", "Starting work matters.", "Preserve order, Skip blocked tile",
        "Puzzle state: tile A is at position 3.", "Legacy widget context", "Follow the two nodes.",
        "Visible result: node B reached.", "Settings changed; run again.", "Last run: arrivals 9/s", "20, 35, 50"]) {
        assert.ok(copied.includes(text), `Missing ${text} in ${kind}`);
      }
      assert.match(copied, /Arrivals per second\s+8/);
      assert.doesNotMatch(copied, /Interactive visual: see the original/);

      // Revealing one step cannot reveal siblings' worked solutions.
      await page.locator('input[name="burst-trend"][value="drains"]').check();
      await page.locator('[data-question]').filter({ has: page.locator('[name="burst-trend"]') }).locator("[data-check]").click();
      copied = await markdown();
      assert.match(copied, /worker has 6/);
      assert.doesNotMatch(copied, /20 \+ \(9|durable remote receipt/);
      assert.equal((copied.match(/Feedback viewed: yes/g) || []).length, 1);
      const experiment = page.locator("[data-queue-experiment]");
      await experiment.locator("[data-hint] summary").click();
      await experiment.locator("[data-self-check] summary").click();
      await page.waitForFunction(() => document.querySelector("[data-queue-experiment]").dataset.checked === "true");
      await experiment.locator("[data-self-check] summary").click();
      await experiment.locator("[data-hint] summary").click();
      await page.locator("#queue-reflection").fill("Revised after feedback.");
      await page.locator("#queue-service").focus();
      await page.keyboard.press("ArrowRight");
      copied = await markdown();
      assert.match(copied, /Revised after feedback/);
      assert.match(copied, /Hint revealed: yes; Response changed after feedback: yes/);
      assert.match(copied, /zero floor/);
      assert.doesNotMatch(copied, /durable remote receipt could/);

      // Both copy routes and downloads use the same current-state export.
      await page.evaluate(() => Object.defineProperty(navigator, "clipboard", {
        configurable: true, value: { writeText: async (value) => { window.copiedText = value; } },
      }));
      await page.locator("[data-copy]").click();
      assert.equal(await page.evaluate(() => window.copiedText), copied);
      if (kind !== "glossary") {
        await page.locator("[data-chat]").click();
        const handoff = await page.evaluate(() => window.copiedText);
        if (kind === "quiz") {
          assert.ok(handoff.startsWith(`Please review my responses to [Mixed quiz](${file}).`));
          assert.ok(handoff.endsWith(copied));
          assert.ok(!handoff.includes("Local file:"));
        } else assert.ok(handoff.includes(`Local file: ${file}`));
      } else assert.equal(await page.locator("[data-chat]").count(), 0);
      await page.evaluate(() => Object.defineProperty(navigator, "clipboard", {
        configurable: true, value: { writeText: async () => { throw new Error("blocked"); } },
      }));
      await page.locator("[data-copy]").click();
      assert.equal(await page.locator("#export-text").inputValue(), copied);
      const downloading = page.waitForEvent("download");
      await page.locator("[data-download]").click();
      const download = await downloading;
      assert.equal(readFileSync(await download.path(), "utf8"), copied);
    }

    // New components: both themes, narrow width and visible keyboard focus.
    await page.goto(pathToFileURL(files[0]).href);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => teachTheme.set(value), theme);
      for (const width of [1100, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator("[data-run-experiment]").click();
        await page.locator("#queue-arrivals").focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#queue-arrivals").evaluate((node) => node.matches(":focus-visible")), true);
        assert.notEqual(await page.locator("#queue-arrivals").evaluate((node) => getComputedStyle(node).outlineStyle), "none");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.locator("[data-queue-experiment]").screenshot({ path: `/tmp/teach-practice-${theme}-${width}.png` });
      }
    }
    // The zero floor and rerun are reflected in the text and plot.
    await page.locator("#queue-arrivals").fill("0");
    await page.locator("#queue-service").fill("12");
    await page.locator("[data-run-experiment]").click();
    assert.match(await markdown(), /20, 0, 0.*reaches zero at 1.67/);
    assert.match(await page.locator("[data-queue-plot]").getAttribute("aria-label"), /reaches zero/);
    // Copy works with an unrendered diagram too.
    await page.reload();
    assert.match(await markdown(), /flowchart TB/);
    await page.goto(pathToFileURL(join(root, "index.html")).href);
    assert.equal(await page.locator(".notebook-tools").count(), 0);
    assert.deepEqual(errors, []);

    const noScript = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noScript.newPage();
    await staticPage.goto(pathToFileURL(files[0]).href);
    assert.equal(await staticPage.locator("noscript").isVisible(), true);
    assert.equal(await staticPage.locator("[data-run-experiment]").isDisabled(), true);
    assert.equal(await staticPage.locator("#burst-count").isEnabled(), true);
    await noScript.close();
    console.log("Practice checks passed: independent steps, scenarios, custom snapshots, changed responses, copy/fallback/download on all content kinds, themes, keyboard, mobile and static fallback.");
  } finally {
    if (browser) await browser.close();
    rmSync(root, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
