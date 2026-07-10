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
  // Intentionally broken: 'Reach the team' does not appear anywhere on
  // spritecloud.com. Playwright's role name matcher (case-insensitive
  // substring) has no way to match this. Heal probes the SUT and finds
  // 'Talk to our team' — tokenOverlap 2/3 against ['reach','the','team']
  // — as the highest-ranked replacement candidate.
  await expect(page.getByRole('link', { name: 'Reach the team' })).toBeVisible({ timeout: 4000 })
})
