
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { supabase } from '../../lib/supabase'

import '../dashboard/dashboard.css'

import PageBackLink from '@/components/navigation/PageBackLink'

export default function LoginPage() {

  const router =
    useRouter()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setError('')

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) {
  console.error(error)
  alert(error.message)
  return
}

console.log('LOGIN SUCCESS')

router.push('/dashboard')

  }

  return (

    <main className="login-page">
      <PageBackLink />

      {/* LEFT */}

      <section className="login-visual">

        <div>

          <p className="login-kicker">
            Private Workspace
          </p>

          <h1>
            Creative
            <br />
            Operating
            <br />
            System
          </h1>

        </div>

        <p className="login-description">

          Enter the private workspace managing
          essays, ventures, worlds, and systems.

        </p>

      </section>

      {/* RIGHT */}

      <section className="login-panel">

        <form
          onSubmit={handleLogin}
          className="login-card"
        >

          <p className="login-label">
            Dashboard Access
          </p>

          <h2>
            Welcome Back
          </h2>

          <input
            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (

            <p className="login-error">
              {error}
            </p>

          )}

          <button type="submit">
            Enter Dashboard
          </button>

        </form>

      </section>

    </main>

  )
}