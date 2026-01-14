const MAX_ENTRIES = 200;

const createLogger = () => {
  let entries = [];
  let index = 0;
  const subscribers = new Set();

  const notify = () => {
    const snapshot = [...entries];
    subscribers.forEach((subscriber) => subscriber(snapshot));
  };

  const setEntries = (nextEntries) => {
    entries = nextEntries.slice(-MAX_ENTRIES);
    const maxIndex = entries.reduce((max, entry) => Math.max(max, entry.index), -1);
    index = Math.max(index, maxIndex + 1);
    notify();
  };

  return {
    log: (source, message, data = "") => {
      const entry = {
        index,
        source,
        message,
        data,
      };

      index += 1;
      entries = [...entries, entry].slice(-MAX_ENTRIES);
      notify();
    },
    clear: () => {
      entries = [];
      notify();
    },
    getAll: () => [...entries],
    subscribe: (subscriber) => {
      subscribers.add(subscriber);
      subscriber([...entries]);
      return () => {
        subscribers.delete(subscriber);
      };
    },
    seed: (seedEntries) => {
      if (!Array.isArray(seedEntries) || seedEntries.length === 0) {
        return;
      }

      const combined = [...seedEntries, ...entries];
      setEntries(combined);
    },
    isEnabled: () => typeof window !== "undefined",
  };
};

const getDebugLogger = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.__travelsDebug) {
    window.__travelsDebug = createLogger();
  }

  return window.__travelsDebug;
};

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
