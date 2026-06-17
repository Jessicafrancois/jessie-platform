'use client'

import { useState } from 'react'
import Link from 'next/link'
import './journal-search.css'

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