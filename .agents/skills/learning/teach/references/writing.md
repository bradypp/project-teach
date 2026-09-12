# Writing for learning

Read before drafting explanations, practice, feedback or maintained Markdown. This is drafting guidance, not a separate editing workflow.

## Principles

- **Write for the task.** Lessons explain an idea; records preserve what happened and what it supports. Apply any explicit project preferences for personality and depth.
- **Keep the meaning.** Preserve scope, uncertainty, citations and technical details. Editing prose must not change commands, code, identifiers, configuration or link targets.
- **Make the mechanism concrete.** Use an accurate project example or a clearly labelled hypothetical. Never invent measurements or learner achievements to make a sentence more persuasive.
- **Preserve useful character.** Keep a telling analogy, honest qualification or enjoyable aside when it helps the learner. Formality is not the goal.
- **Explain precisely.** Introduce necessary terminology and reuse it consistently. Shorten tangled wording without stripping away the distinction being taught.
- **Use structure deliberately.** Headings, bullets and tables should help someone find or compare information. Sentence length and paragraph shape should follow the explanation.

## Patterns

- **Delayed openings:** Start with the content when an introduction adds nothing. “Let’s explore the fascinating world of retries” becomes “A retry repeats an operation after a failure.” Keep a short problem setup when the learner needs it.
- **Inflated importance:** Explain a consequence instead of announcing significance. “Idempotency is a transformative capability” becomes “An idempotency key lets the worker recognise a repeated operation.”
- **Imaginary objections:** Compare real alternatives or correct an actual misconception. “This is not about speed. It is about reliability” becomes “Retries can improve completion rates, but repeated side effects need handling.”
- **Empty explanation:** Replace a trailing claim of importance with a causal connection. “The worker uses a queue, highlighting its resilience” becomes “The queue retains work while the worker is unavailable,” only when the queue actually provides that behaviour.
- **Borrowed authority:** Name the source and its specific claim. Replace “Experts recommend this architecture” with a supported explanation or an explicitly reasoned recommendation; never manufacture a citation.
- **Vague verbs:** Say what acts and what happens. “The cache serves as an optimisation layer” becomes “The cache stores results for reuse.” Active voice often clarifies the actor; ordinary technical phrasing such as “the function returns” is useful.
- **Terminology drift:** Keep a precise name stable. Calling the same component a worker, executor and processor for variety can imply three different components. Use the glossary’s chosen term unless the technical distinction is intentional.
- **Repeated rhythm:** Avoid giving every paragraph an identical opening, three-item list or dramatic closing fragment. Preserve a real three-part mechanism or repeated practice prompt when the structure carries meaning.
- **Redundant framing:** A heading need not be restated in its first sentence, and a section need not end by repeating itself. “## Retry limits” can lead directly into the limit and its consequence. Keep a compact recap when it supports recall.
- **Stacked uncertainty:** Retain the actual limit without surrounding it with empty hedges. “You might perhaps possibly understand retries” becomes “You explained the retry loop; recovery after a crash remains untested.” The revised claim still needs evidence.
- **Decorative formatting:** Use emphasis sparingly and sentence-case headings. Keep lists when they improve scanning; do not impose bullets, bold labels or punctuation patterns on every paragraph.
- **Em dashes:** Do not use em dashes as a default rhythm crutch. In short copy, use none. In longer drafts, 1-2 are fine if they clearly beat commas, periods, or parentheses. No clusters or decorative dashes.

## Words and phrases

- Prefer direct wording: “use” over “utilize,” “can” over “has the ability to,” and “to” over “in order to.”
- Inspect habitual filler such as “it’s worth noting,” “at its core,” “fundamentally” and “importantly.” Retain only wording that changes the meaning or expresses real uncertainty.
- Replace vague praise such as “robust,” “powerful” or “seamless” with the behaviour or failure case intended. Keep established technical terms such as “robust statistics.”
- Treat punctuation and vocabulary as contextual choices, not blanket bans. Preserve quotations, accurate technical names and useful contrasts.
