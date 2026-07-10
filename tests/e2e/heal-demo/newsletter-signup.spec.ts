// Heal-with-diff target. This spec references the data-testid strings
// defined in src/components/Newsletter.tsx. When Newsletter.tsx
// renames one of those testids in a PR, heal-proactive reads the diff,
// walks the anchor rename, greps this file for the old string, and
// rewrites the getByTestId() call to the new string.
//
// Tagged @heal-demo-proactive (NOT @smoke) — the SUT hasn't rendered
// this component (Newsletter.tsx is a symbolic anchor, spritecloud.com
// is the real target), so the test would fail if smoke ran it. Verify
// on demo/heal-with-diff runs THIS spec after heal-proactive rewrites
// the testids to prove the rewrite landed at the source level.
import { test, expect } from '@playwright/test'

test('@heal-demo-proactive: newsletter signup form is visible', async ({ page }) => {
  await page.setContent(`
    <form data-testid="newsletter-form">
      <input data-testid="newsletter-email-input" type="email" />
      <button data-testid="newsletter-subscribe-btn">Subscribe</button>
    </form>
  `)
  await expect(page.getByTestId('newsletter-form')).toBeVisible()
  await expect(page.getByTestId('newsletter-email-field')).toBeVisible()
  await expect(page.getByTestId('newsletter-subscribe-btn')).toBeVisible()
})
