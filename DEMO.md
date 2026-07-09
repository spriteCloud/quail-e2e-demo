# quail demo

Quail is spriteCloud's E2E test tool. It **generates** Playwright tests
from a website or a code diff, and **heals** stale locators when
selectors move — either after a real test failure or preemptively from
a source diff.

This repo is the demo playground. It runs the real `spriteCloud/quail-
review@v1.8.0` action against `https://www.spritecloud.com` on
self-hosted `qwen3-coder-next` via DGX.

## The three modes

| Mode | What triggers it | What it produces | Wall-time |
|---|---|---|---|
| **generate** | New PR that adds source (or `workflow_dispatch` with a `url`) | `quail: tests for PR #N` bot PR with ~40 fresh journey specs | ~4-8 min |
| **heal — on failure** | A `@smoke` test fails on CI (report-driven) | `quail: heal locators for PR #N` bot PR with locator fixes | ~2-3 min |
| **heal — proactive** | Source-side rename with no test failure (diff-driven) | `quail: heal locators for PR #N` bot PR from just the diff | ~1-2 min |

## Watch the demo

Three PRs, one per mode, sitting open as living examples:

- **`demo/generate`** — adds a new component. Watch the `generate` job open a bot PR with a fresh suite covering the new surface.
- **`demo/heal-no-diff`** — renames an existing SUT selector that a `@smoke` test uses. Watch smoke fail, then `heal` (on-failure) read the Playwright report and open a fix PR.
- **`demo/heal-with-diff`** — renames a SUT selector no `@smoke` test uses. Watch `heal-proactive` open a fix PR from the diff alone, with smoke never turning red.

## Trigger it yourself

**Actions → quail-trigger → Run workflow**:

- Provide **`url`** (leave `pr` empty) → runs generate against that URL.
- Provide **`pr`** (leave `url` empty) → runs heal against that PR. `mode` defaults to `auto`: on-failure if the PR's latest CI failed, proactive otherwise. Override with `on-failure` or `proactive`.

The 21-input composite action lives at `.github/workflows/quail.yml`.
`quail-trigger.yml` is a 3-input wrapper for the demo path.

## Comment `/quail` on any PR

Fires `quail-review.yml` — quail-review fetches the PR diff, asks the
LLM for `## Core Changes` + `## Verdict`, posts one markdown comment.
Wall-time ~2 min against a 100-file diff. See PR #84 (closed) for an
example transcript that shows the same command run once with a small
model (shallow verdict) and once with `qwen3-coder-next` (deep verdict).

## Stack

- Composite action: `spriteCloud/quail-review@v1.8.0`
- Model: `qwen3-coder-next:latest` on self-hosted DGX (via Netbird)
- LLM output cap: 1024 tokens (per prompt)
- Test framework: Playwright + `playwright-bdd` for Gherkin round-trip
- Ledger gate: `quail ledger verify --baseline=tests/e2e/docs/findings.md`

## Repo layout

```
.github/workflows/
  quail.yml           # pull_request — smoke, generate, heal, heal-proactive, verify
  quail-review.yml    # issue_comment → /quail Core Changes + Verdict
  quail-trigger.yml   # workflow_dispatch — pr → heal, url → generate

src/components/       # SUT source (Hero, ContactForm, Subscribe, Newsletter)

tests/e2e/
  features/           # 14 Gherkin journeys, @smoke tagged
  heal-demo/          # broken-locator sentinel (tracked in ledger)
  steps/  lib/        # bdd step defs + reusable helpers
  docs/               # findings.md ledger, test-catalogue.md
  _fixtures.ts        # shared page fixture
  fuzz.spec.ts        # single fuzz spec
```
