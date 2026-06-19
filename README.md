<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/sprite-Cloud-0090D0?style=for-the-badge&labelColor=0F1117&color=9DA5AE">
    <img alt="spriteCloud" src="https://img.shields.io/badge/sprite-Cloud-0090D0?style=for-the-badge&labelColor=FAFAF7&color=9DA5AE">
  </picture>
  &nbsp;quail&nbsp;<sub><sup>e2e demo</sup></sub>
</h1>

> Open a PR → **Quail** drafts a new test scenario.
> Test fails in CI → **Quail** heals the broken locator.
> Both happen against `https://www.spritecloud.com`, with LLM-rich humanization driven by an on-prem DGX over Netbird.

This repository is a deliberately-throwaway end-to-end exercise of two flagship Quail flows that the v0.92–v0.94.1 ship cycle re-enabled: PR-aware scenario suggestion (`quail generate --pr N`) and self-healing locators (`heal-mode: on-failure`). It exists so the loop can be observed in public, replayed at will, and used as the canonical "see it run" link from the [Quail landing page](https://spritecloud.github.io/quail/).

## What this demo exercises

| Observed behaviour | Required Quail version | Where to look |
|---|---|---|
| Workflow connects to DGX over Netbird, runs without an OpenAI key | This demo | run logs |
| Bot PRs land under `quail/...` branches, not `reviewqa/...` | v0.93.0 (rename) | bot PR head ref |
| `tests/e2e/steps/quail.steps.ts` (only), no stale `reviewqa.steps.ts` | v0.93.0 | this repo's file tree |
| Scenario Outline `with-quotes` row parses, no `bddgen` abort | v0.93.1 | Playwright run log |
| LLM-composed scenarios emit valid step bodies (no empty `Given:`) | v0.93.1 + DGX | bot PR diff |
| Healing PR is a minimal-viable restoration of the broken locator | (existing) | heal-PR diff |
| No `Co-Authored-By` trailers in any auto-opened PR commit | `no-coauth.yml` | `git log -1 --pretty=full` |
| `quail --version` inside CI reports the v1 tag's resolved release | v0.94.1 retag | workflow log |

The matrix gets filled in with PR numbers + workflow run IDs after each demo passes.

## The two demos

### A. `quail generate` — PR-aware scenario suggestion

A pull request adds a new TypeScript component (`Subscribe.ts`). The `quail` workflow scans the diff via `internal/diff`, recognises the new exported symbol, probes `https://www.spritecloud.com` for a matching journey, and opens a follow-up PR containing a draft `.feature` file. The bot PR is reviewable and squash-mergeable like any normal PR.

### B. `quail heal` — self-healing locators

A pull request deliberately introduces a wrong locator in `tests/e2e/steps/quail.steps.ts`. Playwright fails in CI. With `heal-mode: on-failure`, the workflow invokes `quail heal --pr N --report playwright-report.json`. Heal walks the live DOM at the target URL, finds the locator the failing step *meant* to match, and opens a healing PR whose diff restores the working locator.

## Infrastructure

- **GitHub Action**: `spriteCloud/quail@v1` (currently → v0.94.1).
- **LLM endpoint**: Ollama hosted on an on-prem DGX Spark at `http://100.82.34.115:11434`, model `qwen3-coder-next:latest`.
- **Network**: the runner joins Netbird ephemerally via [`Alemiz112/netbird-connect@b2bea07`](https://github.com/Alemiz112/netbird-connect) (SHA-pinned, not `@main`). The `NETBIRD_SETUP_KEY` repo secret is locked to a peer whose access policy permits **only** `100.82.34.115:11434`.
- **Target**: `https://www.spritecloud.com` — real DOM, no mocking.

## Branding

This repo follows the spriteCloud visual system used on the Quail landing page: blue `sprite` + grey `Cloud` wordmark, copper accents, deep-water headings, Sora display / Inter body. Generated specs carry the `spriteCloud` project label via `quail probe --name spriteCloud`, which is why every scenario feature header reads `Feature: spriteCloud — <kind> journey` rather than `Spritecloud`.

## License

[MIT](./LICENSE).
