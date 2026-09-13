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
      copy.innerHTML = `${window.learningNotebookUi.iconSwap("copy", "check")}<span class="button-label" data-default-label="Copy code">Copy code</span>`;
      const copyLabel = copy.querySelector(".button-label");
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          window.learningNotebookUi.setTemporarySuccess(
            copy,
            copyLabel,
            "Copied",
          );
        } catch (_) {
          const range = document.createRange();
          range.selectNodeContents(code);
          const selection = getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          copyLabel.textContent = "Selected — copy manually";
          clearTimeout(copy._notebookReset);
          copy._notebookReset = setTimeout(() => {
            copyLabel.textContent = copyLabel.dataset.defaultLabel;
          }, 2400);
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
  let initialAnchorAligned = false;
  function fitSingleLineSequenceNotes(view) {
    view.querySelectorAll('g[data-et="note"]').forEach((group) => {
      const rect = group.querySelector("rect.note");
      const lines = group.querySelectorAll("text.noteText");
      if (!rect || lines.length !== 1) return;
      try {
        const textBox = lines[0].getBBox();
        const padding = 10;
        const currentWidth = Number(rect.getAttribute("width"));
        const fittedWidth = textBox.width + padding * 2;
        if (fittedWidth >= currentWidth) return;
        rect.setAttribute("x", textBox.x - padding);
        rect.setAttribute("width", fittedWidth);
      } catch (_) {
        // Keep Mermaid's original geometry when SVG measurement is unavailable.
      }
    });
  }
  function renderDiagrams() {
    if (!diagrams.length || !window.mermaid) return;
    chain = chain
      .catch(() => {})
      .then(async () => {
        const css = getComputedStyle(document.documentElement);
        const token = (name) => css.getPropertyValue(name).trim();
        const ink = token("--ink"),
          surface = token("--surface"),
          secondary = token("--secondary"),
          soft = token("--surface-soft"),
          line = token("--line-strong");
        const colors = [
          token("--chart-1"),
          token("--chart-2"),
          token("--chart-3"),
          token("--chart-4"),
          token("--chart-5"),
        ];
        const variables = {
          darkMode: document.documentElement.dataset.theme === "dark",
          fontFamily: "system-ui, sans-serif",
          fontSize: "16px",
          background: token("--paper"),
          primaryColor: surface,
          primaryTextColor: ink,
          primaryBorderColor: line,
          secondaryColor: soft,
          secondaryTextColor: ink,
          secondaryBorderColor: line,
          tertiaryColor: soft,
          tertiaryTextColor: ink,
          tertiaryBorderColor: line,
          lineColor: secondary,
          textColor: ink,
          mainBkg: surface,
          nodeBorder: line,
          clusterBkg: soft,
          clusterBorder: line,
          edgeLabelBackground: surface,
          actorBkg: surface,
          actorBorder: line,
          actorTextColor: ink,
          actorLineColor: secondary,
          signalColor: ink,
          signalTextColor: ink,
          labelBoxBkgColor: surface,
          labelBoxBorderColor: line,
          labelTextColor: ink,
          noteBkgColor: soft,
          noteTextColor: ink,
          noteBorderColor: line,
          activationBkgColor: soft,
          activationBorderColor: line,
          pieSectionTextColor: ink,
          pieTitleTextColor: ink,
          pieLegendTextColor: ink,
          pieStrokeColor: surface,
          xyChart: {
            backgroundColor: token("--paper"),
            titleColor: ink,
            xAxisLabelColor: ink,
            xAxisTitleColor: ink,
            xAxisTickColor: line,
            xAxisLineColor: secondary,
            yAxisLabelColor: ink,
            yAxisTitleColor: ink,
            yAxisTickColor: line,
            yAxisLineColor: secondary,
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
          flowchart: {
            htmlLabels: false,
            curve: "basis",
            diagramPadding: 12,
            useMaxWidth: true,
          },
          sequence: {
            width: 175,
            wrap: true,
            useMaxWidth: true,
          },
          themeCSS:
            ".node rect, .node circle, .node ellipse, .node polygon, .node path { stroke-width: 1.5px; } .node rect, .cluster rect, .actor { rx: 10px; ry: 10px; } .edgePath path, .flowchart-link { stroke-width: 1.6px; } .label, .nodeLabel { font-weight: 600; }",
        });
        for (const item of diagrams) {
          try {
            const { svg } = await mermaid.render(
              "notebook-diagram-" + ++sequence,
              item.figure.dataset.mermaidSource,
            );
            item.view.innerHTML = svg;
            fitSingleLineSequenceNotes(item.view);
            const graphic = item.view.querySelector("svg");
            if (graphic) {
              graphic.setAttribute("role", "img");
              const caption = item.figure.querySelector("figcaption");
              if (caption)
                graphic.setAttribute("aria-label", caption.textContent.trim());
            }
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
        if (!initialAnchorAligned && location.hash) {
          initialAnchorAligned = true;
          requestAnimationFrame(() => {
            let id;
            try {
              id = decodeURIComponent(location.hash.slice(1));
            } catch (_) {
              id = location.hash.slice(1);
            }
            document.getElementById(id)?.scrollIntoView();
          });
        }
      });
  }
  window.addEventListener("teach-theme-change", renderDiagrams);
  renderDiagrams();

  const notebookHome =
    document.querySelector(".site-nav a")?.getAttribute("href") || "index.html";
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
        const link = document.createElement("a");
        const target = new URL(notebookHome, document.baseURI);
        target.searchParams.set("tag", tag);
        target.hash = "";
        link.href = target.href;
        link.className = "subject-tag";
        link.textContent = tag;
        link.setAttribute("aria-label", `Show ${tag} in my learning notebook`);
        return link;
      }),
    );
    container.hidden = !tags.length;
  });
  const filters = new URL(location.href).searchParams;
  let selected = filters.get("tag") || "",
    selectedType = filters.get("type") || "";
  const sort = document.querySelector("#library-sort");
  const sortMenu = document.querySelector("[data-sort-menu]");
  const sortOptions = [...document.querySelectorAll("[data-sort-option]")];
  let sortValue = sort?.dataset.sortValue || "newest";
  function syncFilterUrl() {
    if (!sort) return;
    const current = new URL(location.href);
    if (selected) current.searchParams.set("tag", selected);
    else current.searchParams.delete("tag");
    if (selectedType) current.searchParams.set("type", selectedType);
    else current.searchParams.delete("type");
    history.replaceState(null, "", current);
  }
  function filterLibrary() {
    let count = 0;
    document.querySelectorAll("[data-library-section]").forEach((section) => {
      const entries = [...section.querySelectorAll(".library-entry")];
      entries.sort((a, b) =>
        sortValue === "title"
          ? a.dataset.title.localeCompare(b.dataset.title)
          : !a.dataset.created
            ? !b.dataset.created
              ? a.dataset.title.localeCompare(b.dataset.title)
              : 1
            : !b.dataset.created
              ? -1
              : (sortValue === "oldest" ? 1 : -1) *
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
      syncFilterUrl();
      filterLibrary();
    }),
  );
  document.querySelectorAll("[data-type]").forEach((button) =>
    button.addEventListener("click", () => {
      selectedType = button.dataset.type;
      syncFilterUrl();
      filterLibrary();
    }),
  );
  if (sort) {
    const availableTags = [...document.querySelectorAll("[data-tag]")].map(
      (button) => button.dataset.tag,
    );
    const availableTypes = [...document.querySelectorAll("[data-type]")].map(
      (button) => button.dataset.type,
    );
    if (!availableTags.includes(selected)) selected = "";
    if (!availableTypes.includes(selectedType)) selectedType = "";
    syncFilterUrl();
    const sortRoot = sort.closest(".library-sort");
    const sortLabel = sort.querySelector("[data-sort-label]");
    if (!sortRoot || !sortMenu || !sortLabel || !sortOptions.length) {
      sortValue = sort.value || sortValue;
      sort.addEventListener("change", () => {
        sortValue = sort.value;
        filterLibrary();
      });
      filterLibrary();
      return;
    }
    const setSortOpen = (open, focusOption = false) => {
      sort.setAttribute("aria-expanded", open);
      sortMenu.hidden = !open;
      if (open && focusOption)
        (
          sortOptions.find(
            (option) => option.getAttribute("aria-checked") === "true",
          ) || sortOptions[0]
        )?.focus();
    };
    const chooseSort = (option) => {
      sortValue = option.dataset.sortValue;
      sort.dataset.sortValue = sortValue;
      sortLabel.textContent = option.textContent;
      sortOptions.forEach((item) =>
        item.setAttribute("aria-checked", item === option),
      );
      setSortOpen(false);
      filterLibrary();
      sort.focus();
    };
    sort.addEventListener("click", () =>
      setSortOpen(sort.getAttribute("aria-expanded") !== "true"),
    );
    sort.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setSortOpen(true, true);
      } else if (event.key === "Escape") setSortOpen(false);
    });
    sortOptions.forEach((option, index) => {
      option.addEventListener("click", () => chooseSort(option));
      option.addEventListener("keydown", (event) => {
        const last = sortOptions.length - 1;
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
          sortOptions[next].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          setSortOpen(false);
          sort.focus();
        }
      });
    });
    document.addEventListener("click", (event) => {
      if (!sortRoot.contains(event.target)) setSortOpen(false);
    });
    filterLibrary();
  }
})();
