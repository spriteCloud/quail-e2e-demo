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

import { type Page, type Browser, expect, devices, test } from '@playwright/test'

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
// v0.22 — when set, unhealed failures become test.skip() instead of red.
// The skip is logged; quail-review can adopt the skip or fix the source
// step. Turns "confabulated assertion" from red to yellow — demoable
// signal that quail knows it doesn't know.
const HEAL_SKIP_UNHEALED = process.env.QUAIL_HEAL_SKIP_UNHEALED === '1'

// v0.22 — in-process cache keyed by (op, args). Same broken locator
// across many tests = one LLM call. Populated even on empty result so
// sibling tests don't re-ask for the same "not-on-page" verdict.
// Per-worker (Playwright workers are separate Node processes); a
// small waste of workers × initial cache miss vs. file-based cache
// complexity.
const HEAL_CACHE = new Map<string, string[]>()

function healCacheKey(op: string, args: Record<string, string>): string {
  return `${op}:${JSON.stringify(args)}`
}

// v0.23 — role-aware DOM pre-check via page.locator + :has-text(). Old
// v0.22 substring check let hits like `seen role=heading name='About'`
// through as long as the WORD "About" appeared anywhere in the DOM
// (footer link, meta tag, alt text). Then we called the LLM asking for
// heading CSS, and every candidate failed because there's no h1/h2 with
// that text — the page just has a link. Role-aware check rejects those
// before the LLM call. Cheap: one Playwright query, no network.
//
// Unknown roles (alert, status, main, navigation, dialog, tab, etc.)
// fall through to a permissive "trust the LLM" verdict — they're
// semantically fuzzier and the LLM is more likely to produce a valid
// selector for them anyway.
async function pageHasRoleName(page: Page, role: string, name: string): Promise<boolean> {
  if (!name) return true
  const selector = roleTextSelector(role, name)
  if (!selector) return true
  try {
    return (await page.locator(selector).count()) > 0
  } catch {
    return true
  }
}

// pageHasFillLabel — for opFill, check whether ANY input on the page
// carries the label text as its aria-label, placeholder, or associated
// <label>. Runs the same cheap Playwright query used above. Unknown /
// exotic input surfaces fall through to permissive.
async function pageHasFillLabel(page: Page, label: string): Promise<boolean> {
  if (!label) return true
  const q = escapeText(label)
  const selector = `label:has-text("${q}"), input[placeholder*="${q}" i], input[aria-label*="${q}" i], textarea[placeholder*="${q}" i], textarea[aria-label*="${q}" i]`
  try {
    return (await page.locator(selector).count()) > 0
  } catch {
    return true
  }
}

// roleTextSelector maps a WAI-ARIA role to a Playwright selector that
// resolves the role via native HTML tag OR an explicit [role="…"] +
// case-insensitive :has-text(name). Returns '' for roles we don't
// narrow (permissive fall-through).
function roleTextSelector(role: string, name: string): string {
  const q = escapeText(name)
  switch (role) {
    case 'heading':
      return `:is(h1, h2, h3, h4, h5, h6, [role="heading"]):has-text("${q}")`
    case 'link':
      return `:is(a[href], [role="link"]):has-text("${q}")`
    case 'menuitem':
      return `[role="menuitem"]:has-text("${q}")`
    case 'button':
      return `:is(button, [role="button"], input[type="submit"], input[type="button"]):has-text("${q}")`
    case 'textbox':
    case 'searchbox':
      return `:is([role="${role}"], input[type="text"], input[type="search"], textarea):has-text("${q}"), input[placeholder*="${q}" i], input[aria-label*="${q}" i]`
    case 'combobox':
      return `:is(select, [role="combobox"]):has-text("${q}")`
    case 'checkbox':
    case 'radio':
      return `:is(input[type="${role}"], [role="${role}"]):has-text("${q}")`
    case 'tab':
      return `[role="tab"]:has-text("${q}")`
    case 'option':
      return `:is(option, [role="option"]):has-text("${q}")`
    case 'switch':
      return `[role="switch"]:has-text("${q}")`
    default:
      return ''
  }
}

// escapeText escapes CSS-selector-embedded strings so a name with
// quotes doesn't break the :has-text() query. Cheap, not exhaustive.
function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

// v0.22 — safe wrapper around test.info(). Throws when called outside
// a test context; return null so callers can skip retry/skip logic
// cleanly if that ever happens.
function safeTestInfo(): { retry: number; skip: () => void } | null {
  try { return test.info() as unknown as { retry: number; skip: () => void } } catch { return null }
}

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
    const info = safeTestInfo()

    // v0.22 — retry gate. Playwright config sets retries: 1 in CI. The
    // first attempt already tried heal against the same DOM and got the
    // same LLM verdict. Skip on retry so we don't burn a duplicate call
    // for zero information gain.
    if (info && info.retry > 0) throw e

    const key = healCacheKey(op, args)
    let candidates = HEAL_CACHE.get(key)

    if (candidates === undefined) {
      // v0.23 — role-aware pre-check via Playwright locator, replacing
      // the v0.22 substring scan. Rejects targets that aren't present
      // with the right role even when the word appears elsewhere in
      // the DOM (footer link, meta tag, alt text). Reduces exhausted
      // LLM calls — the highest waste bucket after v0.22 compression.
      const onPage = op === 'fill'
        ? await pageHasFillLabel(page, args.label || '')
        : await pageHasRoleName(page, args.role || '', args.name || '')
      if (!onPage) {
        HEAL_CACHE.set(key, [])
        await logHealed({
          at: new Date().toISOString(),
          op, args,
          outcome: 'skipped-role-not-on-page',
          error: err.message,
        })
        if (HEAL_SKIP_UNHEALED) test.skip()
        throw e
      }

      const dom = await page.content().catch(() => '')
      candidates = await askHealLLM(op, args, dom)
      HEAL_CACHE.set(key, candidates)
    }

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

    // v0.22 — exhausted all candidates. Skip the test (opt-in via
    // QUAIL_HEAL_SKIP_UNHEALED) so the run stays honest but doesn't
    // false-red on things quail knows it can't fix. The skip is
    // logged so quail-review can adopt it or fix the source step.
    await logHealed({
      at: new Date().toISOString(),
      op, args,
      outcome: 'exhausted-skipped',
      error: err.message,
    })
    if (HEAL_SKIP_UNHEALED) test.skip()
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
