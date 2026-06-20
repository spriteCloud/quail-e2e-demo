// Self-heal demo: a deliberately broken locator. The element
// `[data-testid="quail-heal-demo-anchor"]` does not exist on
// spritecloud.com, so this spec ALWAYS FAILS. When the CI workflow
// runs `npm run test:smoke`, Playwright writes the failure into
// `playwright-report.json`. The quail action's `heal-mode: on-failure`
// step then reads the report and opens a follow-up PR proposing a
// better-anchored replacement locator (`getByRole`/`getByText`).
//
// This is intentionally inside `tests/e2e/heal-demo/` so it's scoped
// narrowly: removing the directory cleans up the demo without touching
// the auto-generated suite under tests/e2e/{a11y,perf,...}.
import { test, expect } from '@playwright/test'

test('@smoke @heal-demo: spritecloud homepage shows the hero anchor', async ({ page }) => {
  await page.goto('https://www.spritecloud.com/')
  // INTENTIONALLY broken — this test-id doesn't exist on the page.
  // quail heal should suggest replacing the locator with an
  // anchor that does (getByRole('heading') or getByText for the
  // landing hero copy).
  // Use Playwright's getByTestId API so heal recognises it as a
  // locator-call candidate (heal.go line 66 only acts on `getBy*` /
  // `.locator(` calls). The suite's a11y specs already use
  // `page.getByRole(...)` for main/heading anchors on this same
  // page, giving heal a stable alternative to suggest.
  await expect(page.getByTestId('quail-heal-demo-anchor')).toBeVisible({ timeout: 4000 })
})
