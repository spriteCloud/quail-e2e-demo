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

export class FAQ {
  constructor(public props: FAQProps) {}

  /**
   * Return the visible (open) items so the test harness can assert
   * which question is currently expanded. Returns an empty array
   * when the accordion is fully collapsed.
   */
  visibleItems(openIdx: number): FAQItem[] {
    if (openIdx < 0 || openIdx >= this.props.items.length) return []
    return [this.props.items[openIdx]]
  }

  describe(): string {
    return `FAQ (${this.props.topic}) → ${this.props.items.length} items`
  }
}
