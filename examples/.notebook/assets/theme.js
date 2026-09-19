/* Apply appearance and palette before paint. Storage is best-effort; links carry overrides. */
(function () {
  const paletteLabels = {
    parchment: "Parchment",
    ocean: "Ocean",
    forest: "Forest",
    plum: "Plum",
    graphite: "Graphite",
  };
  const validAppearance = (value) => ["light", "dark", "system"].includes(value);
  const validPalette = (value) => Object.hasOwn(paletteLabels, value);
  const parameters = new URL(location.href).searchParams;
  const appearanceQuery = parameters.get("theme");
  const paletteQuery = parameters.get("palette");
  const configuredDefault = getComputedStyle(document.documentElement)
    .getPropertyValue("--teach-default-palette")
    .trim()
    .replace(/^['"]|['"]$/g, "");
  const defaultPalette = validPalette(configuredDefault)
    ? configuredDefault
    : null;
  let appearance = "system";
  let palettePreference = null;
  try {
    appearance = localStorage.getItem("teach-theme") || appearance;
    const storedPalette = localStorage.getItem("teach-palette");
    if (validPalette(storedPalette)) palettePreference = storedPalette;
    else if (storedPalette) localStorage.removeItem("teach-palette");
  } catch (_) {}
  if (validAppearance(appearanceQuery)) appearance = appearanceQuery;
  if (validPalette(paletteQuery)) palettePreference = paletteQuery;
  if (!validAppearance(appearance)) appearance = "system";
  const media = matchMedia("(prefers-color-scheme: dark)");

  function withoutTransitions(change) {
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.append(style);
    change();
    if (document.body) void document.body.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
  }

  function dispatchChange() {
    window.dispatchEvent(new Event("teach-theme-change"));
  }

  function applyAppearance(value, suppressTransitions) {
    const change = () => {
      appearance = validAppearance(value) ? value : "system";
      document.documentElement.dataset.theme =
        appearance === "system"
          ? media.matches
            ? "dark"
            : "light"
          : appearance;
      try {
        localStorage.setItem("teach-theme", appearance);
      } catch (_) {}
      dispatchChange();
    };
    if (suppressTransitions && document.body) withoutTransitions(change);
    else change();
  }

  function activePalette() {
    return palettePreference || defaultPalette;
  }

  function applyPalette(value, suppressTransitions, persist) {
    if (!defaultPalette) return;
    const change = () => {
      palettePreference = validPalette(value) ? value : null;
      document.documentElement.dataset.palette = activePalette();
      if (persist) {
        try {
          if (palettePreference)
            localStorage.setItem("teach-palette", palettePreference);
          else localStorage.removeItem("teach-palette");
        } catch (_) {}
      }
      dispatchChange();
    };
    if (suppressTransitions && document.body) withoutTransitions(change);
    else change();
  }

  window.teachTheme = {
    get: () => appearance,
    set: (value) => {
      applyAppearance(value, true);
      const url = new URL(location.href);
      url.searchParams.set("theme", appearance);
      try {
        history.replaceState(null, "", url);
      } catch (_) {}
    },
    palettes: Object.entries(paletteLabels).map(([id, label]) => ({ id, label })),
    hasPaletteMenu: () => Boolean(defaultPalette),
    getPalette: activePalette,
    getPalettePreference: () => palettePreference,
    getDefaultPalette: () => defaultPalette,
    setPalette: (value) => {
      applyPalette(value, true, true);
      const url = new URL(location.href);
      if (palettePreference) url.searchParams.set("palette", palettePreference);
      else url.searchParams.delete("palette");
      try {
        history.replaceState(null, "", url);
      } catch (_) {}
    },
  };

  if (defaultPalette) applyPalette(palettePreference, false, false);
  applyAppearance(appearance, false);
  media.addEventListener("change", () => {
    if (appearance === "system") applyAppearance(appearance, true);
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      link.hasAttribute("download") ||
      link.getAttribute("href").startsWith("#")
    )
      return;
    const url = new URL(link.href);
    const sameProtocol = url.protocol === location.protocol;
    const sameHost = url.host === location.host;
    const isHtml = url.pathname.endsWith(".html");
    if (sameProtocol && sameHost && isHtml) {
      url.searchParams.set("theme", appearance);
      if (palettePreference) url.searchParams.set("palette", palettePreference);
      else url.searchParams.delete("palette");
      link.href = url.href;
    }
  });
})();
