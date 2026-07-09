// Pricing — commercial-plans surface added to test quail's PR-diff
// awareness end-to-end. When this PR opens, the `generate` job in
// .github/workflows/quail.yml should see the new `Pricing` symbol,
// probe the live SUT (https://www.spritecloud.com), and open a
// follow-up "quail: tests for PR #N" PR with a draft journey suite.

export type PricingTier = 'starter' | 'growth' | 'enterprise'

export interface PricingPlanProps {
  tier: PricingTier
  monthlyEur: number
  seatsIncluded: number
  overageEurPerSeat?: number
}

export class PricingPlan {
  constructor(public props: PricingPlanProps) {}

  /**
   * Compute the invoice for a headcount. Returns the base fee plus
   * per-seat overage. Quoted in EUR, VAT excluded — customer invoices
   * apply the standard NL 21% rate downstream.
   */
  monthlyInvoice(seats: number): { base: number; overage: number; total: number } {
    const overageSeats = Math.max(0, seats - this.props.seatsIncluded)
    const overage = overageSeats * (this.props.overageEurPerSeat ?? 0)
    return {
      base: this.props.monthlyEur,
      overage,
      total: this.props.monthlyEur + overage,
    }
  }

  describe(): string {
    return `${this.props.tier} — €${this.props.monthlyEur}/mo (${this.props.seatsIncluded} seats)`
  }
}
