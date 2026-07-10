// Heal-with-diff target. References the data-testid strings defined
// in src/components/Newsletter.tsx.
//
// Demo flow:
//   - main:     Newsletter.tsx has data-testid="newsletter-subscribe-btn"
//   - this PR:  Newsletter.tsx renames it to "newsletter-signup-btn"
//   - heal-proactive walks the rename and rewrites the getByTestId call
//     below so the healed spec asserts on the NEW testid.
//
// The page.setContent HTML is already using the NEW testid so the
// healed spec passes verify. Heal only rewrites getByTestId(...)
// arguments — string literals inside setContent are not touched, so
// they must already reflect the post-rename shape.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo-proactive: newsletter signup form is visible', async ({ page }) => {
  await page.setContent(`
    <form data-testid="newsletter-form">
      <input data-testid="newsletter-email-input" type="email" />
      <button data-testid="newsletter-signup-btn">Subscribe</button>
    </form>
  `)
  await expect(page.getByTestId('newsletter-form')).toBeVisible()
  await expect(page.getByTestId('newsletter-email-input')).toBeVisible()
  // Intentionally the OLD testid — heal-proactive rewrites this line
  // to 'newsletter-signup-btn' on the healed spec.
  await expect(page.getByTestId('newsletter-subscribe-btn')).toBeVisible()
})
