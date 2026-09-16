/* Apply before paint. Local-file storage is best-effort; links carry the choice. */
(function () {
  const valid = (value) => ["light", "dark", "system"].includes(value);
  const query = new URL(location.href).searchParams.get("theme");
  let preference = "system";
  try {
    preference = localStorage.getItem("teach-theme") || preference;
  } catch (_) {}
  if (valid(query)) preference = query;
  if (!valid(preference)) preference = "system";
  const media = matchMedia("(prefers-color-scheme: dark)");
  function withoutTransitions(change) {
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.append(style);
    change();
    if (document.body) void document.body.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
  }
  function apply(value, suppressTransitions) {
    const change = () => {
      preference = valid(value) ? value : "system";
      document.documentElement.dataset.theme =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      try {
        localStorage.setItem("teach-theme", preference);
      } catch (_) {}
      window.dispatchEvent(new Event("teach-theme-change"));
    };
    if (suppressTransitions && document.body) withoutTransitions(change);
    else change();
  }
  window.teachTheme = {
    get: () => preference,
    set: (value) => {
      apply(value, true);
      const url = new URL(location.href);
      url.searchParams.set("theme", preference);
      try {
        history.replaceState(null, "", url);
      } catch (_) {}
    },
  };
  media.addEventListener("change", () => {
    if (preference === "system") apply(preference, true);
  });
  apply(preference, false);
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
      url.searchParams.set("theme", preference);
      link.href = url.href;
    }
  });
})();
