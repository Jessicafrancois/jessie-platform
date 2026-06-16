'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HistoryPage() {

  const [revisions, setRevisions] =
    useState<any[]>([])

  useEffect(() => {

    loadRevisions()

  }, [])

  async function loadRevisions() {

    const { data } =
      await supabase

      .from('entry_revisions')

      .select('*')

      .order(
        'created_at',
        { ascending: false }
      )

    setRevisions(data || [])
  }

  return (

    <div className="history-page">

      <h1>
        Version History
      </h1>

      {revisions.map(
        revision => (

        <div
          key={revision.id}
          className="revision-card"
        >

          <h3>
            {revision.title}
          </h3>

          <p>
            {new Date(
              revision.created_at
            ).toLocaleString()}
          </p>

        </div>

      ))}
    </div>
  )
}