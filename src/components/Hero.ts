// Hero — placeholder TypeScript component. The point isn't that this renders
// anything (it doesn't); it's that the file exports a symbol so quail's PR
// diff reader has something to recognise when the PR touches it.

export interface HeroProps {
  title: string
  subtitle?: string
  ctaHref?: string
}

export class Hero {
  constructor(public props: HeroProps) {}

  describe(): string {
    return `${this.props.title}${this.props.subtitle ? ` — ${this.props.subtitle}` : ''}`
  }
}
