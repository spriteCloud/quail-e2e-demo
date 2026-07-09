// Heal-on-failure target. Uses a broken-but-fuzzy-similar locator
// against a real element on https://www.spritecloud.com/. The @smoke
// tag makes the smoke job pick it up; ledger verify sees a failure
// not tracked in findings.md and turns smoke red. Heal-on-failure then
// downloads the Playwright report, probes the live SUT, ranks the
// available anchors by fuzzy overlap with the broken locator's name,
// and proposes a corrected getByRole('link', { name: 'Contact' }) (or
// similar) in a bot PR.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo-onfail: contact CTA is reachable from homepage', async ({ page }) => {
  await page.goto('https://www.spritecloud.com/')
  // Intentionally broken: 'Contact us' (with 'us') is close to
  // spritecloud's actual 'Contact' link but not an exact match, so
  // Playwright will fail on strict role+name. Heal probes the SUT,
  // sees 'Contact' as the closest anchor by fuzzy overlap, and
  // proposes the corrected getByRole call.
  await expect(page.getByRole('link', { name: 'Contact us' })).toBeVisible({ timeout: 4000 })
})
