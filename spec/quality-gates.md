# Quality gates and verification

## Canonical verification command

This project uses a single smoke verification command:

```
npm run verify
```

`verify` is a fast, deterministic build smoke check. It must fail with a non-zero exit code if the
site cannot build. The command must be run locally (in the agent sandbox) before presenting any
change as “ready.”

## Agent stop policy

If verification fails, an agent may iterate on fixes and re-run verification. The maximum is **4**
fix iterations per change request (fix → verify). After the fourth failure:

- Stop making further edits.
- Provide a concise failure report including:
  - the command run
  - the first actionable error lines (not full logs)
  - files changed
  - suspected cause
  - suggested next steps
