# Debug Widget (Implemented)

## Purpose
Provide a production-safe, opt-in, in-page debug console for diagnosing issues (e.g., map markers or tiles) without shipping debug data when the feature is disabled.

## Activation
* Enabled only when the current request URL includes `?debug=true`.
* When disabled, the widget is not rendered and no SSR log payload is embedded.

## UI behavior
* Renders at the top of the page content area.
* Default state is **collapsed** with a single bar showing **Debug** and the current log count.
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

## Ring buffer limit
* Max 200 entries.
* Oldest entries are dropped as new entries are added.

## SSR + client log behavior
* SSR logs are collected per request when `debug=true` and embedded into the page as initial log entries.
* The client logger seeds from SSR logs so they appear at the top of the list before client-side entries.
* Client-side logs are appended in index order at runtime via `window.__travelsDebug`.
* In static output, the debug widget bootstraps on the client and dynamically loads initial log data only when `debug=true` is present.

## Secret-handling guardrail
* **Do not log secrets.**
* The debug widget does not detect or mask secrets automatically.
* **Responsibility is on the producer** (component/page that logs).
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
