# Reviewing against a spec

Use this skill when reviewing a PR, diff, or implementation against a spec.

## Goal

Check whether the change matches the intended scope, constraints, and acceptance criteria.

The review should be conservative and evidence-based.

## When to use

Use this skill for:

- PR reviews
- checking whether a change follows a spec
- validating migration phases
- identifying scope creep
- checking whether checklist items can be marked complete

## Review process

1. Read the relevant spec fully.
2. Identify the intended scope, non-goals, constraints, and validation rules.
3. Inspect the changed files.
4. Compare the implementation against the spec.
5. Check for unrelated changes.
6. Check whether validation was run or can be run.
7. Decide whether the change is aligned, partially aligned, or not aligned.

## What to check

Look for:

- missing required changes
- extra changes outside scope
- invented or rewritten content
- changed routes, URLs, or visual behavior
- removed fallback behavior
- checklist items marked complete without evidence
- validation claims without evidence

## Output format

Use this format:

```md
## Review result

Aligned / Partially aligned / Not aligned

## Findings

- Finding 1
- Finding 2

## Scope check

Describe whether the change stayed within the spec.

## Validation

Describe what was validated and what was not.

## Recommendation

State whether to merge, revise, or investigate further.
```

## Rules

- Do not assume intent that is not in the spec.
- Do not approve broad changes just because they seem useful.
- Prefer “not validated” over guessing.
- Be explicit about uncertainty.
- Keep the review focused on the spec.
