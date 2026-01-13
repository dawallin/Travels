import type { DebugEntry } from "./debugLogger";
import { getDebugLogger } from "./debugLogger";

type MountOptions = {
  initialLogs?: DebugEntry[];
};

const STYLE_ID = "travels-debug-style";

const STYLE_CONTENT = `
.debug-widget {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.debug-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: #f0f4f8;
  color: var(--text);
  font-size: 0.95rem;
}
.debug-count {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.debug-chevron {
  transition: transform 0.2s ease;
}
.debug-widget[data-debug-expanded="true"] .debug-chevron {
  transform: rotate(180deg);
}
.debug-panel {
  padding: 16px;
  display: grid;
  gap: 16px;
  background: var(--surface);
}
.debug-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.debug-actions {
  display: flex;
  gap: 8px;
}
.debug-actions button,
.debug-entry-header {
  border: 1px solid var(--border);
  background: #f8fafc;
  color: var(--text);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}
.debug-actions button:hover,
.debug-entry-header:hover {
  background: #eef2f7;
}
.debug-list {
  display: grid;
  gap: 12px;
}
.debug-entry {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
  background: #fbfdff;
}
.debug-entry-header {
  width: 100%;
  text-align: left;
}
.debug-entry-data {
  margin: 10px 0 0;
  padding: 10px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: pre-wrap;
  color: var(--text);
}
`;

const ensureStyles = () => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE_CONTENT;
  document.head.appendChild(style);
};

const serializeEntries = (entries: DebugEntry[]) =>
  entries
    .map((entry) =>
      [`#${entry.index} · ${entry.source}: ${entry.message}`, entry.data ? entry.data : ""]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

export const mountDebugWidget = ({ initialLogs = [] }: MountOptions) => {
  const main = document.querySelector("main");
  if (!main || document.querySelector("[data-debug-widget]")) {
    return;
  }

  ensureStyles();

  const widget = document.createElement("section");
  widget.className = "debug-widget";
  widget.dataset.debugWidget = "true";

  widget.innerHTML = `
    <div class="debug-header" data-debug-toggle>
      <strong>Debug</strong>
      <span class="debug-count" data-debug-count>0</span>
      <span class="debug-chevron" aria-hidden="true">▾</span>
    </div>
    <div class="debug-panel" data-debug-panel hidden>
      <div class="debug-controls">
        <span class="debug-title">Logs</span>
        <div class="debug-actions">
          <button type="button" data-debug-copy>Copy all</button>
          <button type="button" data-debug-clear>Clear</button>
        </div>
      </div>
      <div class="debug-list" data-debug-list></div>
    </div>
  `;

  main.prepend(widget);

  const toggle = widget.querySelector<HTMLButtonElement>("[data-debug-toggle]");
  const panel = widget.querySelector<HTMLDivElement>("[data-debug-panel]");
  const count = widget.querySelector<HTMLSpanElement>("[data-debug-count]");
  const list = widget.querySelector<HTMLDivElement>("[data-debug-list]");
  const copyButton = widget.querySelector<HTMLButtonElement>("[data-debug-copy]");
  const clearButton = widget.querySelector<HTMLButtonElement>("[data-debug-clear]");

  if (!toggle || !panel || !count || !list || !copyButton || !clearButton) {
    widget.remove();
    return;
  }

  let isExpanded = false;

  const renderEntries = (entries: DebugEntry[]) => {
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

  const logger = getDebugLogger();
  logger?.seed(initialLogs);
  logger?.subscribe((entries) => {
    renderEntries(entries);
  });

  toggle.addEventListener("click", () => {
    isExpanded = !isExpanded;
    panel.hidden = !isExpanded;
    widget.dataset.debugExpanded = isExpanded ? "true" : "false";
  });

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
