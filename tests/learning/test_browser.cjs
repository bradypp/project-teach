// Requires Playwright plus a Chromium installation; set CHROMIUM_PATH if needed.
const { chromium } = require("playwright");
const { mkdtempSync, readFileSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { resolve, join } = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");
(async () => {
  const root = mkdtempSync(join(tmpdir(), "learning-browser-"));
  let browser;
  try {
    execFileSync("python", [
      resolve(".agents/skills/learning/teach/scripts/library.py"),
      "new",
      root,
      "quiz",
      "practice",
      "--title",
      "Practice & feedback",
    ]);
    const file = join(root, "quizzes/practice.html");
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace("</form>", readFileSync(resolve(".agents/skills/learning/teach/assets/templates/choice-question.html"), "utf8") + "</form>")
        .replace("data-question disabled", "data-question")
        .replace(
          "<!-- Add relative lesson link, e.g. ../lessons/queue-backpressure.html -->",
          '<a href="../lessons/example.html">Explore the lesson</a>',
        ),
    );
    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
    });
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      acceptDownloads: true,
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(pathToFileURL(file).href);
    const fieldsetBox = await page.locator("fieldset").first().boundingBox();
    const legendBox = await page.locator("legend").first().boundingBox();
    const legendStyle = await page.locator("legend").first().evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        fontSize: parseFloat(style.fontSize),
        marginBottom: parseFloat(style.marginBottom),
        rootFontSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
      };
    });
    assert.ok(legendBox.y >= fieldsetBox.y);
    assert.ok(legendBox.y + legendBox.height <= fieldsetBox.y + fieldsetBox.height);
    assert.equal(legendStyle.fontSize, legendStyle.rootFontSize);
    assert.ok(Math.abs(legendStyle.marginBottom / legendStyle.fontSize - 1.8) < 0.01);
    assert.equal(await page.locator("[data-explanation]").isVisible(), false);
    await page.locator("[data-check]").click();
    assert.equal(
      await page.locator("[data-feedback]").textContent(),
      "Choose an answer first.",
    );
    await page.locator("input[value=b]").check();
    await page.locator("[data-hint] summary").click();
    await page.waitForFunction(
      () =>
        document.querySelector("[data-question]").dataset.hintSeen === "true",
    );
    await page.locator("[data-check]").click();
    assert.match(
      await page.locator("[data-feedback]").textContent(),
      /Not quite/,
    );
    assert.equal(await page.getByText("Explore the lesson").isVisible(), true);
    let markdown = await page.evaluate(() =>
      window.learningExportMarkdown(document),
    );
    assert.match(markdown, /Hint revealed: yes/);
    assert.match(markdown, /Feedback viewed: yes/);
    assert.match(markdown, /plausible alternative/);
    await page.locator("input[value=a]").check();
    await page.locator("[data-check]").click();
    assert.match(await page.locator("[data-feedback]").textContent(), /Yes/);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (value) => {
            window.copiedQuizForChat = value;
          },
        },
      }),
    );
    await page.locator("[data-chat]").click();
    const chatCopy = await page.evaluate(() => window.copiedQuizForChat);
    assert.match(chatCopy, /Please review my responses to “Practice & feedback”/);
    assert.ok(chatCopy.includes("\\[selected\\] Replace with the correct option"));
    assert.match(chatCopy, /Feedback viewed: yes/);
    assert.equal(await page.locator("[data-chat] .button-label").textContent(), "Copied");
    assert.equal(
      await page.locator("[data-export-status]").textContent(),
      "Quiz responses copied. Paste them into chat.",
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("blocked");
          },
        },
      }),
    );
    await page.locator("[data-chat]").click();
    assert.equal(await page.locator("#export-text").isVisible(), true);
    assert.match(
      await page.locator("#export-text").inputValue(),
      /Please review my responses/,
    );
    assert.equal(
      await page.locator(".export-fallback label").textContent(),
      "Select the text below, copy it, then paste it into chat.",
    );
    assert.equal(
      await page.locator("[data-export-status]").textContent(),
      "Select the text below, copy it, then paste it into chat.",
    );
    await page.locator("[data-copy]").click();
    assert.equal(await page.locator("#export-text").isVisible(), true);
    assert.match(
      await page.locator("#export-text").inputValue(),
      /correct option/,
    );
    assert.equal(
      await page.locator(".export-fallback label").textContent(),
      "Your browser needs a manual copy: use the selected text below.",
    );
    const downloading = page.waitForEvent("download");
    await page.locator("[data-download]").click();
    const download = await downloading;
    assert.equal(download.suggestedFilename(), "practice-feedback.md");
    assert.match(readFileSync(await download.path(), "utf8"), /correct option/);
    // Open questions are self-checks; their actual writing is still exportable.
    const openQuestion = readFileSync(
      resolve(
        ".agents/skills/learning/teach/assets/templates/open-question.html",
      ),
      "utf8",
    );
    writeFileSync(
      file,
      readFileSync(file, "utf8").replace("</form>", openQuestion + "</form>"),
    );
    await page.reload();
    await page
      .locator("#reasoning-1")
      .fill("Retry after a crash\nReuse the operation key.");
    await page.locator("[data-self-check] summary").click();
    await page.waitForFunction(
      () =>
        document.querySelector("[data-self-check]").closest("[data-question]")
          .dataset.checked === "true",
    );
    markdown = await page.evaluate(() =>
      window.learningExportMarkdown(document),
    );
    assert.match(markdown, /Retry after a crash[^\S\r\n]*\n> Reuse the operation key\./);
    assert.match(markdown, /worked explanation/);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    console.log(
      "Browser checks passed: feedback, hints, lesson disclosure, chat handoff, choice/written export, fallback/download, mobile width.",
    );
  } finally {
    if (browser) await browser.close();
    rmSync(root, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
