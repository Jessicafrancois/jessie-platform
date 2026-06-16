'use client'

import { useState } from 'react'

export default function JournalSearch() {

  const [query, setQuery] =
    useState('')

  return (

    <div className="journal-search">

      <input
        type="text"
        placeholder="Search the archive..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

    </div>

  )
}