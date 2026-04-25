# Safe refactor

Use this skill for non-breaking refactors, staged migrations, and changes where existing behavior must be preserved.

## Goal

Improve structure without changing behavior unless the active spec explicitly says so.

Safe refactors should be small, reversible, and easy to review.

## When to use

Use this skill for:

- staged migrations
- moving data or logic
- introducing typed structures
- replacing legacy paths gradually
- reducing duplication
- preparing future cleanup

## Process

1. Read the active spec fully.
2. Identify current behavior that must be preserved.
3. Identify fallback behavior that must remain.
4. Make the smallest safe change.
5. Avoid unrelated cleanup.
6. Validate behavior using the spec’s validation steps.
7. Inspect the diff before finishing.

## Rules

Do:

- preserve existing behavior
- preserve routes and URLs
- preserve visual output unless explicitly changed
- keep legacy fallback paths until removal is explicitly allowed
- prefer existing patterns
- keep changes reviewable

Do not:

- combine refactor with unrelated cleanup
- invent new abstractions unless required
- remove old code just because new code exists
- change data meaning
- rewrite content
- mark migration steps complete without validation

## Completion

A refactor is complete only when:

- the scoped change is implemented
- existing behavior is preserved
- validation has run or skipped validation is clearly explained
- the diff contains no unrelated changes

## Output

When finished, summarize:

- what changed
- what behavior was preserved
- what validation was run
- what fallback remains
- any remaining risk
