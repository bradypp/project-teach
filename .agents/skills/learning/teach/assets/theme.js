/* Apply before paint. Local-file storage is best-effort; links carry the choice. */
(function () {
  const valid = value => ["light", "dark", "system"].includes(value);
  const query = new URL(location.href).searchParams.get("theme");
  let preference = "system";
  try { preference = localStorage.getItem("teach-theme") || preference; } catch (_) {}
  if (valid(query)) preference = query;
  if (!valid(preference)) preference = "system";
  const media = matchMedia("(prefers-color-scheme: dark)");
  function apply(value) {
    preference = valid(value) ? value : "system";
    document.documentElement.dataset.theme = preference === "system"
      ? (media.matches ? "dark" : "light") : preference;
    try { localStorage.setItem("teach-theme", preference); } catch (_) {}
  }
  window.teachTheme = { get: () => preference, set: value => {
    apply(value);
    const url = new URL(location.href);
    url.searchParams.set("theme", preference);
    try { history.replaceState(null, "", url); } catch (_) {}
  } };
  media.addEventListener("change", () => { if (preference === "system") apply(preference); });
  apply(preference);
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.getAttribute("href").startsWith("#")) return;
    const url = new URL(link.href);
    if (url.protocol === location.protocol && url.host === location.host && /\.html$/.test(url.pathname)) {
      url.searchParams.set("theme", preference);
      link.href = url.href;
    }
  });
})();
