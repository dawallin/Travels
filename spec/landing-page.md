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
- Tag-like metadata must not appear in Planning Framework cards, except for the banner label.

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
- All planning cards use a vertical left-side banner with a fixed-width column; banners must never
  overlap card content.
- Banner text is mandatory and limited to ~10 characters; truncate with ellipsis if needed to keep
  the layout stable.
- Baseline cards use a neutral banner; themes define a subtle banner color and short label; trips
  inherit the banner label/color from their referenced theme.
- Theme colors are semantic identifiers, not decorative accents, and should read softly on light
  backgrounds.
- Avoid additional explanatory text on the landing page when layout already conveys structure.

## Metadata placement
- Structured metadata (tags, attributes, status) belongs on trip cards/pages, not on the landing page.
  - Exception: Planning Framework cards may include a plain-text status label.
  - Banner labels are allowed on theme and tagged trip cards to convey theme affiliation.

## Internal link rules
- All internal navigation links must be relative (no leading slash).
- Use the pattern trips/{destination}/ for travel idea cards.
- Include a simple text link to the baseline preferences page with no CTA language.
