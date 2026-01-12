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
- `status`: `included`, `possible`, or `avoid` (fixed enum).
- `parentDestinationId`: the destination that groups this place (or the trip root for top-level
  destinations).
- `description`: short neutral summary used in cards and as starter content.
- `coords` (optional): latitude/longitude metadata.
- `schedule` (optional): structured timing or visit notes.

**Data vs content**

- Data files are canonical and required for the place to exist.
- Markdown content pages are optional.
- Places always render as full cards and always link to their place detail path.
- Never render places as inline text links.

## Card UI component

All overview and place cards use a single generic Card component with shared surface styling.

**Structure**

- Entire card is clickable (the link wraps the card).
- `title` is the primary text.
- `description` provides the short summary copy.
- Optional leading visual (image or stripe) may appear on the left.
- Primary semantic marker is optional and may be either:
  - Notch with text + color, or
  - Circular icon badge with color + icon.
- Never render both notch and badge on the same card.
- Secondary chip is optional and sits at the bottom-right corner.

**Notch marker**

- Notch text is short and constrained to a single line.
- Notch color is caller-defined (themes, trips, etc.).
- Notch typography, shape, and position are shared across the site.

**Secondary chip**

- Render as a small, subdued chip/tag.
- Position is secondary to title/primary marker (e.g. lower-right corner).

## Place card affordances

Place rendering uses the Card component with the badge marker and optional status chip.

**Badge marker**

- Badge color is driven by `place.status`.
  - `included` → green
  - `possible` → yellow
  - `avoid` → red
- Badge sizing treats the icon badge as a primary visual marker; it should read clearly at a glance.
- Badge icon is driven by `place.type`.
  - `destination` → map pin icon
  - `hotel` → bed icon
  - `attraction` → building/landmark icon
- No type text is shown on the card.
- The badge includes accessible text (aria-label/title) for the type.

**Status chip**

- Display only for `possible` and `avoid`.
- Never display for `included`.
- Match the status color.
- Text:
  - `possible` → "Possible"
  - `avoid` → "Avoid"

## Place hierarchy (tree)

- Parent and child places render as full PlaceCards.
- Tree structure is represented by indentation only.
- Card layout remains identical across levels.
- Indentation uses a fixed horizontal offset per depth level and is applied to the card row/container,
  not by shrinking the internal card content.
- Rendering must not fall back to text lists or simple links.

## PlacesOverview widget

- Renders a PlaceCard tree for the trip.
- Uses the shared Card surface styling.
- Badge represents status color plus type icon.
- Status chip appears only for `possible` and `avoid`.
- Hierarchy is represented via indentation, not list rows or link-only entries.
- Places without a valid parent destination appear under an Ungrouped section.
- Place card descriptions are visually clamped to 1–2 lines to keep cards scan-friendly.

## Page headers

- Baseline preferences, trip pages, and place pages share the same PageHeader box.
- The back link and page title appear within the same header container with identical styling.
- Trip pages use the trip title in the header.
- Place pages use `place.title` as the H1 and must always render it correctly.
