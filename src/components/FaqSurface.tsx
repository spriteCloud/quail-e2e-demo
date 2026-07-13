// FaqSurface — support/help centre entry point. New surface with no
// existing tests, so `quail generate` should probe the DOM, discover
// the accordion + search anchors, and emit a fresh Playwright spec
// exercising the primary journeys (search filter, accordion expand,
// contact CTA).

import { useState } from 'react'

export interface FaqEntry {
  id: string
  question: string
  answer: string
}

export interface FaqSurfaceProps {
  entries: FaqEntry[]
  onContactRequest?: () => void
}

export function FaqSurface(props: FaqSurfaceProps) {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = q
    ? props.entries.filter(
        (e) =>
          e.question.toLowerCase().includes(q) ||
          e.answer.toLowerCase().includes(q),
      )
    : props.entries

  return (
    <section data-testid="faq-surface" aria-labelledby="faq-heading">
      <h1 id="faq-heading" data-testid="faq-heading">
        Frequently asked questions
      </h1>

      <input
        type="search"
        data-testid="faq-search"
        placeholder="Search the help centre"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search FAQ entries"
      />

      <ul data-testid="faq-list">
        {filtered.map((e) => {
          const isOpen = openId === e.id
          return (
            <li
              key={e.id}
              data-testid={`faq-item-${e.id}`}
              className={isOpen ? 'is-open' : ''}
            >
              <button
                type="button"
                data-testid={`faq-toggle-${e.id}`}
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : e.id)}
              >
                {e.question}
              </button>
              {isOpen ? (
                <p data-testid={`faq-answer-${e.id}`}>{e.answer}</p>
              ) : null}
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 ? (
        <p data-testid="faq-empty">
          No entries match &quot;{query}&quot;. Try a different search or contact
          us directly.
        </p>
      ) : null}

      <button
        type="button"
        data-testid="faq-contact-cta"
        onClick={props.onContactRequest}
      >
        Still stuck? Contact support
      </button>
    </section>
  )
}
