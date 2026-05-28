'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kpbehguoxekpfejjahcf.supabase.co',
  'sb_publishable_FEPU3lc-DQs86oa-Q7Fl9A_pP6pDxrZ'
)

export default function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  async function createProject() {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title,
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          category,
          short_description: description,
          status: 'published',
        },
      ])

    console.log(data)
    console.log(error)

    if (!error) {
      alert('Project Created')

      setTitle('')
      setCategory('')
      setDescription('')
    }
  }

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-xl mx-auto flex flex-col gap-4">

        <h1 className="text-4xl font-bold mb-4">
          Create Project
        </h1>

        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 rounded-lg min-h-[150px]"
        />

        <button
          onClick={createProject}
          className="bg-black text-white p-3 rounded-lg"
        >
          Create Project
        </button>

      </div>
    </main>
  )
}