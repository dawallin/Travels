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
- `type`: controlled, short string (e.g. `destination`, `hotel`, `attraction`).
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

## PlaceCard UI component

Place rendering uses a shared card system with TripCard, with place data bound to the same
visual language.

**Structure**

- Entire card is clickable when a content page exists.
- `place.title` is the primary title.
- A notch is mandatory and matches the TripCard notch shape, position, and typography.
- No theme tag is shown on place cards.
- No separate type tag is shown; the type lives in the notch.

**Notch**

- Notch text is always `place.type`, with fallback text `Place` if missing.
- Notch text is short and constrained to a single line.
- Notch color is driven by `place.status`.
  - `included` → green
  - `possible` → yellow
  - `avoid` → red
- No iconography inside the notch.

**Status tag**

- Display only for `possible` and `avoid`.
- Never display for `included`.
- Render as a small, subdued chip/tag.
- Match the status color.
- Text:
  - `possible` → "Possible"
  - `avoid` → "Avoid"
- Position is secondary to title/notch (e.g. lower-right corner).

## Place hierarchy (tree)

- Parent and child places render as full PlaceCards.
- Tree structure is represented by indentation only.
- Card layout remains identical across levels.
- Rendering must not fall back to text lists or simple links.

## PlacesOverview widget

- Renders a PlaceCard tree for the trip.
- Uses the same card styling and notch shape as the landing page cards.
- Notch represents status color plus type text.
- Status tag appears only for `possible` and `avoid`.
- Hierarchy is represented via indentation, not list rows or link-only entries.
- Places without a valid parent destination appear under an Ungrouped section.

## Page headers

- Baseline preferences, trip pages, and place pages share the same PageHeader box.
- The back link and page title appear within the same header container.
- Trip pages use the trip title in the header.
- Place pages use `place.title` as the H1 and must always render it correctly.
