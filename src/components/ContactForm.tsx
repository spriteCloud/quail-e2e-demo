// ContactForm — new contact-us surface for the marketing site.
// Includes email + free-text message + a live preview panel.

import { useState } from 'react'

export function ContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  return (
    <form
      data-testid="contact-form"
      onSubmit={(e) => {
        e.preventDefault()
        submitContact(email, message)
      }}
    >
      <label htmlFor="contact-email">Your email</label>
      <input
        id="contact-email"
        data-testid="contact-email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
      />

      <label htmlFor="contact-message">Your message</label>
      <textarea
        id="contact-message"
        data-testid="contact-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help?"
      />

      <div className="preview">
        <span className="preview-label">Live preview</span>
        <div
          data-testid="contact-preview"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>

      <button type="submit" data-testid="contact-submit">
        Send
      </button>
    </form>
  )
}

function submitContact(email: string, message: string) {
  return fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, message }),
  })
}
