// Heal-on-failure target. Uses a broken-but-fuzzy-similar locator
// against a real element on https://www.spritecloud.com/. The @smoke
// tag makes the smoke job pick it up; ledger verify sees a failure
// not tracked in findings.md and turns smoke red. Heal-on-failure then
// downloads the Playwright report, probes the live SUT, ranks the
// available anchors by fuzzy overlap with the broken locator's name,
// and proposes a corrected getByRole('link', { name: 'Contact' }) (or
// similar) in a bot PR.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo-onfail: primary CTA is reachable from homepage', async ({ page }) => {
  await page.goto('https://www.spritecloud.com/')
  // Intentionally broken: capital-T 'Get in Touch' vs the SUT's
  // 'Get in touch' (lowercase t). Playwright's strict role+name lookup
  // is case-sensitive so this fails. Heal probes the SUT, sees the
  // real 'Get in touch' link with tokenOverlap=3 against ['get','in',
  // 'touch'], and proposes the case-corrected getByRole call.
  await expect(page.getByRole('link', { name: 'Get in Touch' })).toBeVisible({ timeout: 4000 })
})
