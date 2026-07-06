// Card — minimal React-style component with a labeled button.
// Used to exercise quail-review's proactive heal path: renaming the
// aria-label triggers heal to walk the spec corpus and propose
// getByLabel-locator updates.

export type CardProps = { title: string }

export function Card({ title }: CardProps) {
  return (
    <div className="card" role="region" aria-label={title}>
      <h2>{title}</h2>
      <button aria-label="Save">Save</button>
    </div>
  )
}
