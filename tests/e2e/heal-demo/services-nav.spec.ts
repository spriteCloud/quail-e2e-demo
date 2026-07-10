// Heal-on-failure target. This spec deliberately references the
// primary-nav "Services" link on the SUT (https://www.spritecloud.com)
// with a mistyped accessible name — 'Servces'. Smoke runs it, Playwright
// fails with a locator-not-found error, and heal (on-failure) reads
// the report, walks the live DOM, finds the real Services link, and
// opens a PR whose diff rewrites the getByRole() call to the correct
// name.
//
// Tagged @smoke so verify picks it up. Fresh scenario for the current
// demo — the previous heal-on-failure target ('hero-cta') has been
// retired.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo-on-failure: primary-nav Services link is reachable', async ({ page }) => {
  await page.goto('/')
  const servicesLink = page.getByRole('link', { name: 'Servces' })
  await expect(servicesLink).toBeVisible()
})
