// FAQ — disclosure-pattern accordion for product FAQs. Added as a
// small surface so quail's PR-diff path has a fresh symbol to probe
// against the live site and emit a follow-up tests PR for.

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps {
  topic: 'pricing' | 'product' | 'security'
  items: FAQItem[]
}

/**
 * openFAQ returns the visible (open) item for an accordion at the given
 * index. Returns null when the accordion is fully collapsed. Exported
 * as a top-level function so the quail PR-diff extractor reliably
 * flags it as a journey-bearing symbol.
 */
export function openFAQ(props: FAQProps, openIdx: number): FAQItem | null {
  if (openIdx < 0 || openIdx >= props.items.length) return null
  return props.items[openIdx]
}

/**
 * describeFAQ summarises an FAQ accordion in one line. Useful for the
 * sentry dashboard / SR live-region announcements.
 */
export function describeFAQ(props: FAQProps): string {
  return `FAQ (${props.topic}) → ${props.items.length} items`
}
