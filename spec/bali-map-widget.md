# Bali map widget (implemented)

## Purpose

Add a lightweight map widget to the Bali trip page that visualizes the Bali places with valid
coordinates. The map appears above the place cards and helps quickly orient the destination
coverage.

## Behavior

- Renders an interactive Leaflet map at the top of the Bali page section, above the place cards.
- Loads markers from the existing Bali place data (`src/data/places/bali/*.ts`).
- Only places with valid latitude and longitude render as markers.
- Automatically fits bounds to all markers with padding.
- If there is only one marker, centers the map and applies a reasonable zoom.
- If there are no valid markers, the map is hidden.
- If the MapTiler key is missing, the map is hidden and a console warning is logged.

## Configuration

- Requires `PUBLIC_MAPTILER_KEY` in the environment (Astro public client key).
- Allowed origins configured in MapTiler:
  - https://www.dawallin.com
  - https://dawallin.github.io

## Non-goals

- No clustering.
- No search.
- No drawing tools.
- No external place management service.
- No backend proxy for tiles.
