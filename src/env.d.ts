/// <reference path="../.astro/types.d.ts" />

type TravelsDebugEntry = {
  index: number;
  source: string;
  message: string;
  data: string;
};

type TravelsDebugStore = {
  log: (source: string, message: string, data?: string) => void;
  clear: () => void;
  getAll: () => TravelsDebugEntry[];
  subscribe: (subscriber: (entries: TravelsDebugEntry[]) => void) => () => void;
  seed: (entries: Array<Partial<TravelsDebugEntry> & { source: string; message: string }>) => void;
};

declare global {
  interface Window {
    __travelsDebugStore?: TravelsDebugStore;
    __travelsDebugSeed?: Array<Partial<TravelsDebugEntry> & { source: string; message: string }>;
    travelsDebugLog?: (source: string, message: string, data?: string) => void;
  }
}
