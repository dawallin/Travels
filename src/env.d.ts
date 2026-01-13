/// <reference path="../.astro/types.d.ts" />

import type { DebugLogger } from "./lib/debugLogger";

declare global {
  interface Window {
    __travelsDebug?: DebugLogger;
  }
}
