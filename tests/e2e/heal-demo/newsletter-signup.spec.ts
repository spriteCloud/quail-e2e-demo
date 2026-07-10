// Heal-with-diff target. References the data-testid strings defined in
// src/components/Newsletter.tsx. When Newsletter.tsx renames a testid
// in a PR, heal-proactive reads the diff and rewrites the getByTestId
// call here to match.
//
// Uses page.setContent so the test is self-contained (doesn't need the
// live SUT to render Newsletter.tsx). Tagged @smoke so verify's grep
// picks it up after heal-proactive rewrites the testids.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo-proactive: newsletter signup form is visible', async ({ page }) => {
  await page.setContent(`
    <form data-testid="newsletter-form">
      <input data-testid="newsletter-email-input" type="email" />
      <button data-testid="newsletter-subscribe-btn">Subscribe</button>
    </form>
  `)
  await expect(page.getByTestId('newsletter-form')).toBeVisible()
  await expect(page.getByTestId('newsletter-email-input')).toBeVisible()
  await expect(page.getByTestId('newsletter-signup-btn')).toBeVisible()
})
