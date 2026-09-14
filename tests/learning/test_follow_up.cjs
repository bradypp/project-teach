// Regression checks for the compact follow-up handoff on static learning pages.
const { chromium } = require("playwright");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const assert = require("node:assert/strict");

(async () => {
  const root = mkdtempSync(join(tmpdir(), "learning follow-up-"));
  const helper = resolve(
    ".agents/skills/learning/teach/scripts/library.py",
  );
  let browser;
  try {
    const create = (kind, slug, title, tags) => {
      const args = [helper, "new", root, kind, slug, "--title", title];
      if (tags) args.push("--tags", tags);
      execFileSync("python3", args);
      const folder = ["reference", "glossary", "resource"].includes(kind)
        ? "references"
        : kind === "research"
          ? "research"
          : `${kind}s`;
      return join(root, folder, `${slug}.html`);
    };
    const pages = [
      {
        kind: "lesson",
        title: "Queues & limits",
        topics: "queues, reliability",
        file: create(
          "lesson",
          "queues-and-limits",
          "Queues & limits",
          "queues,reliability",
        ),
      },
      {
        kind: "topic",
        title: "Reliable delivery",
        file: create("topic", "reliable-delivery", "Reliable delivery"),
      },
      {
        kind: "reference",
        title: "Retry checklist",
        topics: "retries",
        file: create(
          "reference",
          "retry-checklist",
          "Retry checklist",
          "retries",
        ),
      },
      {
        kind: "resource",
        title: "Useful sources",
        topics: "resource",
        file: create("resource", "resources", "Useful sources"),
      },
      {
        kind: "research",
        title: "Retry ownership",
        topics: "architecture, evidence",
        file: create(
          "research",
          "retry-ownership",
          "Retry ownership",
          "architecture,evidence",
        ),
      },
    ];
    const glossary = create("glossary", "glossary", "Terms");

    browser = await chromium.launch({
      headless: true,
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
    });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const item of pages) {
      await page.goto(pathToFileURL(item.file).href);
      assert.equal(
        await page.locator("[data-chat] .button-label").textContent(),
        "Copy follow-up",
      );
      assert.equal(
        await page.locator("[data-copy]").getAttribute("class"),
        "secondary",
      );
      const markdown = await page.evaluate(() =>
        window.learningExportMarkdown(document),
      );
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async (value) => {
              window.copiedFollowUp = value;
            },
          },
        }),
      );
      await page.locator("[data-chat]").click();
      const lines = [
        "Use the `teach` skill to help me explore this existing material more deeply.",
        "",
        `Type: ${item.kind}`,
        `Title: ${item.title}`,
      ];
      if (item.topics) lines.push(`Topics: ${item.topics}`);
      lines.push(`Local file: ${item.file}`);
      assert.equal(
        await page.evaluate(() => window.copiedFollowUp),
        lines.join("\n"),
      );
      assert.equal(
        await page.locator("[data-export-status]").textContent(),
        "Follow-up copied. Paste it into chat.",
      );
      assert.equal(
        await page.evaluate(() => window.learningExportMarkdown(document)),
        markdown,
      );
    }

    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => { throw new Error("blocked"); } },
      }),
    );
    await page.locator("[data-chat]").click();
    assert.equal(await page.locator("#export-text").isVisible(), true);
    assert.match(
      await page.locator("#export-text").inputValue(),
      /Local file: .*learning follow-up-.*resources\.html/,
    );
    assert.equal(
      await page.locator(".export-fallback label").textContent(),
      "Select the text below, copy it, then paste it into chat.",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
    );

    await page.goto(pathToFileURL(glossary).href);
    assert.equal(await page.locator("[data-chat]").count(), 0);
    await page.goto(pathToFileURL(join(root, "index.html")).href);
    assert.equal(await page.locator(".notebook-tools").count(), 0);
    assert.deepEqual(errors, []);
    console.log(
      "Follow-up checks passed: page kinds, prompt details, decoded path, missing tags, fallback, export, mobile width.",
    );
  } finally {
    if (browser) await browser.close();
    rmSync(root, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
