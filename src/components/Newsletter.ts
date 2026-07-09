// Newsletter — mailing-list surface added as a baseline SUT anchor
// so the demo PRs have a stable place to rename/extend without touching
// pre-existing components. Quail's diff reader picks up the symbol on
// PR open; renames here are what `demo/heal-with-diff` demonstrates
// against heal-proactive.

export type NewsletterCadence = 'weekly' | 'monthly' | 'quarterly'

export interface NewsletterProps {
  cadence: NewsletterCadence
  listId: string
  archiveUrl?: string
}

export class Newsletter {
  constructor(public props: NewsletterProps) {}

  /**
   * Subscribe an email to the list. The `via` field mirrors the list
   * identifier so quail's API spec generator can bind a signup form's
   * hidden `list-id` field to the same route on the SUT.
   */
  subscribe(email: string): { ok: boolean; via: string; cadence: NewsletterCadence } {
    return {
      ok: true,
      via: this.props.listId,
      cadence: this.props.cadence,
    }
  }

  describe(): string {
    return `${this.props.cadence} — list ${this.props.listId}`
  }
}
