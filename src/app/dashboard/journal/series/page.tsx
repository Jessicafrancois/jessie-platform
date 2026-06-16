'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import '../cms.css'

type Series = {
  id: string
  name: string
  slug: string
  description: string
}

export default function SeriesPage() {

  const [series, setSeries] =
    useState<Series[]>([])

  const [search, setSearch] =
    useState('')

  const [name, setName] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [editing, setEditing] = 
  useState<Series | null>(null)

  useEffect(() => {
    fetchSeries()
  }, [])

async function saveEdit() {
  if (!editing) return
  setLoading(true)
  await supabase
    .from('series')
    .update({
      name: editing.name,
      description: editing.description,
    })
    .eq('id', editing.id)
  setEditing(null)
  await fetchSeries()
  setLoading(false)
}

  async function fetchSeries() {

    const { data, error } =
      await supabase

        .from('series')

        .select('*')

        .order(
          'name',
          {
            ascending: true,
          }
        )

    if (error) {
      console.error(error)
      return
    }

    setSeries(data || [])
  }

  async function createSeries() {

    if (!name.trim()) return

    setLoading(true)

    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9\s-]/g,
          ''
        )
        .replace(
          /\s+/g,
          '-'
        )

    const { error } =
      await supabase

        .from('series')

        .insert({
          name,
          slug,
          description,
        })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setName('')
    setDescription('')

    await fetchSeries()

    setLoading(false)
  }

  async function deleteSeries(
    id: string
  ) {

    const confirmed =
      window.confirm(
        'Delete this series?'
      )

    if (!confirmed) return

    const { error } =
      await supabase

        .from('series')

        .delete()

        .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    fetchSeries()
  }

  const filteredSeries =
    series.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    )

  return (

    <main className="cms-page">

      <div className="cms-header">

        <div>

          <h1>
            Series
          </h1>

          <p>
            Group entries into larger narratives.
          </p>

        </div>

      </div>

      <div className="cms-create">

        <input
          type="text"
          placeholder="Series Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <button
          className="cms-button"
          onClick={createSeries}
          disabled={loading}
        >
          {
            loading
              ? 'Creating...'
              : 'Create Series'
          }
        </button>

      </div>

      <input
        className="cms-search"
        placeholder="Search Series..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="cms-grid">

        {filteredSeries.map(
          (item) => (

          <div
            key={item.id}
            className="cms-card"
          >

            <h3>
              {item.name}
            </h3>

            <p>
              {item.description}
            </p>

            <span
              className="cms-slug"
            >
              /{item.slug}
            </span>

            {editing?.id === item.id ? (
              <div className="cms-card-edit">
                <input
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="cms-edit-input"
                />
                <textarea
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="cms-edit-textarea"
                />
                <div className="cms-edit-actions">
                  <button className="cms-button" onClick={saveEdit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cms-button-ghost" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => setEditing(item)}>Edit</button>
                <button onClick={() => deleteSeries(item.id)}>Delete</button>
              </>
            )}

          </div>
          )
        )}

      </div>

    </main>

  )
}