# Landing page specification

## Information architecture
- The landing page must include five sections in this order:
  1. Identity / Context (title + subtitle).
  2. Who We Are (family composition and shared planning intent).
  3. How We Use This Site (planning process, iteration, comparison).
  4. Planning Frameworks (card-based list linking to baseline + theme preferences).
  5. Travel Ideas (card-based list linking to trips/{destination}).
- Detailed preference content is intentionally excluded from the landing page.
- Identity / Context copy is written as flowing prose, even when describing scope, mode, or audience.
- Planning Framework cards must use the same card styling as Travel Ideas.
- Planning Framework cards may include a plain-text status label (Reference/Active/Draft).
- Baseline preferences must appear as a single, neutral card separated from theme cards by a thin,
  neutral divider.
- Theme cards appear beneath the divider and are visually grouped together.
- Metadata markers must not appear in Planning Framework cards, except for the notch label.

## Tone and voice
- Content must read as a professional planning workspace.
- No marketing language, no social-media voice, no persuasion.
- Statements should be factual, neutral, and suitable for internal or agency review.
- The landing page is an overview/workspace, not a metadata surface.

## UI styling principles
- Typography-first layout with generous whitespace and left-aligned text.
- Sans-serif typography, neutral palette with at most one accent color.
- Visual hierarchy is achieved through typography and spacing, not decorative elements.
- No emojis, no decorative icons, no gradients, no travel clichés.
- No calls to action or promotional hero sections.
- All planning cards use a vertical notch attached to the left edge. Notches are narrow bands that
  appear to pass through the card, with the card background visible on both sides of the notch.
- Notches are not layout columns and must never overlap card content; reserve padding for the
  notch area.
- Notch text is mandatory, vertical, and limited to ≤10 characters; truncate with ellipsis if
  needed to keep the layout stable.
- Baseline cards use a neutral notch; themes define a subtle notch color and short label; trips
  inherit the notch label/color from their referenced theme(s).
- Trips may show up to two notches side-by-side when referencing two themes.
- Theme colors are semantic identifiers, not decorative accents, and should read softly on light
  backgrounds.
- Avoid additional explanatory text on the landing page when layout already conveys structure.

## Metadata placement
- Structured metadata (attributes, status) belongs on trip cards/pages, not on the landing page.
  - Exception: Planning Framework cards may include a plain-text status label.
  - Notch labels are allowed on theme and theme-referenced trip cards to convey affiliation.

## Internal link rules
- All internal navigation links must be relative (no leading slash).
- Use the pattern trips/{destination}/ for travel idea cards.
- Include a simple text link to the baseline preferences page with no CTA language.
