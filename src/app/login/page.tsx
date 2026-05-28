'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kpbehguoxekpfejjahcf.supabase.co',
  'sb_publishable_FEPU3lc-DQs86oa-Q7Fl9A_pP6pDxrZ'
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    console.log(data)
    console.log(error)
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-4">

        <h1 className="text-3xl font-bold">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white p-3 rounded-lg"
        >
          Login
        </button>

      </div>
    </main>
  )
}