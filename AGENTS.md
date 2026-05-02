# AGENTS.md

## Purpose

Repository-wide operating rules for AI agents working on this project.
Default goals: keep scope tight, preserve existing behavior, and ship small reviewable changes.

## Instruction Priority

When instructions conflict, follow this order:

1. Current user request
2. Relevant spec in `spec/`
3. This file (`AGENTS.md`)
4. Relevant skill workflow in `skills/`
5. General engineering best practices

Specs are the source of truth for task scope and acceptance.

## Repository Overview

This is an Astro static travel-planning site with typed place data and statically generated pages.

- Framework: `astro` (ES modules)
- Build/verify command: `npm run build` (same as `npm run verify`)
- Dev command: `npm run dev`
- Key external integration: Map widget uses `PUBLIC_MAPTILER_KEY`

## Project Structure

- `src/data/places/types.ts`: canonical data model (`Place`, `PlaceDetails`, link types)
- `src/data/places/{trip}/*.ts`: place-level source data (one file per place)
- `src/data/places/index.ts`: dynamic loading and lookup helpers via `import.meta.glob`
- `src/pages/trips/[trip]/places/[place].astro`: dynamic place-detail route (generated from `getStaticPaths`)
- `src/pages/trips/{trip}/index.astro`: trip overview pages
- `src/components/` and `src/layouts/`: rendering primitives and page layout
- `src/scripts/`: client-side behavior (map/debug widgets)
- `spec/*.md`: scoped plans, constraints, and validation checklists
- `skills/*/SKILL.md`: reusable agent workflows

## Required Workflow Before Editing

1. Locate and read the relevant spec in `spec/` (if one exists).
2. Identify whether a skill applies; if yes, read that `SKILL.md` before making changes.
3. Confirm scope boundaries (in-scope, non-goals, constraints, validation).
4. Implement the smallest viable change that satisfies the request.

Ask the user only when ambiguity creates real risk (scope, correctness, or data loss).

## Skills

Use these when they match the task:

- `skills/writing-spec/SKILL.md`: creating/updating spec files
- `skills/reviewing-against-spec/SKILL.md`: PR/spec compliance review
- `skills/safe-refactor/SKILL.md`: staged, non-breaking refactors

Do not treat skills as overrides to specs.

## Guardrails

Do not:

- Invent travel facts, links, descriptions, coordinates, or metadata
- Auto-fill missing content just to satisfy a structure
- Change routes, slugs, URLs, or page hierarchy unless requested by user/spec
- Change visual design or interaction patterns unless requested by user/spec
- Remove compatibility/fallback paths unless the active spec allows it
- Modify unrelated files or broaden scope silently
- Mark checklist items complete without evidence
- Claim validation ran if it did not

When changing travel content/data:

- Preserve original meaning
- Edit only fields required by the task
- Prefer omission over fabrication
- Keep data source responsibilities clear (`src/data` owns content, pages own presentation)

## Implementation Conventions

- Prefer existing TypeScript/Astro patterns over new abstractions.
- Keep edits localized to the affected trip/place/page/component.
- Maintain type compatibility with `src/data/places/types.ts`.
- Preserve graceful fallbacks in detail rendering (legacy vs strict details) unless explicitly in scope.
- Avoid incidental refactors while doing content or schema migrations.

## Validation and Completion

Validation order:

1. Run spec-defined checks first (if present).
2. Otherwise run `npm run build`.

Before finishing, inspect the diff for:

- unrelated file churn
- unintended route/layout/URL changes
- accidental content rewrites
- temporary/generated artifacts

If validation cannot be run, state that explicitly and explain why.

## Final Response Contract

End every task with a concise report covering:

- what changed
- what did not change
- what validation ran
- skipped work and residual risks
