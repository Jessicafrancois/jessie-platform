'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function DashboardJournalPage() {

  const [essays, setEssays] = useState<any[]>([])

  useEffect(() => {
    fetchEssays()
  }, [])

  async function fetchEssays() {

    const { data } = await supabase
      .from('essays')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setEssays(data)
    }
  }

  return (
    <main
      style={{
        padding: '4rem',
        background: '#111',
        color: 'white',
        minHeight: '100vh',
      }}
    >

      <h1 style={{ marginBottom: '3rem' }}>
        Journal CMS
      </h1>

      <a
        href="/dashboard/journal/new"
        style={{
          display: 'inline-block',
          marginBottom: '3rem',
          padding: '1rem 1.5rem',
          background: 'white',
          color: 'black',
          textDecoration: 'none',
        }}
      >
        New Essay
      </a>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
        }}
      >

        {essays.map((essay) => (

          <div
            key={essay.id}
            style={{
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >

            <a
            href={`/dashboard/journal/${essay.id}`}
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >

            <h2>{essay.title}</h2>

          </a>

            <p>{essay.intro}</p>

          </div>

        ))}

      </div>

    </main>
  )
}