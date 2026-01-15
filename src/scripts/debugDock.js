const serializeEntries = (entries) =>
  entries
    .map((entry) =>
      [`#${entry.index} · ${entry.source}: ${entry.message}`, entry.data ?? ""]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

const createEntry = (entry) => {
  const item = document.createElement("div");
  item.className = "debug-entry";

  const header = document.createElement("button");
  header.type = "button";
  header.className = "debug-entry-header";
  header.textContent = `#${entry.index} · ${entry.source}: ${entry.message}`;

  const pre = document.createElement("pre");
  pre.className = "debug-entry-data";
  pre.textContent = entry.data ?? "";
  pre.hidden = true;

  header.addEventListener("click", () => {
    pre.hidden = !pre.hidden;
  });

  item.appendChild(header);
  item.appendChild(pre);
  return item;
};

const initDebugDock = async () => {
  const widget = document.querySelector("[data-debug-widget]");
  const panelToggle = widget?.querySelector("[data-debug-panel-toggle]") ?? null;
  const toggleButtons = document.querySelectorAll("[data-debug-toggle-button]");
  const count = widget?.querySelector("[data-debug-count]");
  const list = widget?.querySelector("[data-debug-list]");
  const copyButton = widget?.querySelector("[data-debug-copy]");
  const clearButton = widget?.querySelector("[data-debug-clear]");

  if (!widget || !count || !list || !copyButton || !clearButton) {
    return;
  }

  const store = window.__travelsDebugStore;

  if (!store) {
    return;
  }

  let isExpanded = false;
  window.travelsDebugLog?.("Debug", "Debug system ready", `URL: ${window.location.href}`);

  store.subscribe((entries) => {
    count.textContent = String(entries.length);
    list.innerHTML = "";
    entries.forEach((entry) => {
      list.appendChild(createEntry(entry));
    });
  });

  const setExpanded = (nextExpanded) => {
    isExpanded = nextExpanded;
    widget.dataset.debugOpen = isExpanded ? "true" : "false";
    widget.setAttribute("aria-hidden", isExpanded ? "false" : "true");
    toggleButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isExpanded));
    });
  };

  const handleToggle = () => {
    setExpanded(!isExpanded);
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", handleToggle);
  });
  panelToggle?.addEventListener("click", handleToggle);

  const debugParamEnabled = new URLSearchParams(window.location.search).get("debug") === "true";
  if (debugParamEnabled) {
    setExpanded(true);
  }

  copyButton.addEventListener("click", async () => {
    const entries = store.getAll();
    const text = serializeEntries(entries);

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const fallback = document.createElement("textarea");
      fallback.value = text;
      fallback.setAttribute("readonly", "true");
      fallback.style.position = "absolute";
      fallback.style.left = "-9999px";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
    }
  });

  clearButton.addEventListener("click", () => {
    store.clear();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDebugDock);
} else {
  initDebugDock();
}
