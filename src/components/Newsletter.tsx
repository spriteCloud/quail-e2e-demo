// Newsletter — mailing-list signup surface. Promoted from Newsletter.ts
// to Newsletter.tsx so quail's diff reader treats it as a UI file
// (heal-proactive scans .tsx/.jsx/.vue/.svelte for anchor renames).
//
// The `data-testid` attributes are the demo-target anchors: renaming
// any of them in a PR triggers heal-proactive to rewrite matching
// getByTestId() calls in tests/e2e/heal-demo/newsletter-signup.spec.ts.

export type NewsletterCadence = 'weekly' | 'monthly' | 'quarterly'

export interface NewsletterProps {
  cadence: NewsletterCadence
  listId: string
  archiveUrl?: string
}

export function Newsletter(props: NewsletterProps) {
  return (
    <form data-testid="newsletter-form">
      <label htmlFor="newsletter-email">Email</label>
      <input
        id="newsletter-email"
        data-testid="newsletter-email-input"
        type="email"
        placeholder="you@company.com"
      />
      <button
        type="submit"
        data-testid="newsletter-signup-btn"
      >
        Subscribe
      </button>
      <span data-testid="newsletter-cadence-hint">
        {props.cadence} - list {props.listId}
      </span>
    </form>
  )
}
