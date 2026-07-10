# quail demo — explore

Quail is spriteCloud's E2E test tool. It **explores** live applications
for real bugs: on every PR, it generates a throwaway Playwright suite
against the target URL, executes it once, and prints a human-readable
Gherkin report. Nothing is committed back — the tests are ephemeral;
only the report survives, wrapped in a spriteCloud-branded HTML page
and uploaded as a run artifact.

This repo is the demo playground. It runs `spriteCloud/quail-review@feat/explore`
against `https://www.spritecloud.com`.

## The two axes that make `explore` different

- **Ephemeral by default.** Generated `.spec.ts` and `.feature` files
  live in an `os.MkdirTemp` workdir and are wiped on exit. Only the
  Gherkin report survives, streamed to stdout and rendered as HTML for
  the workflow artifact. Pass `--persist` to keep files under `--workdir`.
- **Change-aware by default.** On every run the last change is
  auto-detected — PR diff via `$GITHUB_EVENT_PATH` in CI, or
  `git diff HEAD~1..HEAD` locally. Only the changed file **paths**
  (never content) are forwarded to the LLM to prioritise its
  attack-plan targets. The deterministic layer still probes every
  discovered element regardless.

## Watch the demo

Open a PR against `main` (this file's `demo/explore-showcase` branch is
the reference example). GitHub Actions runs `quail-explore` and posts a
`quail-explore-report` artifact to the run summary: an HTML page with
the syntax-highlighted Gherkin report, targeted at the URL above and
prioritised by the PR's changed paths.

## Trigger it yourself

**PR-driven**: the `quail-explore` workflow fires on every `pull_request`
event. Nothing else to configure.

**Local**: install `quail` from `spriteCloud/quail-review@feat/explore`
and run

```
quail explore --url https://www.spritecloud.com \
  --focus auth,injection,state-corrupt,race,boundary \
  --depth shallow
```

The Gherkin report streams to stdout; the ephemeral temp dir is wiped
on exit.

## Stack

- Composite action: `spriteCloud/quail-review@feat/explore` (temp; will
  move to a released tag once the Explorer contract lands in a
  `quail-core` release)
- Explore engine: 12 adversarial attack categories
  (boundary, injection, state-corrupt, race, auth, data-edge,
  cross-feature, flow-interrupt, sequence, role-switch, upstream-dep,
  cumulative)
- Guardrails spec: `internal/spec/explore_guardrails.md` in
  `quail-review` — every LLM response is validated against it before
  use; invalid responses are dropped and the deterministic fallback
  wins.
- Report styling: spriteCloud brand tokens (copper `#C0805A` primary,
  deep-water `#1B365D` headers, warm-white `#FAFAF7` page,
  Inter / Fira Code system stacks, pixel-bar section markers).

## Repo layout

```
.github/workflows/
  explore.yml         # pull_request → quail explore → branded HTML artifact

src/components/       # SUT source (Hero, ContactForm, Subscribe, Newsletter)

tests/e2e/            # legacy Playwright/Gherkin suite — kept for reference
                      # but no longer required by the explore workflow
```
