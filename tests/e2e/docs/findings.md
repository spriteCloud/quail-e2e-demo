# Bug discovery ledger

Persists fuzz/negative/journey failures across runs. Each row is one
finding, deduped by (spec, test). Update with:

```bash
quail ledger update --report playwright-report.json
```

Severity follows the @priority mapping: critical journeys → high,
standard → medium, nice-to-have → low.

The `smoke` job in `.github/workflows/quail.yml` grep's `@smoke` and
gates its exit code on this file via `quail ledger verify` — any
failure listed here is treated as known debt, anything else is treated
as a regression and turns the job red.

| Spec | Test | Symptom | First seen | Last seen | Severity | Status |
|---|---|---|---|---|---|---|
| `tests/e2e/heal-demo/broken-locator.heal-demo.spec.ts` | @smoke @heal-demo: spritecloud homepage shows the hero anchor | Error: expect(locator).toBeVisible: locator resolved to 0 elements | 2026-07-03 | 2026-07-09 | low | open |
