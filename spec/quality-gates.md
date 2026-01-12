# Quality gates and verification

## Canonical verification command

This project uses a single smoke verification command:

```
npm run verify
```

`verify` is a fast, deterministic build smoke check. It must fail with a non-zero exit code if the
site cannot build. The command must be run locally (in the agent sandbox) before presenting any
change as “ready.”

## Verification reporting contract

Agents must report verification results using the exact block below at the end of their final
response and in any PR summary. The block is copy-pasteable and must be used verbatim.

```
Verification
	•	Command: npm run verify
	•	Result: PASS | FAIL | NOT RUN
	•	Iterations: X/4
	•	Notes: <short; include first actionable error lines if FAIL, or explain why NOT RUN>
```

Rules:

- `PASS` is allowed **only** if `npm run verify` was executed in the agent sandbox and returned exit
  code 0.
- `FAIL` must include the first actionable error lines (not full logs).
- `NOT RUN` must include the reason (for example: missing dependencies or inability to execute
  commands).
- Agents may attempt up to **4** iterations of fix → verify. After four failed iterations, stop
  editing and report `FAIL` with a concise diagnostic summary.
- If the result is `FAIL` or `NOT RUN`, the patch is **not ready** and the agent must explain next
  steps.

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
