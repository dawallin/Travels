# Place Detail Page Migration Spec

## Goal

Refactor the travel site so that all structured place data lives in TypeScript files and can be used to render both trip overview pages and place detail pages.

The goal is to make TypeScript the single structured source of truth for places, while preserving all existing trip overview behavior and avoiding breaking changes during migration.

This migration must be incremental, safe, and reviewable.

---

## Core Principles

- TypeScript should become the canonical structured data source for places.
- Existing trip overview pages must continue working unchanged.
- Existing place metadata must remain backward compatible.
- No existing fields should be removed or renamed during migration.
- New detail page fields must be additive and optional.
- Detail page rendering must become data-driven.
- Markdown detail pages should be phased out only after migration is complete.
- URL structure must remain unchanged.
- Visual design must remain unchanged.
- Do not invent new travel content during migration.
- Only migrate existing content from markdown or existing TypeScript data.

---

## Existing Model Constraints

The existing model already supports trip overview rendering and must remain stable.

Important existing constraints:

- Places belong to a single trip.
- Places are not shared between trips.
- Places are not globally reusable.
- Destinations are grouping nodes or areas, for example Munduk, Ubud, or Sanur.
- Destinations may have their own map pin.
- Places are actual points of interest with their own coordinates.
- A place belongs to a destination.
- A place remains the primary entity for cards and detail pages.

Existing fields currently used by overview pages must remain stable.

This includes:

- id
- name
- type
- shortDescription
- location
- image
- destinationId
- status

Do not break or change behavior for these fields.

---

## Status Rules

Status already exists and must remain unchanged.

Allowed values:

- included
- possible
- avoid

This is a fixed enum and must not be changed.

Status is part of the core planning model and must not be moved into detail content.

---

## Target Model

The Place model should remain the core entity and be extended with optional detail page fields.

The Place model should continue to support:

- trip overview rendering
- destination grouping
- trip cards
- existing navigation
- existing map behavior

The same Place model should also support:

- place detail pages
- richer structured detail content
- dynamic detail page generation

This must be done by extending Place, not replacing it.

---

## New Optional Fields

The Place model should be extended with the following optional fields:

- heroImage
- visitOrder
- links
- details

All new fields must be optional.

No existing code should be forced to provide them.

---

## Image Rules

The existing image field must remain unchanged.

Rules:

- image remains the existing card or overview image.
- heroImage is an optional detail-page hero override.
- If heroImage is missing, the detail page may fall back to image.
- Do not replace image with heroImage.
- Do not change existing card image behavior.

---

## Visit Order Rules

visitOrder is optional planning metadata.

Rules:

- visitOrder represents planned visit sequence.
- visitOrder is not UI section ordering.
- visitOrder must not control the order of sections inside a detail page.
- Undefined means no explicit visit sequence.
- visitOrder belongs on the Place model, not inside details.
- Since places belong to one trip only, visitOrder can live directly on Place.

---

## PlaceLinks Contract

Structured external links must be stored in a dedicated links object.

Allowed fields:

- googleMaps
- tripAdvisor
- official

Rules:

- all fields are optional
- no additional link types
- no generic ad-hoc links
- only these three keys are allowed
- do not show raw URLs in rendered pages
- render links as buttons or existing styled link UI

This keeps link rendering predictable and consistent.

---

## PlaceDetails Contract

Structured detail page content must be stored in a dedicated details object.

Fields:

- what
- summary
- highlights
- tips
- goodToKnow
- bestTime

Rules:

- details is optional
- if details exists, what is required
- all other fields are optional
- details must only contain detail page content
- details must not contain routing metadata
- details must not contain planning metadata
- details must not contain destination grouping metadata
- details must not contain link metadata

Details is content only.

---

## Description Rules

Do not confuse existing overview descriptions with detail-page summaries.

Rules:

- existing shortDescription must remain unchanged
- existing overview/card description behavior must remain unchanged
- details.summary is for detail-page content
- do not replace shortDescription with details.summary
- do not change trip cards to use details.summary

---

## Destination Rules

Destinations and places have different roles.

Destination:

- grouping node
- area or cluster
- may have its own map pin
- used to group places

Place:

- actual point of interest
- has its own coordinates
- may be a hotel, attraction, restaurant, cafe, beach, temple, or activity
- belongs to a destination

Rules:

- destinationId remains grouping metadata
- destination coordinates and place coordinates are separate
- place coordinates must remain on the place
- do not move place coordinates to destination
- do not remove destination grouping

---

## Rendering Model

Detail pages should become data-driven.

The long-term target is:

- one dynamic place detail page
- all place detail pages generated from TypeScript
- no per-place markdown pages required

Place detail pages should be generated from TypeScript data.

The final rendering model should be:

- Place TypeScript file defines the place
- Astro generates the route
- Layout renders the page

This allows a new place to be added by creating only a TypeScript file.

---

## Dynamic Routing

Place detail pages should eventually be rendered from a single dynamic route:

src/pages/trips/[trip]/places/[place].astro

This route should:

- generate all place detail pages
- load place data from TypeScript
- render the correct place
- preserve existing URL structure

URL structure must remain:

/trips/{trip}/places/{place}

Do not change route patterns.

---

## Rendering Rules

Detail pages must render only available content.

Rules:

- no empty sections
- no placeholder UI
- no empty link cards
- no empty highlights section
- no empty tips section
- no empty good-to-know section
- no empty best-time section
- missing optional fields must not break rendering

Suggested section order:

- Hero
- Description
- Highlights
- Tips
- Good to know
- Best time
- Links

Do not redesign the visual appearance.

Use existing styling patterns where possible.

---

## Migration Strategy

This migration must be done incrementally in four phases.

Do not skip phases.

---

## Tasks

### [ ] Phase 1 — Extend the Place contract only

Goal:

Add optional fields needed for structured detail pages without changing runtime behavior.

Tasks:

- [ ] Add PlaceLinks contract.
- [ ] Add PlaceDetails contract.
- [ ] Add optional links field to Place.
- [ ] Add optional details field to Place.
- [ ] Add optional heroImage field to Place if not already available.
- [ ] Add optional visitOrder field to Place.
- [ ] Do not migrate markdown content yet.
- [ ] Do not remove markdown files.
- [ ] Do not change existing place files unless required for type compatibility.
- [ ] Do not change trip overview rendering.
- [ ] Do not rename or remove any existing fields.
- [ ] Do not change the status enum.
- [ ] Do not change route structure.

Success criteria:

- existing data still compiles
- existing trip overview pages still work
- no existing fields are renamed or removed
- no markdown files are removed
- new optional fields are available for later phases

Validation:

- [ ] Run the existing build command if available.
- [ ] Run the existing typecheck command if available.
- [ ] Verify that trip overview pages still render.
- [ ] Verify that existing place data remains valid.

---

### [ ] Phase 2 — Introduce dynamic detail rendering without removing markdown

Goal:

Create the dynamic detail page infrastructure while keeping existing markdown routes and content safe during migration.

Tasks:

- [ ] Create src/pages/trips/[trip]/places/[place].astro.
- [ ] Generate detail routes from TypeScript place data.
- [ ] Load places through a helper instead of ad-hoc imports.
- [ ] Pass the selected Place object to the layout.
- [ ] Render structured details when place.details exists.
- [ ] Keep markdown fallback if required during migration.
- [ ] Preserve existing URL structure.
- [ ] Do not delete markdown files.
- [ ] Do not change trip overview behavior.
- [ ] Do not redesign the detail page UI.
- [ ] Render only sections with available data.
- [ ] Avoid empty UI blocks.

Rendering priority during migration:

1. If place.details exists, render structured TypeScript detail data.
2. Otherwise, preserve existing markdown behavior or fallback content.
3. If neither exists, render a minimal safe page using existing place metadata.

Success criteria:

- dynamic route can render a place from TypeScript
- existing markdown content is still available during migration
- existing URLs remain unchanged
- no visual redesign has been introduced
- trip overview pages remain unchanged

Validation:

- [ ] Run the existing build command if available.
- [ ] Run the existing typecheck command if available.
- [ ] Verify at least one existing place detail URL.
- [ ] Verify at least one trip overview page.
- [ ] Verify that missing optional detail fields do not create empty UI sections.

---

### [ ] Phase 3 — Migrate detail content from markdown into TypeScript

Goal:

Move existing structured detail content into the corresponding place TypeScript files.

Tasks:

- [ ] Move existing detail descriptions into details.summary.
- [ ] Move existing factual short explanations into details.what.
- [ ] Move existing highlights into details.highlights.
- [ ] Move existing tips into details.tips.
- [ ] Move existing practical notes into details.goodToKnow.
- [ ] Move existing timing or seasonal notes into details.bestTime.
- [ ] Move Google Maps links into links.googleMaps.
- [ ] Move TripAdvisor links into links.tripAdvisor.
- [ ] Move official website links into links.official.
- [ ] Do not invent new content.
- [ ] Do not add generic filler content.
- [ ] If content is ambiguous, leave it unmigrated or mark it for review.
- [ ] Keep migration incremental and reviewable.
- [ ] Do not change existing overview fields unless absolutely necessary.
- [ ] Do not change card descriptions.
- [ ] Do not change destination grouping.

Success criteria:

- migrated places render from TypeScript
- migrated content matches existing markdown content
- no structured data is duplicated between markdown and TypeScript
- trip overview pages remain unchanged
- no content is invented

Validation:

- [ ] Compare migrated TypeScript details with the original markdown content.
- [ ] Verify that migrated detail pages render correctly.
- [ ] Verify that trip overview pages still look unchanged.
- [ ] Run the existing build command if available.
- [ ] Run the existing typecheck command if available.

---

### [ ] Phase 4 — Remove legacy markdown detail pages

Goal:

Remove markdown detail pages after all place details have been migrated and verified.

Tasks:

- [ ] Verify every place detail page renders correctly from TypeScript.
- [ ] Verify no detail page depends on markdown content.
- [ ] Verify all relevant markdown content has been migrated or intentionally discarded.
- [ ] Delete legacy markdown place files.
- [ ] Remove markdown fallback logic if no longer needed.
- [ ] Keep URL structure unchanged.
- [ ] Keep visual output equivalent.
- [ ] Ensure adding a new place only requires adding a TypeScript file.

Success criteria:

- TypeScript is the only structured source of truth for places
- all detail pages are generated dynamically
- no content is lost
- no routes are broken
- adding a new place only requires adding a TypeScript file
- legacy markdown detail pages are removed

Validation:

- [ ] Run the existing build command if available.
- [ ] Run the existing typecheck command if available.
- [ ] Verify all generated place detail routes.
- [ ] Verify trip overview pages.
- [ ] Verify no broken internal links to deleted markdown pages.

---

## Non-Goals

The following are explicitly out of scope:

- redesigning trip overview pages
- changing visual design
- changing route structure
- changing destination architecture
- changing existing place hierarchy
- introducing reusable global places
- changing the status enum
- changing existing cards
- changing trip navigation
- inventing new travel content
- replacing destination grouping
- changing existing card image behavior

---

## Final Expected Result

After migration:

- all structured place data lives in TypeScript
- place detail pages are generated dynamically
- trip overview pages still work unchanged
- markdown place files are removed
- adding a new place requires only a TypeScript file
- TypeScript is the single structured source of truth
- routes remain unchanged
- visual design remains unchanged
- existing overview behavior remains unchanged
