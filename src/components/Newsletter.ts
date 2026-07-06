// Newsletter — placeholder TypeScript component representing the newsletter
// signup surface on spritecloud.com. Added to exercise quail-review's
// generate + diff-only-generate paths against a small, isolated PR diff.

export type Cadence = 'weekly' | 'monthly'

export interface NewsletterProps {
  endpoint: string
  cadence: Cadence
  doubleOptIn?: boolean
}

export class Newsletter {
  constructor(public props: NewsletterProps) {}

  subscribe(email: string): { ok: boolean; via: string; cadence: Cadence } {
    return { ok: true, via: this.props.endpoint, cadence: this.props.cadence }
  }

  describe(): string {
    return `Newsletter (${this.props.cadence}) → ${this.props.endpoint}`
  }
}
