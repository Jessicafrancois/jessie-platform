'use client'

import { useState } from 'react'

type TagInputProps = {
  tags: string[]

  setTags: (
    tags: string[]
  ) => void
}

export default function TagInput({
  tags,
  setTags,
}: TagInputProps) {

  const [input, setInput] =
    useState('')

  function addTag() {

    const value =
      input.trim()

    if (!value) return

    if (tags.includes(value))
      return

    setTags([
      ...tags,
      value,
    ])

    setInput('')
  }

  function removeTag(
    tag: string
  ) {

    setTags(
      tags.filter(
        (t) => t !== tag
      )
    )

  }

  return (

    <div className="tag-input">

      <div className="tag-list">

        {tags.map((tag) => (

          <button
            key={tag}
            type="button"
            className="tag-pill"
            onClick={() =>
              removeTag(tag)
            }
          >
            {tag}
            ×
          </button>

        ))}

      </div>

      <input
        type="text"
        value={input}
        placeholder="Add tag..."

        onChange={(e) =>
          setInput(
            e.target.value
          )
        }

        onKeyDown={(e) => {

          if (e.key === 'Enter') {

            e.preventDefault()

            addTag()

          }

        }}
      />

    </div>

  )

}