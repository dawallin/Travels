# Writing specs

Use this skill when creating or updating files under `spec/`.

## Goal

Create clear, task-specific specs that guide safe agent work.

A good spec should define what to do, what not to do, how to validate the work, and when the task is complete.

## When to use

Use this skill for:

- new specs
- migration plans
- task lists
- acceptance criteria
- validation instructions
- updates to existing specs

## Spec structure

Prefer this structure:

```md
# Title

## Context

Why this work is needed.

## Goal

What should be achieved.

## Non-goals

What should not be changed.

## Constraints

Rules, compatibility requirements, or important limits.

## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Acceptance criteria

How to know the work is complete.

## Validation

Commands or checks to run.

## Risks

Known risks, ambiguity, or follow-up concerns.
```

## Rules

- Keep specs specific to one task or phase.
- Prefer small, trackable task lists.
- Include non-goals when scope control matters.
- Include validation steps when possible.
- Do not mix unrelated work into one spec.
- Do not invent requirements.
- Do not mark checklist items complete unless the work is actually done and validated.

## Output

When finished, summarize:

- which spec was created or updated
- the intended scope
- any open ambiguity
