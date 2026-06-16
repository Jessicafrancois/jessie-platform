'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import '../cms.css'

type Tag = {
  id: string
  name: string
  slug: string
}

export default function TagsPage() {

  const [tags, setTags] =
    useState<Tag[]>([])

  const [search, setSearch] =
    useState('')

  const [name, setName] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {

    const { data, error } =
      await supabase

        .from('tags')

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

    setTags(data || [])
  }

  async function createTag() {

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

        .from('tags')

        .insert({
          name,
          slug,
        })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setName('')

    await fetchTags()

    setLoading(false)
  }

  async function deleteTag(
    id: string
  ) {

    const confirmed =
      window.confirm(
        'Delete this tag?'
      )

    if (!confirmed) return

    const { error } =
      await supabase

        .from('tags')

        .delete()

        .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    fetchTags()
  }

  const filteredTags =
    tags.filter(
      (tag) =>
        tag.name
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
            Tags
          </h1>

          <p>
            Organize and classify entries.
          </p>

        </div>

      </div>

      <div className="cms-create">

        <input
          type="text"
          placeholder="Tag Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <button
          className="cms-button"
          onClick={createTag}
          disabled={loading}
        >
          {
            loading
              ? 'Creating...'
              : 'Create Tag'
          }
        </button>

      </div>

      <input
        className="cms-search"
        placeholder="Search Tags..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="cms-grid">

        {filteredTags.map(
          (tag) => (

          <div
            key={tag.id}
            className="cms-card"
          >

            <h3>
              {tag.name}
            </h3>

            <span
              className="cms-slug"
            >
              /{tag.slug}
            </span>

            <div
              className="cms-card-actions"
            >

              <button>
                Edit
              </button>

              <button
                onClick={() =>
                  deleteTag(
                    tag.id
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>

  )
}