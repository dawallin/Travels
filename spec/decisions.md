# Decisions

- Use Astro for a simple static site.
- Deploy via GitHub Pages using GitHub Actions.
- All internal navigation links must be relative (no leading slash) to remain portable across base paths (e.g., GitHub Pages project sites under /Travels/).
  - Bad: /trips/bali
  - Good: trips/bali/
  - Good: ./trips/bali/
