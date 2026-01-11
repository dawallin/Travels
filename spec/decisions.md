# Decisions

- Use Astro for a simple static site.
- Deploy via GitHub Pages using GitHub Actions.
- All internal navigation links must be relative (no leading slash) to remain portable across base paths (e.g., GitHub Pages project sites under /Travels/).
  - Bad: /trips/bali
  - Good: trips/bali/
  - Good: ./trips/bali/
- Separate overview content from travel criteria.
  - The landing page is an overview and orientation surface only.
  - Preferences are first-class planning objects with two levels:
    - Baseline preferences (global, consistent across trips).
    - Theme preferences (context-specific planning frames).
  - Themes represent planning contexts, not destinations.
  - Notches are vertical bands attached to the left edge of cards, with the card background visible
    on both sides to create a wrap-through effect.
    - Notches are identical in style across baseline, theme, and trip cards.
    - Notch text is always vertical and limited to ≤10 characters.
    - Notches are attached elements, not layout columns, and must not overlap content.
    - Trips render one notch per referenced theme, up to two, side-by-side.
  - Themes define a display name, a short notch label (≤10 characters), and one semantic notch
    color; the notch label/color are sourced from the theme preference page and reused anywhere the
    theme is referenced.
  - Trips may reference up to two themes and must reuse each theme's notch label and notch color
    when referenced on overview surfaces.
  - Trips are explored within one or more themes conceptually, but no filtering is implemented yet.
  - Rationale: keeps the landing page lightweight and generic, allows preferences to evolve without restructuring the site, and supports sharing with travel advisors as a standalone reference.
  - Content principles: "Who we are" remains on the landing page due to its brevity and contextual role; preferences are written as requirements-like criteria, not narrative; time-bound criteria live only on theme pages.
  - Linking rule: the landing page links to baseline and theme preferences via simple text links (no CTA), and all internal links remain relative.
- Spec files are a living reference and must be kept in sync with UI, IA, and data-model decisions.
