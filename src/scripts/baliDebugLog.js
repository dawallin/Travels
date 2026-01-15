const initBaliDebugLog = async () => {
  if (typeof window === "undefined") {
    return;
  }

  window.travelsDebugLog?.("Bali Page", "Loaded", `url: ${window.location.href}`);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBaliDebugLog, { once: true });
} else {
  void initBaliDebugLog();
}
