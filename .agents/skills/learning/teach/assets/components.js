/* Optional components use the notebook tokens; page layout stays flexible. */
(function () {
  "use strict";
  document
    .querySelectorAll('pre > code[class*="language-"]')
    .forEach((code) => {
      const language = [...code.classList]
        .find((name) => name.startsWith("language-"))
        .slice(9);
      if (language === "mermaid" || language === "text") return;
      const wrapper = document.createElement("div");
      wrapper.className = "code-block";
      code.parentElement.before(wrapper);
      const tools = document.createElement("div");
      tools.className = "code-tools";
      tools.dataset.exportUi = "";
      const label = document.createElement("span");
      label.textContent = language;
      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "secondary";
      copy.textContent = "Copy code";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copy.textContent = "Copied";
        } catch (_) {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          copy.textContent = "Code selected — copy manually";
        }
      });
      tools.append(label, copy);
      wrapper.append(tools, code.parentElement);
      if (window.hljs && hljs.getLanguage(language))
        hljs.highlightElement(code);
    });

  const diagrams = [...document.querySelectorAll("figure.diagram")]
    .map((figure) => {
      const source = figure.querySelector("pre.mermaid");
      if (!source) return null;
      const view = document.createElement("div");
      view.className = "diagram-view";
      source.before(view);
      figure.dataset.mermaidSource = source.textContent;
      return { figure, source, view };
    })
    .filter(Boolean);
  let sequence = 0;
  let chain = Promise.resolve();
  function renderDiagrams() {
    if (!diagrams.length || !window.mermaid) return;
    chain = chain
      .catch(() => {})
      .then(async () => {
        const css = getComputedStyle(document.documentElement);
        const token = (name) => css.getPropertyValue(name).trim();
        const ink = token("--ink"),
          surface = token("--surface"),
          accent = token("--accent"),
          soft = token("--soft");
        const colors = [
          accent,
          token("--code-keyword"),
          token("--code-string"),
          token("--code-number"),
          soft,
          surface,
        ];
        const variables = {
          darkMode: document.documentElement.dataset.theme === "dark",
          fontFamily: "system-ui, sans-serif",
          fontSize: "16px",
          background: token("--paper"),
          primaryColor: surface,
          primaryTextColor: ink,
          primaryBorderColor: accent,
          secondaryColor: soft,
          secondaryTextColor: ink,
          secondaryBorderColor: accent,
          tertiaryColor: soft,
          tertiaryTextColor: ink,
          lineColor: accent,
          textColor: ink,
          mainBkg: surface,
          nodeBorder: accent,
          clusterBkg: soft,
          clusterBorder: accent,
          edgeLabelBackground: surface,
          actorBkg: surface,
          actorBorder: accent,
          actorTextColor: ink,
          actorLineColor: accent,
          signalColor: ink,
          signalTextColor: ink,
          labelBoxBkgColor: surface,
          labelBoxBorderColor: accent,
          labelTextColor: ink,
          noteBkgColor: soft,
          noteTextColor: ink,
          noteBorderColor: accent,
          activationBkgColor: soft,
          activationBorderColor: accent,
          pieSectionTextColor: ink,
          pieTitleTextColor: ink,
          pieLegendTextColor: ink,
          pieStrokeColor: surface,
          xyChart: {
            backgroundColor: token("--paper"),
            titleColor: ink,
            xAxisLabelColor: ink,
            xAxisTitleColor: ink,
            xAxisTickColor: accent,
            xAxisLineColor: accent,
            yAxisLabelColor: ink,
            yAxisTitleColor: ink,
            yAxisTickColor: accent,
            yAxisLineColor: accent,
            plotColorPalette: colors.join(","),
          },
        };
        for (let i = 0; i < 12; i++)
          variables["pie" + (i + 1)] = colors[i % colors.length];
        for (let i = 0; i < 8; i++) {
          variables["git" + i] = colors[i % colors.length];
          variables["gitBranchLabel" + i] = ink;
        }
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: variables,
          flowchart: { htmlLabels: false, curve: "basis" },
          themeCSS: ".node rect, .node polygon { stroke-width: 1.5px; }",
        });
        for (const item of diagrams) {
          try {
            const { svg } = await mermaid.render(
              "notebook-diagram-" + ++sequence,
              item.figure.dataset.mermaidSource,
            );
            item.view.innerHTML = svg;
            item.source.hidden = true;
            item.figure.dataset.renderedTheme =
              document.documentElement.dataset.theme;
          } catch (_) {
            item.view.textContent =
              "Diagram could not render; source shown below.";
            item.view.classList.add("diagram-error");
            item.source.hidden = false;
          }
        }
      });
  }
  window.addEventListener("teach-theme-change", renderDiagrams);
  renderDiagrams();

  document.querySelectorAll("[data-page-tags]").forEach((container) => {
    const tags = [
      ...new Set(
        (document.querySelector('meta[name="tags"]')?.content || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];
    container.replaceChildren(
      ...tags.map((tag) => {
        const span = document.createElement("span");
        span.className = "subject-tag";
        span.textContent = tag;
        return span;
      }),
    );
    container.hidden = !tags.length;
  });
  let selected = "",
    selectedType = "";
  const sort = document.querySelector("#library-sort");
  function filterLibrary() {
    let count = 0;
    document.querySelectorAll("[data-library-section]").forEach((section) => {
      const entries = [...section.querySelectorAll(".library-entry")];
      entries.sort((a, b) =>
        sort.value === "title"
          ? a.dataset.title.localeCompare(b.dataset.title)
          : !a.dataset.created
            ? !b.dataset.created
              ? a.dataset.title.localeCompare(b.dataset.title)
              : 1
            : !b.dataset.created
              ? -1
              : (sort.value === "oldest" ? 1 : -1) *
                  a.dataset.created.localeCompare(b.dataset.created) ||
                a.dataset.title.localeCompare(b.dataset.title),
      );
      let visible = 0;
      entries.forEach((entry) => {
        entry.hidden =
          (selectedType && section.dataset.librarySection !== selectedType) ||
          (selected && !entry.dataset.tags.split(",").includes(selected));
        section.querySelector("ul").append(entry);
        if (!entry.hidden) visible++;
      });
      section.hidden = !visible;
      count += visible;
    });
    document
      .querySelectorAll("[data-tag]")
      .forEach((button) =>
        button.setAttribute("aria-pressed", button.dataset.tag === selected),
      );
    document
      .querySelectorAll("[data-type]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          button.dataset.type === selectedType,
        ),
      );
    const status = document.querySelector("[data-filter-status]");
    if (status)
      status.textContent = `${count} ${count === 1 ? "entry" : "entries"}`;
  }
  document.querySelectorAll("[data-tag]").forEach((button) =>
    button.addEventListener("click", () => {
      selected = button.dataset.tag;
      filterLibrary();
    }),
  );
  document.querySelectorAll("[data-type]").forEach((button) =>
    button.addEventListener("click", () => {
      selectedType = button.dataset.type;
      filterLibrary();
    }),
  );
  if (sort) {
    sort.addEventListener("change", filterLibrary);
    filterLibrary();
  }
})();
