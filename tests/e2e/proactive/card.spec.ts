import { test, expect } from '@playwright/test'

// Fixture spec used to exercise quail-review's proactive heal path.
// The referenced anchor `getByLabel('Save changes')` mirrors the aria-label in
// src/components/Card.tsx. When the PR renames that aria-label, the
// heal-proactive step should walk this corpus and propose an updated
// getByLabel target.

test('@proactive Card exposes the primary button', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Save changes')).toBeVisible()
})
