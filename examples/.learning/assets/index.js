/* Shared notebook controls. Only theme preference is stored; learning files stay untouched. */
(function () {
  "use strict";
  const icons = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path></svg>',
    check:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5"></path></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z"></path></svg>',
    download:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"></path><path d="m7.5 11 4.5 4.5 4.5-4.5"></path><path d="M5 20h14"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M2.5 12h2M19.5 12h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"></path></svg>',
  };
  function icon(name) {
    return `<span class="button-icon" aria-hidden="true">${icons[name]}</span>`;
  }
  function iconSwap(defaultName, activeName) {
    return `<span class="icon-swap" aria-hidden="true"><span class="icon-default">${icons[defaultName]}</span><span class="icon-active">${icons[activeName]}</span></span>`;
  }
  function linkIcon(name) {
    return `<span class="notebook-link-icon" aria-hidden="true">${icons[name]}</span>`;
  }
  function setTemporarySuccess(button, label, successText) {
    if (!button) return;
    clearTimeout(button._notebookReset);
    button.classList.add("is-swapped");
    label.textContent = successText;
    button._notebookReset = setTimeout(() => {
      button.classList.remove("is-swapped");
      label.textContent = label.dataset.defaultLabel;
    }, 1800);
  }
  window.learningNotebookUi = { icon, iconSwap, setTemporarySuccess };
  function text(node) {
    return node ? node.textContent.trim().replace(/\s+/g, " ") : "";
  }
  // A response owns its feedback, even when an authored layout nests questions.
  function questionParts(question, selector) {
    return [...question.querySelectorAll(selector)].filter(
      (node) => node.closest("[data-question]") === question,
    );
  }
  function exportMarkdown(doc) {
    const original = doc.querySelector("main") || doc.body;
    const copy = original.cloneNode(true);
    // Clone the live values before removing any controls from the export.
    const inputs = original.querySelectorAll("textarea,input,select");
    copy.querySelectorAll("textarea,input,select").forEach((node, index) => {
      const live = inputs[index];
      if (
        ["hidden", "button", "submit", "reset"].includes(live.type) ||
        live.matches("[hidden], [data-export-ignore], [data-export-ui]")
      ) {
        node.remove();
        return;
      }
      const replacement = doc.createElement(
        live.tagName === "TEXTAREA" ? "blockquote" : "span",
      );
      replacement.dataset.exportResponse = "";
      replacement.textContent = ["radio", "checkbox"].includes(live.type)
        ? live.checked
          ? "[selected] "
          : "[ ] "
        : live.tagName === "SELECT"
          ? [...live.selectedOptions]
              .map((option) => text(option))
              .join(", ") || "Not answered"
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
    [...copy.querySelectorAll("[data-question]")]
      .reverse()
      .forEach((question, reverseIndex) => {
        const index = questions.length - 1 - reverseIndex;
        const source = questions[index];
        if (source.matches(":disabled")) {
          question.remove();
          return;
        }
        const viewed =
          source.dataset.checked === "true" ||
          questionParts(source, "[data-self-check][open]").length > 0;
        const hintSeen =
          source.dataset.hintSeen === "true" ||
          questionParts(source, "[data-hint][open]").length > 0;
        if (!viewed)
          questionParts(question, "[data-explanation]").forEach((node) =>
            node.remove(),
          );
        if (!hintSeen)
          questionParts(question, "[data-hint]").forEach((node) =>
            node.remove(),
          );
        const status = doc.createElement("p");
        status.textContent = `Feedback viewed: ${viewed ? "yes" : "no"}; Hint revealed: ${hintSeen ? "yes" : "no"}`;
        if (source.dataset.answerChanged === "true")
          status.textContent += "; Response changed after feedback: yes";
        question.append(status);
        const legend = questionParts(question, "legend")[0];
        if (legend) {
          const heading = doc.createElement("h2");
          heading.textContent = text(legend);
          legend.replaceWith(heading);
        }
      });
    copy.querySelectorAll("[data-mermaid-source]").forEach((figure) => {
      const pre = doc.createElement("pre");
      const code = doc.createElement("code");
      code.className = "language-mermaid";
      code.textContent = figure.dataset.mermaidSource;
      pre.append(code);
      const caption = figure.querySelector("figcaption");
      figure.replaceChildren(pre, ...(caption ? [caption] : []));
      figure.removeAttribute("data-export-text");
    });
    copy
      .querySelectorAll(
        "[hidden], [data-export-ui], [data-export-ignore], nav, button, script, style",
      )
      .forEach((node) => node.remove());
    // Additive snapshots retain surrounding prompts, responses and captions.
    copy.querySelectorAll("[data-export-summary]").forEach((node) => {
      const paragraph = doc.createElement("p");
      paragraph.textContent = node.dataset.exportSummary;
      node.prepend(paragraph);
    });
    copy.querySelectorAll("[data-export-text], svg, canvas").forEach((node) => {
      if (!copy.contains(node)) return;
      const paragraph = doc.createElement("p");
      paragraph.textContent =
        node.getAttribute("data-export-text") ||
        node.getAttribute("aria-label") ||
        "Interactive visual: see the original HTML page.";
      if (
        node.querySelector("[data-export-response], [data-question], output")
      ) {
        // Older custom widgets may put a replacement fallback around answers.
        // Retain their semantic content instead of discarding those responses.
        node.prepend(paragraph);
        node
          .querySelectorAll("svg, canvas")
          .forEach((visual) => visual.remove());
      } else {
        node.replaceWith(paragraph);
      }
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

  function quizChatMarkdown(doc) {
    return `Please review my responses to [${doc.title}](${localFilePath(doc)}). Give me feedback on my reasoning, then ask 1-3 useful follow-up questions.\n\n${exportMarkdown(doc)}`;
  }
  function localFilePath(doc) {
    const url = new URL(doc.location.href);
    let path = decodeURIComponent(url.pathname);
    if (/^\/[a-z]:\//i.test(path)) path = path.slice(1);
    return url.host ? `//${url.host}${path}` : path;
  }
  function followUpChatPrompt(doc, pageKind) {
    const lines = [
      "Use the `teach` skill to help me explore this existing material more deeply.",
      "",
      `Type: ${pageKind}`,
      `Title: ${doc.title.trim().replace(/\s+/g, " ")}`,
    ];
    const topics = (doc.querySelector('meta[name="tags"]')?.content || "")
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);
    if (topics.length) lines.push(`Topics: ${topics.join(", ")}`);
    lines.push(`Local file: ${localFilePath(doc)}`);
    return lines.join("\n");
  }
  function showManualCopy(value, message) {
    const fallback = document.querySelector(".export-fallback");
    const label = fallback.querySelector("label");
    const area = fallback.querySelector("textarea");
    fallback.hidden = false;
    label.textContent = message;
    area.value = value;
    area.focus();
    area.select();
    status.textContent = message;
  }

  const toolbar = document.createElement("aside");
  toolbar.className = "notebook-tools";
  toolbar.dataset.exportUi = "";
  toolbar.setAttribute("aria-label", "Notebook tools");
  const pageKind = document.body.dataset.pageKind;
  const isQuiz = pageKind === "quiz";
  const hasFollowUp = ["lesson", "topic", "reference", "resource", "research"].includes(
    pageKind,
  );
  const chatAction = isQuiz
    ? `<button type="button" data-chat>${iconSwap("chat", "check")}<span class="button-label" data-default-label="Copy for chat">Copy for chat</span></button>`
    : hasFollowUp
      ? `<button type="button" data-chat>${iconSwap("chat", "check")}<span class="button-label" data-default-label="Copy follow-up">Copy follow-up</span></button>`
      : "";
  toolbar.innerHTML = `<div class="actions">${chatAction}<button type="button"${isQuiz || hasFollowUp ? ' class="secondary"' : ""} data-copy>${iconSwap("copy", "check")}<span class="button-label" data-default-label="Copy Markdown">Copy Markdown</span></button><button type="button" class="secondary" data-download>${icon("download")}<span class="button-label">Save Markdown</span></button></div>
    <p data-export-status role="status"></p><div class="export-fallback" hidden><label for="export-text">Select and copy</label><textarea id="export-text" readonly></textarea></div>`;
  const home = document.createElement("a");
  home.href =
    document.querySelector(".site-nav a")?.getAttribute("href") || "index.html";
  home.innerHTML = `${linkIcon("back")}<span>My learning notebook</span>`;
  const row = document.createElement("div");
  row.className = "tools-row";
  row.append(home, toolbar.querySelector(".actions"));
  toolbar.prepend(row);
  if (!document.body.hasAttribute("data-notebook-home"))
    document.body.append(toolbar);
  let navigation = document.querySelector(".site-nav");
  if (!navigation) {
    navigation = document.createElement("nav");
    navigation.className = "site-nav";
    navigation.setAttribute("aria-label", "Notebook");
    document.body.insertBefore(navigation, document.querySelector("main"));
  }
  const existingHome = navigation.querySelector("a");
  if (existingHome?.textContent.trim().startsWith("←"))
    existingHome.textContent = existingHome.textContent
      .trim()
      .replace(/^←\s*/, "");
  if (existingHome && !existingHome.querySelector(".notebook-link-icon"))
    existingHome.insertAdjacentHTML("afterbegin", linkIcon("back"));
  if (!navigation.querySelector("a, .notebook-mark")) {
    const mark = document.createElement("span");
    mark.className = "notebook-mark";
    mark.textContent = "Personal learning notebook";
    navigation.append(mark);
  }
  const themes = document.createElement("div");
  themes.className = "theme-controls";
  themes.dataset.exportUi = "";
  const paletteMenu = window.teachTheme.hasPaletteMenu()
    ? `<div class="palette-picker" data-palette-picker>
        <button type="button" class="secondary" id="palette-menu-button" data-palette-button aria-label="Choose notebook palette" aria-haspopup="menu" aria-expanded="false" aria-controls="palette-menu">
          <span data-palette-label></span><span class="sort-chevron" aria-hidden="true"></span>
        </button>
        <div class="palette-menu" id="palette-menu" data-palette-menu role="menu" hidden>
          <button type="button" class="palette-option" data-palette-option data-palette-value="" role="menuitemradio" aria-checked="false">Project default</button>
          ${window.teachTheme.palettes.map(({ id, label }) => `<button type="button" class="palette-option" data-palette-option data-palette-value="${id}" role="menuitemradio" aria-checked="false">${label}</button>`).join("")}
        </div>
      </div>`
    : "";
  themes.innerHTML = `${paletteMenu}<button type="button" class="secondary skip-icon-transition" data-theme-toggle>${iconSwap("moon", "sun")}</button>`;
  navigation.append(themes);
  const toggle = themes.querySelector("[data-theme-toggle]");
  const paletteButton = themes.querySelector("[data-palette-button]");
  const paletteMenuElement = themes.querySelector("[data-palette-menu]");
  const paletteOptions = [
    ...themes.querySelectorAll("[data-palette-option]"),
  ];
  const paletteLabel = themes.querySelector("[data-palette-label]");
  const paletteName = (id) =>
    window.teachTheme.palettes.find((palette) => palette.id === id)?.label ||
    id;
  function setPaletteOpen(open, focusOption = false) {
    if (!paletteButton || !paletteMenuElement) return;
    paletteButton.setAttribute("aria-expanded", open);
    paletteMenuElement.hidden = !open;
    if (open && focusOption)
      (
        paletteOptions.find(
          (option) => option.getAttribute("aria-checked") === "true",
        ) || paletteOptions[0]
      )?.focus();
  }
  function showPalette() {
    if (!paletteButton || !paletteLabel) return;
    const active = window.teachTheme.getPalette();
    const preference = window.teachTheme.getPalettePreference();
    const defaultName = paletteName(window.teachTheme.getDefaultPalette());
    paletteLabel.textContent = paletteName(active);
    paletteButton.setAttribute(
      "aria-label",
      `Choose notebook palette. Current: ${paletteName(active)}`,
    );
    paletteButton.title = `Palette: ${paletteName(active)}`;
    paletteOptions.forEach((option) => {
      if (!option.dataset.paletteValue)
        option.textContent = `Project default (${defaultName})`;
      option.setAttribute(
        "aria-checked",
        preference
          ? option.dataset.paletteValue === preference
          : option.dataset.paletteValue === "",
      );
    });
  }
  if (paletteButton && paletteMenuElement && paletteOptions.length) {
    paletteButton.addEventListener("click", () =>
      setPaletteOpen(paletteButton.getAttribute("aria-expanded") !== "true"),
    );
    paletteButton.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setPaletteOpen(true, true);
      } else if (event.key === "Escape") setPaletteOpen(false);
    });
    paletteOptions.forEach((option, index) => {
      option.addEventListener("click", () => {
        window.teachTheme.setPalette(option.dataset.paletteValue || null);
        setPaletteOpen(false);
        paletteButton.focus();
      });
      option.addEventListener("keydown", (event) => {
        const last = paletteOptions.length - 1;
        const next =
          event.key === "ArrowDown"
            ? Math.min(index + 1, last)
            : event.key === "ArrowUp"
              ? Math.max(index - 1, 0)
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? last
                  : -1;
        if (next >= 0) {
          event.preventDefault();
          paletteOptions[next].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          setPaletteOpen(false);
          paletteButton.focus();
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!themes.querySelector("[data-palette-picker]").contains(event.target))
        setPaletteOpen(false);
    });
  }
  function showTheme() {
    const dark = document.documentElement.dataset.theme === "dark";
    toggle.classList.toggle("is-swapped", dark);
    const label = dark ? "Switch to light theme" : "Switch to dark theme";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }
  toggle.addEventListener("click", () =>
    window.teachTheme.set(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    ),
  );
  window.addEventListener("teach-theme-change", () => {
    showTheme();
    showPalette();
  });
  showPalette();
  showTheme();
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      toggle.classList.remove("skip-icon-transition"),
    ),
  );
  let previousScroll = window.scrollY;
  let scrollFrame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        const change = currentScroll - previousScroll;
        if (currentScroll <= 24 || change < -6)
          navigation.classList.remove("is-scroll-hidden");
        else if (change > 6 && currentScroll > navigation.offsetHeight)
          navigation.classList.add("is-scroll-hidden");
        if (Math.abs(change) > 6 || currentScroll <= 24)
          previousScroll = currentScroll;
        scrollFrame = 0;
      });
    },
    { passive: true },
  );
  document.querySelectorAll("[data-self-check]").forEach((reveal) =>
    reveal.addEventListener("toggle", () => {
      const question = reveal.closest("[data-question]");
      if (reveal.open && question) question.dataset.checked = "true";
    }),
  );
  document.querySelectorAll("[data-hint]").forEach((hint) =>
    hint.addEventListener("toggle", () => {
      const question = hint.closest("[data-question]");
      if (hint.open && question) question.dataset.hintSeen = "true";
    }),
  );
  document.querySelectorAll("[data-check]").forEach((button) =>
    button.addEventListener("click", () => {
      const question = button.closest("[data-question]");
      if (!question) return;
      const selected = questionParts(
        question,
        'input[type="radio"]:checked',
      )[0];
      const feedback = questionParts(question, "[data-feedback]")[0];
      const explanation = questionParts(question, "[data-explanation]")[0];
      if (!feedback || !explanation) return;
      feedback.hidden = false;
      if (!selected) {
        feedback.textContent = "Choose an answer first.";
        feedback.dataset.state = "error";
        return;
      }
      const correct = selected.dataset.correct === "true";
      feedback.textContent = correct
        ? "Yes — explore the reasoning below."
        : "Not quite — explore the reasoning below.";
      feedback.dataset.state = correct ? "success" : "error";
      question.dataset.checked = "true";
      delete question.dataset.answerChanged;
      explanation.hidden = false;
    }),
  );
  document
    .querySelectorAll(
      "[data-question] input, [data-question] textarea, [data-question] select",
    )
    .forEach((input) => {
      const changed = () => {
        const question = input.closest("[data-question]");
        // Keep disclosure visible and retain that the learner has seen the solution.
        if (question.dataset.checked === "true") {
          question.dataset.answerChanged = "true";
          const feedback = questionParts(question, "[data-feedback]")[0];
          if (feedback) {
            feedback.textContent =
              "Answer changed after viewing feedback. Check again to compare.";
            feedback.dataset.state = "changed";
          }
        }
      };
      input.addEventListener("input", changed);
      input.addEventListener("change", changed);
    });
  document
    .querySelectorAll("form[data-quiz]")
    .forEach((form) =>
      form.addEventListener("submit", (event) => event.preventDefault()),
    );
  const status = document.querySelector("[data-export-status]");
  const chat = document.querySelector("[data-chat]");
  if (chat)
    chat.addEventListener("click", async () => {
      const value = isQuiz
        ? quizChatMarkdown(document)
        : followUpChatPrompt(document, pageKind);
      const successMessage = isQuiz
        ? "Quiz responses copied. Paste them into chat."
        : "Follow-up copied. Paste it into chat.";
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = successMessage;
        setTemporarySuccess(
          chat,
          chat.querySelector(".button-label"),
          "Copied",
        );
      } catch (_) {
        showManualCopy(
          value,
          "Select the text below, copy it, then paste it into chat.",
        );
      }
    });
  const copy = document.querySelector("[data-copy]");
  if (copy)
    copy.addEventListener("click", async () => {
      const value = exportMarkdown(document);
      try {
        await navigator.clipboard.writeText(value);
        status.textContent = "Copied as Markdown.";
        setTemporarySuccess(
          copy,
          copy.querySelector(".button-label"),
          "Copied",
        );
      } catch (_) {
        showManualCopy(
          value,
          "Your browser needs a manual copy: use the selected text below.",
        );
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
