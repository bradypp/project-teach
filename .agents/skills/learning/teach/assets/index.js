/* Plain HTML controls: no storage, network requests, or learning-state writes. */
(function () {
  "use strict";
  function text(node) {
    return node ? node.textContent.trim().replace(/\s+/g, " ") : "";
  }
  function markdown(value) {
    return value.replace(/[\\`*_{}\[\]<>#|]/g, "\\$&");
  }
  function exportMarkdown(doc) {
    const lines = [
      "# " + markdown(doc.title),
      "",
      "Optional practice notes; these are not a learning assessment.",
      "",
    ];
    doc
      .querySelectorAll("[data-question]:not(:disabled)")
      .forEach((question, index) => {
        const selected = question.querySelector('input[type="radio"]:checked');
        const written = question.querySelector("textarea");
        const answer = selected
          ? text(selected.closest("label"))
          : written
            ? written.value.trim()
            : "";
        const checked = question.dataset.checked === "true";
        lines.push(
          "## " +
            (index + 1) +
            ". " +
            markdown(text(question.querySelector("legend"))),
          "",
          "- Answer: " +
            (answer ? markdown(answer).replace(/\n/g, "\n  ") : "Not answered"),
          "- Feedback viewed: " + (checked ? "yes" : "no"),
          "- Hint revealed: " +
            (question.dataset.hintSeen === "true" ? "yes" : "no"),
        );
        if (checked)
          lines.push(
            "- Feedback: " +
              markdown(text(question.querySelector("[data-feedback]"))),
            "",
            markdown(text(question.querySelector("[data-explanation]"))),
          );
        lines.push("");
      });
    return lines.join("\n");
  }
  // Exposed for small automated browser checks and optional topic-specific controls.
  window.learningExportMarkdown = exportMarkdown;
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
      link.download = "quiz-answers.md";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = "Markdown download requested.";
    });
})();
