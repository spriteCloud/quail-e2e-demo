# Bug discovery ledger

Persists fuzz/negative/journey failures across runs. Each row is one
finding, deduped by (spec, test). Update with:

```bash
quail ledger update --report playwright-report.json
```

Severity follows the @priority mapping: critical journeys → high,
standard → medium, nice-to-have → low.

| Spec | Test | Symptom | First seen | Last seen | Severity | Status |
|---|---|---|---|---|---|---|
| `tests/e2e/a11y/about-us.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/blog.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/blog.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/careers.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-ben-nl.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-ben-nl.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-citizenm.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-citizenm.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-post-nl.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies-post-nl.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-studies.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-study-ecomm-platform.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/case-study-ecomm-platform.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/contact.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/cybersecurity.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/devops.landmarks.spec.ts` | @smoke: single main, single h1, at least one nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/functional-testing.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-detox-guide.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-detox-guide.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-from-sandboxes-to-production-navigating-salesforce-test-automation-like-a-pro.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-from-sandboxes-to-production-navigating-salesforce-test-automation-like-a-pro.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-guide-implementing-shift-left-testing-in-an-agile-environment.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-guide-implementing-shift-left-testing-in-an-agile-environment.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-image-patching-with-copacetic.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-image-patching-with-copacetic.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-robot-framework-guide.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-robot-framework-guide.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-test-management-for-jira-using-xray.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-test-management-for-jira-using-xray.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-transforming-software-testing-a-guide-to-popular-ai-testing-tools.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-transforming-software-testing-a-guide-to-popular-ai-testing-tools.keyboard.spec.ts` | @kind:keyboard @smoke tab through the first 10 focusables | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-transforming-software-testing-a-guide-to-popular-ai-testing-tools.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-typescript-its-benefits-use-cases-and-pros-in-testing-as-a-language.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-typescript-its-benefits-use-cases-and-pros-in-testing-as-a-language.keyboard.spec.ts` | @kind:keyboard @smoke tab through the first 10 focusables | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-typescript-its-benefits-use-cases-and-pros-in-testing-as-a-language.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-what-is-built-in-quality-and-how-can-you-improve-it.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides-what-is-built-in-quality-and-how-can-you-improve-it.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/guides.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/msa.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/msa.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/our-community.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/performance-testing.a11y.spec.ts` | @kind:a11y @smoke no serious or critical accessibility violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/supplier-msa.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/supplier-msa.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/test-automation.landmarks.spec.ts` | @kind:a11y-landmarks @smoke one main element, one h1, and at least one nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/test-choice.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/test-choice.landmarks.spec.ts` | @kind:a11y-landmarks @smoke single main + h1 + nav | Error: expected exactly one <main> region | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/a11y/vciso.a11y.spec.ts` | @kind:a11y @smoke no serious or critical axe violations | Error: expect(received).toHaveLength(expected) | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/history-depth/cybersecurity.history-depth.spec.ts` | @kind:history-depth @smoke back twice then forward keeps the page interactive | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/history-depth/landing.history-depth.spec.ts` | @kind:history-depth @smoke back twice then forward keeps the page interactive | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/history-depth/performance-testing.history-depth.spec.ts` | @kind:history-depth @smoke back twice then forward keeps the page interactive | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/history-depth/test-automation.history-depth.spec.ts` | @kind:history-depth @smoke back twice then forward keeps the page interactive | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/mobile/contact.mobile.spec.ts` | @kind:mobile @smoke @device:Pixel 5 viewport renders without breakage | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/mobile/contact.mobile.spec.ts` | @kind:mobile @smoke @device:iPhone 13 viewport renders without breakage | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/perf/contact.perf.spec.ts` | @kind:perf @smoke loads under 3000ms | Error: load took 4463ms — over SLO 3000ms | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/perf/cybersecurity.perf.spec.ts` | @kind:perf @smoke loads under 3000ms | Error: load took 5568ms — over SLO 3000ms | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/perf/landing.perf.spec.ts` | @kind:perf @smoke loads under 3000ms | Error: load took 4913ms — over SLO 3000ms | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/perf/performance-testing.perf.spec.ts` | @kind:perf @smoke loads under 3000ms | Error: load took 6645ms — over SLO 3000ms | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/perf/test-automation.perf.spec.ts` | @kind:perf @smoke loads under 3000ms | Error: load took 4505ms — over SLO 3000ms | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/print/landing.print.spec.ts` | @kind:print @smoke renders under media: print | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/print/performance-testing.print.spec.ts` | @kind:print @smoke renders under media: print | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/print/test-automation.print.spec.ts` | @kind:print @smoke renders under media: print | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/race/landing.race.spec.ts` | @kind:race @smoke form survives a rapid double-submit | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/responsive/contact.responsive.spec.ts` | @kind:responsive @smoke renders at desktop (1280x720) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/responsive/contact.responsive.spec.ts` | @kind:responsive @smoke renders at mobile (375x667) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/responsive/contact.responsive.spec.ts` | @kind:responsive @smoke renders at tablet (768x1024) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/responsive/cybersecurity.responsive.spec.ts` | @kind:responsive @smoke renders at mobile (375x667) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/responsive/cybersecurity.responsive.spec.ts` | @kind:responsive @smoke renders at tablet (768x1024) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/touch/contact.touch.spec.ts` | @kind:touch @smoke long-press on the primary CTA does not double-fire | Error: browserType.launch: | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/touch/cybersecurity.touch.spec.ts` | @kind:touch @smoke long-press on the primary CTA does not double-fire | Error: browserType.launch: | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/touch/landing.touch.spec.ts` | @kind:touch @smoke long-press on the primary CTA does not double-fire | Error: browserType.launch: | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/touch/performance-testing.touch.spec.ts` | @kind:touch @smoke long-press on the primary CTA does not double-fire | Error: browserType.launch: | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/touch/test-automation.touch.spec.ts` | @kind:touch @smoke long-press on the primary CTA does not double-fire | Error: browserType.launch: | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/landing.visual.spec.ts` | @kind:visual @smoke page matches baseline (desktop) | Error: expect(page).toHaveScreenshot(expected) failed | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/landing.visual.spec.ts` | @kind:visual @smoke page matches baseline (tablet) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/performance-testing.visual.spec.ts` | @kind:visual @smoke page matches baseline (desktop) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/performance-testing.visual.spec.ts` | @kind:visual @smoke page matches baseline (mobile) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/performance-testing.visual.spec.ts` | @kind:visual @smoke page matches baseline (tablet) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/test-automation.visual-states.spec.ts` | @kind:visual-state @smoke primary CTA across states | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/test-automation.visual.spec.ts` | @kind:visual @smoke page matches baseline (mobile) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/visual/test-automation.visual.spec.ts` | @kind:visual @smoke page matches baseline (tablet) | TimeoutError: page.goto: Timeout 20000ms exceeded. | 2026-06-20 | 2026-06-20 | medium | open |
| `tests/e2e/heal-demo/broken-locator.spec.ts` | @smoke @heal-demo: spritecloud homepage shows the hero anchor | Error: expect(locator).toBeVisible: locator resolved to 0 elements | 2026-07-03 | 2026-07-03 | low | open |
