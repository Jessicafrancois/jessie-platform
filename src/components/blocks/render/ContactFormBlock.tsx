'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ContactFormContent } from '@/lib/blocks/types'

export default function ContactFormBlock({
  content,
}: {
  content: ContactFormContent
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    const { error } = await supabase.from('inquiries').insert({
      form_type: content.formType,
      name: form.name,
      email: form.email,
      message: form.message,
    })

    setStatus(error ? 'error' : 'sent')
  }

  return (
    <section className="block-contact-form">
      {content.heading && <h2>{content.heading}</h2>}
      {content.subheading && <p className="block-contact-sub">{content.subheading}</p>}

      {status === 'sent' ? (
        <div className="block-contact-success">
          <p>{content.successMessage || "Thanks — I'll be in touch soon."}</p>
        </div>
      ) : (
        <form className="block-contact-fields" onSubmit={handleSubmit}>
          <div className="block-contact-row">
            <div className="block-contact-field">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                required
              />
            </div>
            <div className="block-contact-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="block-contact-field">
            <label>Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={e => set('message', e.target.value)}
              required
            />
          </div>

          {status === 'error' && (
            <p className="block-contact-error">Something went wrong — please try again.</p>
          )}

          <button
            type="submit"
            className="block-contact-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : content.submitLabel || 'Send Message'}
          </button>
        </form>
      )}
    </section>
  )
}