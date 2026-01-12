# Requirements

- A static travel-planning site for collecting and sharing trip ideas.
- All content lives in the repository and is updated via commits.
- Each destination can have its own page and structure.
- The site must be easy to understand and modify without deep framework knowledge.
- Preferences are first-class planning objects, with baseline and theme-specific pages.
- Baseline preferences are the global, non-specific reference for how trips are evaluated and
  structured, and remain timeless across seasons, destinations, and themes.

## Place model v1

Each place is stored as canonical data, optionally paired with a content page.

**Fields**

- `id`: unique identifier used in URLs and parent relationships.
- `title`: display name for the place.
- `type`: `destination`, `hotel`, or `attraction`.
- `status`: `included`, `possible`, or `avoid`.
- `parentDestinationId`: the destination that groups this place (or the trip root for top-level
  destinations).
- `description`: short neutral summary used in cards and as starter content.
- `coords` (optional): latitude/longitude metadata.
- `schedule` (optional): structured timing or visit notes.

**Data vs content**

- Data files are canonical and required for the place to exist.
- Markdown content pages are optional.
- Cards are clickable only when a content page exists.

## PlacesOverview widget

- Reuses the landing-page card layout and notch styling.
- The notch represents status only (not theme).
- Type badge appears as a subtle bottom-right tag.
- Hierarchy is represented through grouping and spacing only (no tree UI).
- Places without a valid parent destination appear under an Ungrouped section.
