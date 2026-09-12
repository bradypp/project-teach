/* Shared notebook controls. Only theme preference is stored; learning files stay untouched. */
(function () {
  "use strict";
  function text(node) {
    return node ? node.textContent.trim().replace(/\s+/g, " ") : "";
  }
  function exportMarkdown(doc) {
    const original = doc.querySelector("main") || doc.body;
    const copy = original.cloneNode(true);
    // Clone the live values before removing any controls from the export.
    const inputs = original.querySelectorAll("textarea,input,select");
    copy.querySelectorAll("textarea,input,select").forEach((node, index) => {
      const live = inputs[index];
      const replacement = doc.createElement(
        live.tagName === "TEXTAREA" ? "blockquote" : "span",
      );
      replacement.textContent = ["radio", "checkbox"].includes(live.type)
        ? live.checked
          ? "[selected] "
          : "[ ] "
        : live.value || "Not answered";
      if (live.tagName === "TEXTAREA") {
        replacement.textContent = "";
        (live.value || "Not answered").split("\n").forEach((line, index) => {
          if (index) replacement.append(doc.createElement("br"));
          replacement.append(doc.createTextNode(line));
        });
      }
      node.replaceWith(replacement);
    });
    const questions = original.querySelectorAll("[data-question]");
    copy.querySelectorAll("[data-question]").forEach((question, index) => {
      const source = questions[index];
      if (source.disabled) {
        question.remove();
        return;
      }
      const viewed = source.dataset.checked === "true";
      const hintSeen = source.dataset.hintSeen === "true";
      if (!viewed)
        question
          .querySelectorAll("[data-explanation]")
          .forEach((node) => node.remove());
      if (!hintSeen)
        question
          .querySelectorAll("[data-hint]")
          .forEach((node) => node.remove());
      const status = doc.createElement("p");
      status.textContent = `Feedback viewed: ${viewed ? "yes" : "no"}; Hint revealed: ${hintSeen ? "yes" : "no"}`;
      question.append(status);
      const legend = question.querySelector("legend");
      if (legend) {
        const heading = doc.createElement("h2");
        heading.textContent = text(legend);
        legend.replaceWith(heading);
      }
    });
    copy
      .querySelectorAll(
        "[hidden], [data-export-ui], [data-export-ignore], nav, button, script, style",
      )
      .forEach((node) => node.remove());
    copy.querySelectorAll("[data-export-text], svg, canvas").forEach((node) => {
      if (!copy.contains(node)) return;
      const paragraph = doc.createElement("p");
      paragraph.textContent =
        node.getAttribute("data-export-text") ||
        node.getAttribute("aria-label") ||
        "Interactive visual: see the original HTML page.";
      node.replaceWith(paragraph);
    });
    copy.querySelectorAll("a[href],img[src]").forEach((node) => {
      const attribute = node.tagName === "A" ? "href" : "src";
      const url = new URL(node.getAttribute(attribute), doc.baseURI);
      if (url.protocol === "file:" || url.origin === location.origin)
        url.searchParams.delete("theme");
      node.setAttribute(attribute, url.href);
    });
    const converter = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    converter.use(turndownPluginGfm.gfm);
    const title = copy.querySelector("h1") ? "" : `# ${doc.title}\n\n`;
    return title + converter.turndown(copy) + "\n";
  }
  window.learningExportMarkdown = exportMarkdown;

  const toolbar = document.createElement("aside");
  toolbar.className = "notebook-tools";
  toolbar.dataset.exportUi = "";
  toolbar.setAttribute("aria-label", "Notebook tools");
  toolbar.innerHTML = `<div class="actions"><button type="button" data-copy>Copy Markdown</button><button type="button" class="secondary" data-download>Save Markdown</button></div>
    <p data-export-status role="status"></p><div class="export-fallback" hidden><label for="export-text">Select and copy</label><textarea id="export-text" readonly></textarea></div>`;
  document.body.append(toolbar);
  let navigation = document.querySelector(".site-nav");
  if (!navigation) {
    navigation = document.createElement("nav");
    navigation.className = "site-nav";
    navigation.setAttribute("aria-label", "Notebook");
    document.body.insertBefore(navigation, document.querySelector("main"));
  }
  const themes = document.createElement("div");
  themes.className = "theme-controls";
  themes.dataset.exportUi = "";
  themes.innerHTML = `<button type="button" class="secondary" data-theme-toggle></button><button type="button" class="secondary" data-theme-system>Use system</button>`;
  navigation.append(themes);
  const toggle = themes.querySelector("[data-theme-toggle]");
  const system = themes.querySelector("[data-theme-system]");
  function showTheme() {
    const dark = document.documentElement.dataset.theme === "dark";
    toggle.textContent = dark ? "Light mode" : "Dark mode";
    toggle.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
    system.hidden = window.teachTheme.get() === "system";
  }
  toggle.addEventListener("click", () =>
    window.teachTheme.set(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    ),
  );
  system.addEventListener("click", () => window.teachTheme.set("system"));
  window.addEventListener("teach-theme-change", showTheme);
  showTheme();
  document.querySelectorAll("[data-self-check]").forEach((reveal) =>
    reveal.addEventListener("toggle", () => {
      if (reveal.open)
        reveal.closest("[data-question]").dataset.checked = "true";
    }),
  );
  document.querySelectorAll("[data-hint]").forEach((hint) =>
    hint.addEventListener("toggle", () => {
      if (hint.open) hint.closest("[data-question]").dataset.hintSeen = "true";
    }),
  );
  document.querySelectorAll("[data-check]").forEach((button) =>
    button.addEventListener("click", () => {
      const question = button.closest("[data-question]");
      const selected = question.querySelector('input[type="radio"]:checked');
      const feedback = question.querySelector("[data-feedback]");
      feedback.hidden = false;
      if (!selected) {
        feedback.textContent = "Choose an answer first.";
        return;
      }
      feedback.textContent =
        selected.dataset.correct === "true"
          ? "Yes — explore the reasoning below."
          : "Not quite — explore the reasoning below.";
      question.dataset.checked = "true";
      question.querySelector("[data-explanation]").hidden = false;
    }),
  );
  document.querySelectorAll("[data-question] input").forEach((input) =>
    input.addEventListener("change", () => {
      const question = input.closest("[data-question]");
      // Keep disclosure visible and retain that the learner has seen the solution.
      if (question.dataset.checked === "true") {
        question.querySelector("[data-feedback]").textContent =
          "Answer changed after viewing feedback. Check again to compare.";
      }
    }),
  );
  const status = document.querySelector("[data-export-status]");
  const copy = document.querySelector("[data-copy]");
  if (copy)
    copy.addEventListener("click", async () => {
      const value = exportMarkdown(document);
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = "Copied as Markdown.";
      } catch (_) {
        const fallback = document.querySelector(".export-fallback");
        const area = fallback.querySelector("textarea");
        fallback.hidden = false;
        area.value = value;
        area.focus();
        area.select();
        status.textContent =
          "Your browser needs a manual copy: use the selected text below.";
      }
    });
  const download = document.querySelector("[data-download]");
  if (download)
    download.addEventListener("click", () => {
      const url = URL.createObjectURL(
        new Blob([exportMarkdown(document)], {
          type: "text/markdown;charset=utf-8",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download =
        (document.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "learning-notes") + ".md";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = "Markdown download requested.";
    });
})();
