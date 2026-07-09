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

import { type Page, type Browser, expect, devices } from '@playwright/test'

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

/** Expect the document body to have some rendered text — catches the
 * "blank page" failure mode where the framework mounted but rendered
 * nothing. */
export async function assertBodyHasText(page: Page): Promise<void> {
  const bodyHasText = await page.evaluate(() => (document.body.innerText || '').trim().length > 0)
  expect(bodyHasText, 'body should have text at this viewport').toBe(true)
}

/** Best-effort tap on the primary CTA if one exists. Swallows errors
 * so mobile smoke tests don't fail just because the link fired a
 * navigation. */
export async function tapPrimaryCTA(page: Page): Promise<void> {
  const cta = page.getByRole('link').first()
  if (await cta.count() > 0) {
    await cta.tap().catch(() => {})
  }
}

/** Assert `<html lang>` is set. When `expectedPrefix` is provided the
 * lang's language subtag (before any regional `-XX`) must match
 * case-insensitively. */
export async function assertHtmlLang(page: Page, expectedPrefix?: string): Promise<void> {
  const htmlLang = await page.locator('html').getAttribute('lang')
  expect(htmlLang, '<html lang> attribute should be set on every page').not.toBeNull()
  expect((htmlLang || '').trim().length, '<html lang> should be non-empty').toBeGreaterThan(0)
  if (expectedPrefix !== undefined) {
    const expected = expectedPrefix.split('-')[0].toLowerCase()
    const actual = (htmlLang || '').split('-')[0].toLowerCase()
    expect.soft(actual, `<html lang> should reflect locale ${expectedPrefix}`).toBe(expected)
  }
}

/** Standard responsive viewport matrix — 375×667 mobile, 768×1024
 * tablet, 1280×720 desktop. */
export const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
] as const

/** Standard interaction-state matrix for visual-state snapshots. */
export const INTERACTION_STATES = ['default', 'hover', 'focus'] as const

/** Conservative device matrix for mobile smoke — the four shapes that
 * catch ~95% of real-world mobile regressions. */
export const DEVICE_MATRIX = ['iPhone 13', 'Pixel 5', 'iPad Pro 11', 'Galaxy S9+'] as const

/** Open a browser context with a Playwright device profile applied,
 * run `body(page)` inside, then close the context. */
export async function withDevice(
  browser: Browser,
  name: keyof typeof devices,
  body: (page: Page) => Promise<void>,
): Promise<void> {
  const ctx = await browser.newContext({ ...devices[name] })
  const page = await ctx.newPage()
  try { await body(page) } finally { await ctx.close() }
}

/** Same as withDevice but with the viewport height/width swapped —
 * emulates landscape orientation. Skips (via test.skip) when the
 * profile has no viewport. */
export async function withDeviceRotated(
  browser: Browser,
  name: keyof typeof devices,
  body: (page: Page) => Promise<void>,
): Promise<'skipped' | 'done'> {
  const profile = devices[name]
  if (!profile.viewport) return 'skipped'
  const ctx = await browser.newContext({
    ...profile,
    viewport: { width: profile.viewport.height, height: profile.viewport.width },
  })
  const page = await ctx.newPage()
  try { await body(page); return 'done' } finally { await ctx.close() }
}

/** Run `body(page)` inside a fresh browser context with the given
 * options. The context is closed on return, even when body throws. */
export async function withContext(
  browser: Browser,
  opts: Parameters<Browser['newContext']>[0],
  body: (page: Page) => Promise<void>,
): Promise<void> {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  try { await body(page) } finally { await ctx.close() }
}

/** Op-list vocabulary — the five verbs an LLM-composed journey draws
 * from. Wide enough to cover a real happy-flow, narrow enough that the
 * output surface can't drift into `page.evaluate` acrobatics or
 * hand-rolled locators. Kept 1-line each so the value is in the closed
 * vocabulary, not the wrapper. */

// v0.19 — kept 1:1 with the Go role whitelist in oplist/oplist.go so
// the LLM can emit any role either side accepts without tripping TS
// compile on the generated spec. `alert` and `status` were added there
// for negative-path error-region assertions; adding them here so the
// rendered `opClick`/`opSeen` for them type-checks.
type AriaRole =
  | 'button' | 'link' | 'heading' | 'textbox' | 'checkbox' | 'radio'
  | 'menuitem' | 'tab' | 'combobox' | 'dialog' | 'listbox' | 'option'
  | 'searchbox' | 'switch' | 'main' | 'navigation' | 'banner'
  | 'alert' | 'status'

// v0.21 — Runtime self-heal layer. When an op's original locator times
// out (element not found, strict-mode multi-match, etc.), and the
// QUAIL_RUNTIME_HEAL env var is set, prims ask the same LLM used by
// generate/heal for the top-N CSS selector candidates against the
// current DOM. Each is tried in order; the first that succeeds wins,
// the swap is logged to QUAIL_HEAL_LOG so quail-review can open a
// heal-adoption PR after the run. Off by default — set
// QUAIL_RUNTIME_HEAL=1 to enable. Env: OPENAI_BASE_URL,
// OPENAI_API_KEY, QUAIL_MODEL (all shared with the Go tooling).
const HEAL_ENABLED = process.env.QUAIL_RUNTIME_HEAL === '1'
const HEAL_URL = (process.env.OPENAI_BASE_URL || '').replace(/\/$/, '')
const HEAL_KEY = process.env.OPENAI_API_KEY || ''
const HEAL_MODEL = process.env.QUAIL_MODEL || 'qwen3-coder-next:latest'
const HEAL_LOG = process.env.QUAIL_HEAL_LOG || 'quail-runtime-heals.jsonl'
const HEAL_DOM_LIMIT = 12000  // ~3k tokens; leaves headroom for prompt + response
const HEAL_TOP_N = 5

async function askHealLLM(op: string, args: Record<string, string>, dom: string): Promise<string[]> {
  if (!HEAL_URL) return []
  const domSnippet = dom.length > HEAL_DOM_LIMIT ? dom.slice(0, HEAL_DOM_LIMIT) + '\n<!-- ...truncated -->' : dom
  const prompt = `A Playwright locator failed on op=${op} args=${JSON.stringify(args)}.
Given the current page DOM (truncated), return the TOP ${HEAL_TOP_N} raw CSS selectors most likely to resolve the intended element, one per line, no prose, no numbering, no backticks.

Current DOM:
${domSnippet}
`
  try {
    const res = await fetch(HEAL_URL + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${HEAL_KEY}` },
      body: JSON.stringify({
        model: HEAL_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.2,
      }),
    })
    if (!res.ok) return []
    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = data?.choices?.[0]?.message?.content ?? ''
    return content
      .split('\n')
      .map((s: string) => s.trim().replace(/^```(?:css)?$/i, ''))
      .filter((s: string) => s && !s.startsWith('//') && !s.startsWith('#') && !/^\d+\./.test(s))
      .slice(0, HEAL_TOP_N)
  } catch {
    return []
  }
}

async function logHealed(entry: Record<string, unknown>): Promise<void> {
  try {
    const fs = await import('node:fs/promises')
    await fs.appendFile(HEAL_LOG, JSON.stringify(entry) + '\n')
  } catch { /* silent — logging is best-effort */ }
}

async function withHeal<T>(
  page: Page,
  op: string,
  args: Record<string, string>,
  original: () => Promise<T>,
  applyCandidate: (selector: string) => Promise<T>,
): Promise<T> {
  if (!HEAL_ENABLED) return original()
  try {
    return await original()
  } catch (e) {
    const err = e as Error
    const candidates = await askHealLLM(op, args, await page.content().catch(() => ''))
    for (const selector of candidates) {
      try {
        const result = await applyCandidate(selector)
        await logHealed({
          at: new Date().toISOString(),
          op, args,
          healed_with: selector,
          error: err.message,
        })
        return result
      } catch { /* try next candidate */ }
    }
    throw e
  }
}

export async function opGoto(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

export async function opClick(page: Page, role: AriaRole, name: string): Promise<void> {
  // v0.19 — `.first()` matches opSeen/opFill semantics. Without it,
  // strict-mode throws when the role+name pair matches more than one
  // element (very common: sticky-nav "Contact" + footer "Contact"
  // both match `getByRole('link', { name: 'Contact' })`). Journey
  // authors mean "the first one that satisfies the accessible
  // predicate" — matching Playwright's own single-clickable-target
  // ergonomic elsewhere.
  // v0.21 — withHeal wraps: on failure + QUAIL_RUNTIME_HEAL=1, ask the
  // LLM for CSS candidates against the live DOM and try them.
  return withHeal(page, 'click', { role, name },
    () => page.getByRole(role, { name }).first().click(),
    (selector) => page.locator(selector).first().click(),
  )
}

export async function opFill(page: Page, label: string, value: string): Promise<void> {
  // Resolve by label first (getByLabel matches <label for>, aria-label,
  // wrapping <label>, and aria-labelledby). When the input's only user-
  // visible signal is a placeholder, fall through to getByPlaceholder
  // so the op-list vocab stays a single verb the LLM can use regardless
  // of whether the site has proper <label> markup.
  return withHeal(page, 'fill', { label, value },
    async () => {
      const byLabel = page.getByLabel(label)
      if (await byLabel.count() > 0) {
        await byLabel.first().fill(value)
        return
      }
      await page.getByPlaceholder(label).first().fill(value)
    },
    (selector) => page.locator(selector).first().fill(value),
  )
}

export async function opPress(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key)
}

export async function opSeen(page: Page, role: AriaRole, name: string): Promise<void> {
  return withHeal(page, 'seen', { role, name },
    async () => {
      const locator = name === '' ? page.getByRole(role) : page.getByRole(role, { name })
      await expect(locator.first()).toBeVisible()
    },
    async (selector) => {
      await expect(page.locator(selector).first()).toBeVisible()
    },
  )
}

/** Track pageerror + console.error messages while `body(page)` runs.
 * Returns the collected messages. Useful for framework-unmount /
 * hydration crash detection. */
export async function collectErrors(
  page: Page,
  body: () => Promise<void>,
): Promise<string[]> {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await body()
  return errors
}
