'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import './journal-search.css'



type Entry = {
id: string
title: string
slug: string

intro: string | null
type: string | null

collection_id: string | null
tags: string[] | null

published_at: string | null
reading_time: number | null
}

type Collection = {
id: string
name: string
slug: string
}

export default function JournalSearchClient({
entries,
collections,
}: {
entries: Entry[]
collections: Collection[]
}) {
const [query, setQuery] = useState('')
const [collectionFilter, setCollectionFilter] =
useState('')
const [typeFilter, setTypeFilter] =
useState('')

const entryTypes = [
...new Set(
entries
.map((e) => e.type)
.filter(Boolean)
),
] as string[]

const results = useMemo(() => {
if (
!query &&
!collectionFilter &&
!typeFilter
) {
return []
}


return entries.filter((entry) => {
  const q = query.toLowerCase()

  const matchesQuery =
    !q ||
    entry.title
      .toLowerCase()
      .includes(q) ||
    (entry.intro || '')
      .toLowerCase()
      .includes(q) ||
    (entry.tags || []).some((tag) =>
      tag.toLowerCase().includes(q)
    )

  const matchesCollection =
    !collectionFilter ||
    entry.collection_id ===
      collectionFilter

  const matchesType =
    !typeFilter ||
    entry.type === typeFilter

  return (
    matchesQuery &&
    matchesCollection &&
    matchesType
  )
})


}, [
query,
collectionFilter,
typeFilter,
entries,
])

const showResults =
query ||
collectionFilter ||
typeFilter

return ( <div className="journal-search"> <div className="journal-search-bar">
<input
className="journal-search-input"
type="text"
placeholder="Search by title, keyword, or tag..."
value={query}
onChange={(e) =>
setQuery(e.target.value)
}
autoFocus
/> </div>

  <div className="journal-search-filters">
    <select
      className="journal-search-filter"
      value={collectionFilter}
      onChange={(e) =>
        setCollectionFilter(
          e.target.value
        )
      }
    >
      <option value="">
        All Collections
      </option>

      {collections.map((collection) => (
        <option
          key={collection.id}
          value={collection.id}
        >
          {collection.name}
        </option>
      ))}
    </select>

    <select
      className="journal-search-filter"
      value={typeFilter}
      onChange={(e) =>
        setTypeFilter(e.target.value)
      }
    >
      <option value="">
        All Types
      </option>

      {entryTypes.map((type) => (
        <option
          key={type}
          value={type}
        >
          {type}
        </option>
      ))}
    </select>

    {(query ||
      collectionFilter ||
      typeFilter) && (
      <button
        className="journal-search-clear"
        onClick={() => {
          setQuery('')
          setCollectionFilter('')
          setTypeFilter('')
        }}
      >
        Clear
      </button>
    )}
  </div>

  {showResults && (
    <div className="journal-search-results">
      {results.length === 0 ? (
        <div className="journal-search-empty">
          <p>
            No entries found for "
            {query}"
          </p>

          <span>
            Try a different keyword
            or browse by collection.
          </span>
        </div>
      ) : (
        <>
          <p className="journal-search-count">
            {results.length} result
            {results.length !== 1
              ? 's'
              : ''}
          </p>

          <div className="journal-search-list">
            {results.map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.slug}`}
                className="journal-search-result"
              >
                <div className="journal-search-result-meta">
                  <span className="journal-search-result-type">
                    {entry.type ||
                      'Essay'}
                  </span>

                  {entry.reading_time && (
                    <span>
                      {
                        entry.reading_time
                      }{' '}
                      min
                    </span>
                  )}
                </div>

                <h3 className="journal-search-result-title">
                  {entry.title}
                </h3>

                {entry.intro && (
                  <p className="journal-search-result-excerpt">
                    {entry.intro}
                  </p>
                )}

                {entry.tags &&
                  entry.tags.length >
                    0 && (
                    <div className="journal-search-result-tags">
                      {entry.tags
                        .slice(0, 4)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="journal-search-tag"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )}

  {!showResults && (
    <div className="journal-search-prompt">
      <p>
        Start typing to search{' '}
        {entries.length} entries.
      </p>
    </div>
  )}
</div>


)
}
