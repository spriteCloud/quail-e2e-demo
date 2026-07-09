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
