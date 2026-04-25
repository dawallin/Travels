## Purpose
This file defines the default rules for AI agents working in this repository.
Keep work scoped, incremental, and safe. Prefer small changes that are easy to review.
## Working model
This repo uses:
- `AGENTS.md` for general agent behavior
- `spec/` for task-specific plans, requirements, checklists, and validation
- `skills/` for optional reusable workflows
Priority order:
1. Current user request
2. Relevant spec in `spec/`
3. This file
4. Relevant skill
5. General best practices
Specs define the task truth. Skills are helpers, not overrides.
## Before editing
Agents should:
- Find and read the relevant spec in `spec/` when one exists
- Follow the spec’s scope, non-goals, constraints, and validation steps
- Use a skill only when it clearly matches the task
- Prefer existing repo patterns over new abstractions
- Make the smallest reasonable change
Ask only when ambiguity creates real scope, safety, or data-loss risk.
## Hard rules
Do not:
- Invent travel content or facts
- Add missing content just to fill a schema
- Rewrite unrelated files
- Broaden scope silently
- Change routes, URLs, or visual design unless requested
- Remove fallback behavior unless the active spec explicitly allows it
- Mark checklist items complete without evidence
- Claim validation was run if it was not
When changing content or data:
- Preserve meaning
- Change only what the task requires
- Prefer omission over invention
- Keep source and target responsibilities clear
## Travel site structure
This is an Astro travel site for presenting trips, places, hotels, restaurants, activities, and travel planning notes.
The site separates structured data from rendered pages:
- TypeScript files under `src/data/` hold structured travel data used for lists, cards, maps, metadata, and page rendering.
- Astro and Markdown files under `src/pages/` define routes and rendered content.
- Specs under `spec/` describe planned changes and migration phases.
- Skills under `skills/` describe reusable agent workflows.
Common paths:
```text
src/data/places/{trip}/{place}.ts
src/pages/trips/{trip}/places/{place}.md
spec/*.md
skills/*/SKILL.md
```

### Design intent
- Keep travel data source-controlled and reviewable.
- Prefer typed, structured data where it improves consistency.
- Preserve existing URLs and visual behavior unless a spec says otherwise.
- Avoid inventing or enriching travel facts without explicit instruction.

### Validation
Use the validation steps from the active spec.

If no spec-specific validation exists, run:

`npm run build`

Before finishing, inspect the diff for:

- unrelated file changes
- unintended content changes
- unintended route or layout changes
- temporary or generated files

If validation cannot be run, say so clearly.

### Final response
End with a concise summary:

- what changed
- what did not change
- what was validated
- skipped work or remaining risk
