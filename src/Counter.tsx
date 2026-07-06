import { useState } from 'react'

// A minimal component that gives quail's diff-driven generate path
// something to see — form + submit + testid anchors. Kept in-tree so
// generate-diff mode has a source diff to scaffold against.
export function Counter() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  return (
    <div data-testid="counter-root">
      <h1>Counter demo</h1>
      <form data-testid="counter-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name-input">Name</label>
        <input id="name-input" data-testid="name-input"
          type="text" required
          value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" data-testid="submit">Save</button>
      </form>
      <button data-testid="inc" onClick={() => setCount(count + 1)}>+</button>
      <div data-testid="counter-display">{count}</div>
    </div>
  )
}
