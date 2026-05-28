'use client'

import './contact.css'

import { useState }
from 'react'

import { supabase }
from '../../lib/supabase'

export default function ContactPage() {

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [sent, setSent] =
  useState(false) 
  
  const [type, setType] =
  useState('Creative Direction')

  async function handleSubmit() {

    await supabase
      .from('inquiries')
      .insert({
  name,
  email,
  type,
  message,
})


    setSent(true)
  }

  return (

    <main className="contact-page">

      <div className="contact-card">

        <h1>
          Contact
        </h1>

        <input
          placeholder="Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <select
  value={type}

  onChange={(e) =>
    setType(e.target.value)
  }
>

  <option>
    Creative Direction
  </option>

  <option>
    Brand Worldbuilding
  </option>

  <option>
    Narrative Strategy
  </option>

  <option>
    Partnership
  </option>

  <option>
    General Inquiry
  </option>

</select>

        <textarea
          placeholder="Message"

          value={message}

          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button onClick={handleSubmit}>
          Send Inquiry
        </button>

        {sent && (

          <p className="contact-success">
            Inquiry sent successfully.
          </p>

        )}
      </div>

    </main>
  )
}