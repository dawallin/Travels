import { getDebugLogger } from "../lib/debugLogger";

const initBaliDebugLog = async () => {
  if (typeof window === "undefined") {
    return;
  }

  const logger = getDebugLogger();

  if (!logger?.isEnabled()) {
    return;
  }

  logger.log("Bali Page", "Loaded", `url: ${window.location.href}`);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBaliDebugLog, { once: true });
} else {
  void initBaliDebugLog();
}
