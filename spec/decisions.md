# Decisions

- Use Astro for a simple static site.
- Deploy via GitHub Pages using GitHub Actions.
- All internal navigation links must be relative (no leading slash) to remain portable across base paths (e.g., GitHub Pages project sites under /Travels/).
  - Bad: /trips/bali
  - Good: trips/bali/
  - Good: ./trips/bali/
- Separate overview content from travel criteria.
  - The landing page is an overview and orientation surface only.
  - Detailed preferences live on a dedicated Travel preferences page.
  - Rationale: keeps the landing page lightweight and generic, allows preferences to evolve without restructuring the site, and supports sharing with travel advisors as a standalone reference.
  - Content principles: "Who we are" remains on the landing page due to its brevity and contextual role; preferences are written as requirements-like criteria, not narrative; time-bound criteria must be explicitly scoped as situational.
  - Linking rule: the landing page links to preferences via a simple text link (no CTA), and all internal links remain relative.
