# Travels

A minimal static travel-planning site built with Astro and deployed on GitHub Pages.

## Deploys

Pushing to `master` triggers a GitHub Pages deployment via GitHub Actions.

## MapTiler key (Bali map)

The Bali trip page includes a Leaflet map that uses MapTiler tiles. Set a public key locally using
an Astro public environment variable:

```bash
PUBLIC_MAPTILER_KEY=your-key-here
```

Allowed origins configured in MapTiler:

- https://www.dawallin.com
- https://dawallin.github.io
