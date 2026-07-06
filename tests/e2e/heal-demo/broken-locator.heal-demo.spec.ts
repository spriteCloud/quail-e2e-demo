// HEAL demo — a deliberately broken locator. The `@smoke`-tagged test
// below fails because `getByTestId('quail-heal-demo-anchor')` does not
// exist on the spritecloud homepage. Smoke writes the failure into
// playwright-report.json which the heal job consumes; quail proposes
// a higher-stability replacement (getByRole / getByText) using the
// heal LLM-fallback added in v0.96.2.
//
// Scoped narrowly under tests/e2e/heal-demo/ — removing the directory
// removes the entire heal demo without touching the auto-generated
// suite.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo: spritecloud homepage shows the hero anchor', async ({ page }) => {
  await page.goto('https://www.spritecloud.com/')
  // INTENTIONALLY broken: this test-id is not on the page. heal will
  // propose a higher-stability anchor from the existing suite's a11y
  // specs (typically getByRole('heading') or getByText for the hero
  // copy).
  await expect(page.getByTestId('counter-root')).toBeVisible({ timeout: 4000 })
})
