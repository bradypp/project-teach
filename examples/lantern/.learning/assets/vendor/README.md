# Bundled Markdown conversion

MIT-licensed browser distributions, stored locally for offline use. Update deliberately and rerun export tests.

- turndown 7.2.4: https://registry.npmjs.org/turndown/-/turndown-7.2.4.tgz
  - SHA-256 of bundled JS: `c97187f436d41638bf7acf346a39d9d42f2f2c02af18245a297c09e796f8e46f`
- turndown-plugin-gfm 1.0.2: https://registry.npmjs.org/turndown-plugin-gfm/-/turndown-plugin-gfm-1.0.2.tgz
  - SHA-256 of bundled JS: `cf744cc1b7580f06d64ce236a4ff2630a53d389eccf2133a09d71ca443511912`

## Diagram and code bundles

Pinned local IIFE bundles, built with esbuild 0.28.2 (`--bundle --format=iife --minify`). Mermaid imports its default export; Highlight.js imports `highlight.js/lib/common`. Both expose their export on `window`.

- mermaid 11.17.2: `mermaid.js`, SHA-256 `b671ab9db82e3277f2147d5ea2838667b7f796464312ac70b75de3bde2647e09`. See the bundled license and preserved legal comments.
- highlight.js 11.12.0: `highlight.js`, SHA-256 `ff17885f8a6c3c82aaeac3d5b8d19dea8537ceca1e1cf9a7f592b3b0e7d276ed`. See the bundled license and preserved legal comments.
