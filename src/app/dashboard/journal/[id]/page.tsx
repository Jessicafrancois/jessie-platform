'use client'

import { useEffect, useState } from 'react'

import { supabase } from '../../../../lib/supabase'

type Props = {
  params: {
    id: string
  }
}

export default function EditEssayPage({
  params,
}: Props) {

  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchEssay()
  }, [])

  async function fetchEssay() {

    const { data } = await supabase
      .from('essays')
      .select('*')
      .eq('id', params.id)
      .single()

    if (data) {

      setTitle(data.title)
      setIntro(data.intro)
      setImage(data.image)

      setContent(
        data.content?.[0]?.content || ''
      )
    }

    setLoading(false)
  }

  async function updateEssay() {

    const slug = title
      .toLowerCase()
      .replaceAll(' ', '-')

    await supabase
      .from('essays')
      .update({
        title,
        intro,
        image,
        slug,

        content: [
          {
            type: 'paragraph',
            content,
          },
        ],
      })
      .eq('id', params.id)

    alert('Essay updated')
  }

  async function deleteEssay() {

    const confirmed = confirm(
      'Delete essay?'
    )

    if (!confirmed) return

    await supabase
      .from('essays')
      .delete()
      .eq('id', params.id)

    window.location.href =
      '/dashboard/journal'
  }

  if (loading) {
    return (
      <main
        style={{
          background: '#111',
          color: 'white',
          minHeight: '100vh',
          padding: '4rem',
        }}
      >
        Loading...
      </main>
    )
  }

  return (
    <main
      style={{
        background: '#111',
        color: 'white',
        minHeight: '100vh',
        padding: '4rem',
      }}
    >

      <h1>Edit Essay</h1>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          maxWidth: '700px',
          marginTop: '2rem',
        }}
      >

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Title"
        />

        <input
          value={intro}
          onChange={(e) =>
            setIntro(e.target.value)
          }
          placeholder="Intro"
        />

        <input
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
          }
          placeholder="Image"
        />

        <textarea
          rows={12}
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="Content"
        />

        <button onClick={updateEssay}>
          Save Changes
        </button>

        <button
          onClick={deleteEssay}
          style={{
            background: 'darkred',
            color: 'white',
          }}
        >
          Delete Essay
        </button>

      </div>

    </main>
  )
}