// Quail test primitives. High-level building blocks that shift the LLM's
// role from producing whole spec files to composing sequences of these
// calls. Wrapped over the Playwright fixture surface so the emitted
// specs stay declarative (`await tapCTA(page)` beats a paragraph of
// `boundingBox` arithmetic).
//
// This file is written once per repo by gen.EnsureScaffold and imported
// by every generated .spec.ts. It has no dependency on the rest of the
// suite so it can be edited in-place if a project needs to override a
// primitive.

import { type Page, expect, devices } from '@playwright/test'

export const iPhone = devices['iPhone 13']

/** Navigate under the iPhone 13 profile. Landing-safe wait state. */
export async function mobileNav(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

/** Best-effort primary CTA on the page. Returns null when the surface
 * has no interactive element (test.skip() at the caller). */
export function primaryCTA(page: Page) {
  return page.getByRole('button').first().or(page.getByRole('link').first())
}

/** Long-press by tap-and-hold at the element's center. Counts synthetic
 * clicks via an exposed hook; returns the click count so the caller can
 * assert `≤ 1`. */
export async function longPressCTA(page: Page): Promise<number> {
  const cta = primaryCTA(page)
  if (await cta.count() === 0) return -1
  let clicks = 0
  await page.exposeFunction('__quailClicked', () => { clicks++ })
  await cta.evaluate(el => el.addEventListener('click', () => (window as any).__quailClicked()))
  const box = await cta.boundingBox()
  if (!box) return -1
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(50)
  return clicks
}

/** Horizontal swipe synthesised as two chained taps at 80% → 20% width. */
export async function swipeHorizontal(page: Page): Promise<void> {
  const v = page.viewportSize() || { width: 390, height: 844 }
  await page.touchscreen.tap(v.width * 0.8, v.height / 2)
  await page.touchscreen.tap(v.width * 0.2, v.height / 2)
}

/** Pinch-zoom synthesised via ctrl+wheel at the center — the same event
 * browsers dispatch for a real pinch on trackpads. */
export async function pinchCenter(page: Page): Promise<void> {
  const v = page.viewportSize() || { width: 390, height: 844 }
  const cx = v.width / 2
  const cy = v.height / 2
  await page.mouse.move(cx, cy)
  await page.evaluate(({ cx, cy }: { cx: number; cy: number }) => {
    const ev = new WheelEvent('wheel', { deltaY: -120, ctrlKey: true, clientX: cx, clientY: cy, bubbles: true, cancelable: true })
    document.elementFromPoint(cx, cy)?.dispatchEvent(ev)
  }, { cx, cy })
}

/** Flick-scroll by tapping top-then-bottom `n` times. */
export async function flickScroll(page: Page, n = 5): Promise<void> {
  const v = page.viewportSize() || { width: 390, height: 844 }
  const cx = v.width / 2
  for (let i = 0; i < n; i++) {
    await page.touchscreen.tap(cx, v.height * 0.1)
    await page.touchscreen.tap(cx, v.height * 0.9)
  }
  await page.waitForLoadState('domcontentloaded').catch(() => {})
}

/** Expect the top-level heading to be visible. Matches h1 or an
 * ARIA-labelled level-1 heading. */
export async function assertHeadingVisible(page: Page): Promise<void> {
  await expect(page.locator('h1, [role="heading"][aria-level="1"]').first()).toBeVisible()
}
