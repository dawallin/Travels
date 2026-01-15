# Debug Widget (Implemented)

## Purpose
Provide a production-safe, always-available in-page debug console for diagnosing issues (e.g., map markers or tiles) without requiring server runtime checks.

## Astro guardrails
* **Do not use static ES module imports inside inline `<script>` blocks.**
* Astro mixes SSR markup, bundled client scripts, and inline scripts; static imports in inline scripts can fail with
  `Cannot use import statement outside a module` and break the debug UI + map init.
* MapWidget and other runtime widgets must **not import** a logger module; they must call the global debug API directly.

## Activation
* A small bug icon is always visible in the top-right header/navigation area on every page.
* The debug panel is **hidden by default** and toggled by clicking the bug icon.
* Optional: `?debug=true` auto-opens the panel on load (client-side only).
* The widget is always rendered in the DOM so it works in static deployments.

## UI behavior
* The bug icon is always available in the header area and toggles the panel.
* The panel is an overlay that opens on demand.
* Expanded state shows:
  * A list of log entries in index order.
  * Each entry displays its source and message.
  * Clicking an entry toggles a `<pre>`-style data block.
  * Controls: **Copy all** and **Clear**.

## Log entry model
Each entry includes:
* `index`: monotonically increasing integer assigned by the logger.
* `source`: short string (component/page name).
* `message`: short description.
* `data`: string (raw text, YAML-like, or plain text).

## Global debug API contract
* A single global function exists on every page:
  * `window.travelsDebugLog(source, message, dataString?)`
* It appends to a **single global ring buffer** (max 200 entries) and notifies subscribers.
* The debug UI reads from this same buffer; it does **not** create its own logger/store.
* MapWidget and other widgets call `window.travelsDebugLog?.(...)` directly (no imports).
* Logging helpers must be defensive: no-op if the global function is missing and never throw.

## Ring buffer limit
* Max 200 entries.
* Oldest entries are dropped as new entries are added.

## SSR + client log behavior
* The debug buffer + `window.travelsDebugLog` are initialized early on every page.
* Client-side logs are appended in index order at runtime.
* Optional SSR seed entries can be injected into `window.__travelsDebugSeed` and merged into the buffer.

## Runtime error capture
* Global listeners for `error` and `unhandledrejection` write into the same debug stream.
* This makes runtime parse/init failures visible to mobile users without DevTools.

## MapWidget runtime diagnostics
When the MapWidget initializes on the client, it logs runtime diagnostics to help debug map issues in production.

Expected MapWidget log entries:
* `MapWidget / Init`
  * Includes page URL, map container selector, MapTiler key presence/length/prefix, and marker counts.
* `MapWidget / Markers`
  * Includes total/valid/invalid marker counts plus readable lists of valid and invalid markers (with missing fields noted).
* `MapWidget / Ready`
  * Emitted after map creation and marker placement; includes bounds/fit decision and marker count.
* `MapWidget / Error`
  * Emitted when map initialization fails, including error message and stack string.

These logs are client-side only and appear when the debug system is available.

## Secret-handling guardrail
* **Do not log secrets.**
* The debug widget does not detect or mask secrets automatically.
* **Responsibility is on the producer** (component/page that logs) to mask sensitive values.
* Recommendation: log **presence/length/prefix** instead of full tokens when in doubt.
* The MapTiler client key is not considered a secret, but the guardrail still applies to other data.

## Copy all / Clear
* **Copy all**: copies all entries in a readable text block.
* **Clear**: clears the in-memory ring buffer.

## Non-goals
* Authentication or authorization gating.
* Persistent storage across sessions.
* Log levels, filters, or search.
* Server-side log storage or external services.
