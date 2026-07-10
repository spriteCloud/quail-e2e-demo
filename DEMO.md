# quail demo

Quail is spriteCloud's E2E test tool. It **generates** Playwright tests
from a website or a code diff, **heals** stale locators when selectors
move — either after a real test failure or preemptively from a source
diff — and **explores** a live application adversarially for real bugs
on every PR.

This repo is the demo playground. It runs `spriteCloud/quail-review@v1`
against `https://www.spritecloud.com` on self-hosted
`qwen3-coder-next` via DGX (currently pinned to `v1.16.0` via the `@v1`
major-tag alias), plus `spriteCloud/quail-review@feat/explore` for the
still-unreleased `explore` mode.

## The four modes

| Mode | What triggers it | What it produces | Wall-time |
|---|---|---|---|
| **generate** | New PR that adds source (or `workflow_dispatch` with a `url`) | `quail: tests for PR #N` bot PR with ~40 fresh journey specs | ~4-8 min |
| **heal — on failure** | A `@smoke` test fails on CI (report-driven) | `quail: heal locators for PR #N` bot PR with locator fixes | ~2-3 min |
| **heal — proactive** | Source-side rename with no test failure (diff-driven) | `quail: heal locators for PR #N` bot PR from just the diff | ~1-2 min |
| **explore** | Every PR (`pull_request` event) | Ephemeral Playwright suite runs once; branded HTML report uploaded as `quail-explore-report` artifact | ~2-3 min |

## Watch the demo

Four scenario branches sit on `origin`, one per mode. Open a PR from
any of them against `main` to fire the matching workflow live:

- **`demo/generate`** — adds a new `Pricing` component to `src/components/`. `generate` opens a bot PR whose diff is a fresh journey suite covering the new surface.
- **`demo/heal-no-diff`** — adds a `@smoke` spec that references the primary-nav "Services" link with a mistyped accessible name. Smoke goes red on CI. `heal — on failure` reads the Playwright report, walks the live DOM at `spritecloud.com`, and opens a fix PR restoring the correct locator.
- **`demo/heal-with-diff`** — renames a `data-testid` in `src/components/Newsletter.tsx`. No test fails (heal-proactive doesn't wait for red). Quail reads the diff, greps for the old testid in `tests/e2e/heal-demo/`, and opens a fix PR rewriting the `getByTestId()` calls.
- **`demo/explore-showcase`** — the current explore reference PR. `quail-explore` builds from source, probes the target adversarially, and uploads a spriteCloud-branded HTML artifact — no on-disk artefacts survive the run.

## Trigger it yourself

**PR-driven** (every mode): open a PR from one of the four branches
above. `.github/workflows/quail.yml` (generate + heal + smoke gate) and
`.github/workflows/explore.yml` (explore + artifact upload) both fire
on `pull_request` and route based on the diff shape.

**`workflow_dispatch`** (generate + heal only): **Actions →
quail-trigger → Run workflow**:

- Provide **`url`** (leave `pr` empty) → runs `generate` against that URL.
- Provide **`pr`** (leave `url` empty) → runs `heal` against that PR. `mode` defaults to `auto`: on-failure if the PR's latest CI failed, proactive otherwise. Override with `on-failure` or `proactive`.

`.github/workflows/quail-trigger.yml` is a 3-input wrapper for the demo
path.

## Comment `/quail` on any PR

Fires `.github/workflows/quail-review.yml` — quail-review fetches the
PR diff, asks the LLM for `## Core Changes` + `## Verdict`, and posts
one markdown comment. Wall-time ~2 min against a 100-file diff.

## Stack

- Composite action: `spriteCloud/quail-review@v1` (currently v1.16.0) for generate/heal/review; `spriteCloud/quail-review@feat/explore` with `version: source` for explore (drops back to `@v1` once explore ships in a tag)
- Model: `qwen3-coder-next:latest` on self-hosted DGX (via Netbird)
- LLM output cap: 1024 tokens (per prompt)
- Test framework: Playwright + `playwright-bdd` for Gherkin round-trip
- Ledger gate: `quail ledger verify --baseline=tests/e2e/docs/findings.md`
- Explore report styling: spriteCloud brand tokens (copper `#C0805A` primary, deep-water `#1B365D` headers, warm-white `#FAFAF7` page, Inter / Fira Code system stacks, pixel-bar section markers)

## Repo layout

```
.github/workflows/
  quail.yml           # pull_request — smoke, generate, heal, heal-proactive, verify
  quail-review.yml    # issue_comment → /quail Core Changes + Verdict
  quail-trigger.yml   # workflow_dispatch — pr → heal, url → generate
  explore.yml         # pull_request → quail explore → branded HTML artifact

src/components/       # SUT source (Hero, ContactForm, Subscribe, Newsletter)

tests/e2e/
  features/           # 14 Gherkin journeys, @smoke tagged
  heal-demo/          # broken-locator sentinels (tracked in ledger)
  steps/  lib/        # bdd step defs + reusable helpers
  docs/               # findings.md ledger, test-catalogue.md
  _fixtures.ts        # shared page fixture
  fuzz.spec.ts        # single fuzz spec
```
