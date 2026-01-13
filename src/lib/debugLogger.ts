export type DebugEntry = {
  index: number;
  source: string;
  message: string;
  data: string;
};

export type DebugSubscriber = (entries: DebugEntry[]) => void;

export type DebugLogger = {
  log: (source: string, message: string, data?: string) => void;
  clear: () => void;
  getAll: () => DebugEntry[];
  subscribe: (subscriber: DebugSubscriber) => () => void;
  seed: (entries: DebugEntry[]) => void;
  isEnabled: () => boolean;
};

const MAX_ENTRIES = 200;

const isDebugEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("debug") === "true";
};

const createLogger = (): DebugLogger => {
  let entries: DebugEntry[] = [];
  let index = 0;
  const subscribers = new Set<DebugSubscriber>();

  const notify = () => {
    const snapshot = [...entries];
    subscribers.forEach((subscriber) => subscriber(snapshot));
  };

  const setEntries = (nextEntries: DebugEntry[]) => {
    entries = nextEntries.slice(-MAX_ENTRIES);
    const maxIndex = entries.reduce((max, entry) => Math.max(max, entry.index), -1);
    index = Math.max(index, maxIndex + 1);
    notify();
  };

  return {
    log: (source, message, data = "") => {
      if (!isDebugEnabled()) {
        return;
      }

      const entry: DebugEntry = {
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
      if (!isDebugEnabled()) {
        return;
      }

      if (!Array.isArray(seedEntries) || seedEntries.length === 0) {
        return;
      }

      const combined = [...seedEntries, ...entries];
      setEntries(combined);
    },
    isEnabled: () => isDebugEnabled(),
  };
};

export const getDebugLogger = (): DebugLogger | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.__travelsDebug) {
    window.__travelsDebug = createLogger();
  }

  return window.__travelsDebug;
};
