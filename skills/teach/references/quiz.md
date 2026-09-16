# Quiz practice

Read when composing quizzes, exercises embedded in other learning pages, or custom practice interactions. [Artifact guidance](artifacts.md#markdown-export) owns the shared export contract; [visual language](visual-language.md) owns general page composition and theme tokens.

## Practice components

| Template | Compose and adapt |
| --- | --- |
| [choice-question.html](../assets/templates/choice-question.html) | A quick-fire choice with one radio group, exactly one `data-correct="true"` option, feedback and a hidden explanation. Enable after authoring. Add a labelled textarea when the reason matters. |
| [open-question.html](../assets/templates/open-question.html) | A short reflection with revealable worked reasoning and comparison criteria. `response-short` keeps the writing area compact; omit it for longer reasoning. |
| [multi-step-question.html](../assets/templates/multi-step-question.html) | A shared setup followed by independently checkable steps and an optional final synthesis. Adapt the sample calculations and keys together. |
| [scenario-question.html](../assets/templates/scenario-question.html) | A narrative, optional context blocks/diagram and choice or written response sections. Keep only aids that expose useful evidence; put answer-bearing aids with feedback. |
| [visual-experiment.html](../assets/templates/visual-experiment.html) | An adaptable queue model with prediction, labelled sliders, an explicit run, a plot and a textual result. Its behavior is scoped by `data-queue-experiment` in `components.js`. For another mechanism, build a bespoke widget using the same response/export conventions. |

### Response boundaries and feedback

- Give each independently assessed response its own `data-question` container, usually a fieldset with a legend. Group related responses in a semantic section with `practice-group`; avoid making that outer group another question. The group can include context and diagrams without merging answer keys or disclosure state.
- Use unique IDs and radio names across the entire page. Each choice question owns one `data-check` button, `data-feedback` region and `data-explanation`; steps can mix choice and written responses without gating navigation.
- Written responses and experiments use `details[data-self-check]` containing `data-explanation`. Put nudges in `details[data-hint]`. These track whether feedback or hints have been viewed, including after closing them. Editing a response retains that disclosure history.
- Use `type="button"` for widget actions inside quiz forms. A custom feedback control should set its question's `data-checked="true"` when revealing reasoning; keep answer-bearing content inside `data-explanation` until then.

### Custom puzzles and experiments

- Provide keyboard-operable controls and labelled text alternatives for spatial actions such as dragging or clicking a diagram. Keep a useful static explanation or on-paper version when JavaScript is unavailable.
- Keep prediction and reflection in labelled inputs. Expose the current settings and latest result in semantic HTML, or maintain the additive `data-export-summary` snapshot described in the [export contract](artifacts.md#markdown-export). Identify the settings used for a previous result if current controls have changed.
- Give visuals an accessible label or caption. Export their textual meaning; mark only duplicated graphics or decoration `data-export-ignore`. Record action history only when order matters to the concept, not as routine telemetry.
