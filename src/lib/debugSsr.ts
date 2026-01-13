export type DebugEntry = {
  index: number;
  source: string;
  message: string;
  data: string;
};

const MAX_ENTRIES = 200;

export const createSsrLogger = () => {
  let index = 0;
  const entries: DebugEntry[] = [];

  const log = (source: string, message: string, data = "") => {
    entries.push({
      index,
      source,
      message,
      data,
    });
    index += 1;

    if (entries.length > MAX_ENTRIES) {
      entries.shift();
    }
  };

  return {
    entries,
    log,
  };
};
