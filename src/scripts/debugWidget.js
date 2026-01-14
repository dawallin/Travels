import { getDebugLogger } from "../lib/debugLogger";

const getInitialLogs = (widget) => {
  const raw = widget.dataset.debugInitialLogs;
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("[DebugWidget] Failed to parse initial logs.", error);
    return [];
  }
};

const getElements = () => {
  const widget = document.querySelector("[data-debug-widget]");
  const panelToggle = widget?.querySelector("[data-debug-panel-toggle]") ?? null;
  const toggleButtons = document.querySelectorAll("[data-debug-toggle-button]");
  const count = widget?.querySelector("[data-debug-count]");
  const list = widget?.querySelector("[data-debug-list]");
  const copyButton = widget?.querySelector("[data-debug-copy]");
  const clearButton = widget?.querySelector("[data-debug-clear]");

  if (!widget || !count || !list || !copyButton || !clearButton) {
    console.warn("[DebugWidget] Missing required elements; debug widget disabled.");
    return null;
  }

  return {
    widget,
    panelToggle,
    toggleButtons,
    count,
    list,
    copyButton,
    clearButton,
  };
};

const serializeEntries = (entries) =>
  entries
    .map((entry) =>
      [`#${entry.index} · ${entry.source}: ${entry.message}`, entry.data ?? ""]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

const renderEntries = (list, count, entries) => {
  count.textContent = String(entries.length);
  list.innerHTML = "";

  entries.forEach((entry) => {
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
    list.appendChild(item);
  });
};

const initDebugWidget = () => {
  const elements = getElements();
  if (!elements) {
    return;
  }

  const { widget, panelToggle, toggleButtons, count, list, copyButton, clearButton } = elements;

  let isExpanded = false;
  let initialLogsLoaded = false;

  const logger = getDebugLogger();

  if (logger) {
    const initialLogs = getInitialLogs(widget);
    logger.seed(initialLogs);
    logger.log("Debug", "Debug system ready", `URL: ${window.location.href}`);
    logger.subscribe((entries) => {
      renderEntries(list, count, entries);
    });
  }

  const loadInitialLogs = async () => {
    if (initialLogsLoaded || !logger) {
      return;
    }

    const pageKey = widget.dataset.debugPageKey;
    if (!pageKey) {
      return;
    }

    initialLogsLoaded = true;

    if (pageKey === "bali") {
      const { getBaliInitialLogs } = await import("../lib/debugLogs/bali");
      logger.seed(getBaliInitialLogs());
    }
  };

  const setExpanded = (nextExpanded) => {
    isExpanded = nextExpanded;
    widget.dataset.debugOpen = isExpanded ? "true" : "false";
    widget.setAttribute("aria-hidden", isExpanded ? "false" : "true");
    toggleButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isExpanded));
    });

    if (isExpanded) {
      void loadInitialLogs();
    }
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
    const entries = logger?.getAll() ?? [];
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
    logger?.clear();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDebugWidget);
} else {
  initDebugWidget();
}
