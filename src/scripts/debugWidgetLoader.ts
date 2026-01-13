const script = document.currentScript as HTMLScriptElement | null;
const pageKey = script?.dataset.pageKey;
const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "true";

if (debugEnabled && !document.querySelector("[data-debug-widget]")) {
  const loadInitialLogs = async () => {
    if (pageKey === "bali") {
      const { getBaliInitialLogs } = await import("../lib/debugLogs/bali");
      return getBaliInitialLogs();
    }

    return [];
  };

  const { mountDebugWidget } = await import("../lib/debugWidgetClient");
  const initialLogs = await loadInitialLogs();
  mountDebugWidget({ initialLogs });
}
