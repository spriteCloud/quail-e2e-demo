// Subscribe — newsletter signup surface added to test quail's PR-diff
// awareness. When this PR opens, the `quail` workflow should see the new
// `Subscribe` symbol, probe the live site for a matching journey, and
// open a follow-up PR with a draft scenario for it.

export type SubscribeChannel = 'newsletter' | 'release-notes' | 'security-bulletin'

export interface SubscribeProps {
  channel: SubscribeChannel
  endpoint: string
  doubleOptIn?: boolean
}

export class Subscribe {
  constructor(public props: SubscribeProps) {}

  /**
   * Submit the signup. Returns the upstream endpoint that handled it
   * — the same endpoint quail's API spec generator targets when it
   * discovers a form whose action matches.
   */
  enroll(email: string): { ok: boolean; via: string; doubleOptIn: boolean } {
    return {
      ok: true,
      via: this.props.endpoint,
      doubleOptIn: this.props.doubleOptIn ?? true,
    }
  }

  describe(): string {
    return `Subscribe (${this.props.channel}) → ${this.props.endpoint}`
  }
}
