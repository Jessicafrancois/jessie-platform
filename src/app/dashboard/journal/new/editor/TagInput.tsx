'use client'

import { useState } from 'react'

type TagInputProps = {
  tags: string[]

  setTagsAction: (
    tags: string[]
  ) => void
}

export default function TagInput({
  tags,
  setTagsAction,
}: TagInputProps) {

  const [input, setInput] =
    useState('')

  function addTag() {

    const value =
      input.trim()

    if (!value) return

    if (tags.includes(value))
      return

    setTagsAction([
      ...tags,
      value,
    ])

    setInput('')
  }

  function removeTag(
    tag: string
  ) {

    setTagsAction(
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