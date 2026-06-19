// ContactForm — placeholder TypeScript component representing the contact
// surface on spritecloud.com. Quail's probe pairs the page's <form> with
// this kind of symbol when generating @kind:param / @kind:boundary tests.

export type ContactKind = 'general' | 'sales' | 'support'

export interface ContactFormProps {
  endpoint: string
  kind: ContactKind
  honeypot?: boolean
}

export class ContactForm {
  constructor(public props: ContactFormProps) {}

  submit(payload: Record<string, string>): { ok: boolean; via: string } {
    return { ok: true, via: this.props.endpoint }
  }

  describe(): string {
    return `Contact form (${this.props.kind}) → ${this.props.endpoint}`
  }
}
