'use client'

import { useState } from 'react'

type CoverSelectorProps = {
  coverImage: string
  setCoverImageAction: (
    value: string
  ) => void
}

export default function CoverSelector({
  coverImage,
  setCoverImageAction,
}: CoverSelectorProps) {

  const [urlInput, setUrlInput] =
    useState('')

  const [showOptions, setShowOptions] =
    useState(false)

  const [showUrlInput, setShowUrlInput] =
    useState(false)

  return (

    <div className="cover-selector">

      {coverImage ? (

        <div className="cover-preview">

          <img
            src={coverImage}
            alt="Cover Image"
          />

          <div className="cover-overlay">

            <button
              type="button"
              className="cover-button"
              onClick={() =>
                setShowOptions(
                  !showOptions
                )
              }
            >
              Change Cover
            </button>

            <button
              type="button"
              className="cover-button"
              onClick={() =>
                setCoverImageAction('')
              }
            >
              Remove
            </button>

          </div>

          {showOptions && (

            <div className="cover-options">

              <label
                className="cover-button"
              >
                Upload

                <input
                  hidden
                  type="file"
                  accept="image/*"

                  onChange={(e) => {

                    const file =
                      e.target.files?.[0]

                    if (!file) return

                    const imageUrl =
                      URL.createObjectURL(
                        file
                      )

                    setCoverImageAction(
                      imageUrl
                    )

                    setShowOptions(
                      false
                    )

                  }}
                />

              </label>

              <button
                type="button"
                className="cover-button"
                onClick={() =>
                  setShowUrlInput(
                    !showUrlInput
                  )
                }
              >
                Paste URL
              </button>

              <button
                type="button"
                className="cover-button"
                onClick={() =>
                  alert(
                    'Media Library coming soon'
                  )
                }
              >
                Media Library
              </button>

            </div>

          )}

          {showUrlInput && (

            <div className="cover-url-input">

              <input
                type="text"
                placeholder="Paste image URL..."

                value={urlInput}

                onChange={(e) =>
                  setUrlInput(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="cover-button"

                onClick={() => {

                  if (!urlInput)
                    return

                  setCoverImageAction(
                    urlInput
                  )

                  setShowUrlInput(
                    false
                  )

                }}
              >
                Use URL
              </button>

            </div>

          )}

        </div>

      ) : (

        <div className="cover-empty">

          <div className="cover-empty-content">

         <input
            type="button"
            value="Add Cover"
            className="cover-primary-button"
            onClick={() =>
              setShowOptions(
                !showOptions
              )
            }
          />

            {showOptions && (

              <div className="cover-options">

                <label
                  className="cover-button"
                >
                  Upload

                  <input
                    hidden
                    type="file"
                    accept="image/*"

                    onChange={(e) => {

                      const file =
                        e.target.files?.[0]

                      if (!file) return

                      const imageUrl =
                        URL.createObjectURL(
                          file
                        )

                      setCoverImageAction(
                        imageUrl
                      )

                    }}
                  />

                </label>

                <button
                  type="button"
                  className="cover-button"
                  onClick={() =>
                    setShowUrlInput(
                      !showUrlInput
                    )
                  }
                >
                  Paste URL
                </button>

                <button
                  type="button"
                  className="cover-button"
                  onClick={() =>
                    alert(
                      'Media Library coming soon'
                    )
                  }
                >
                  Media Library
                </button>

              </div>

            )}

            {showUrlInput && (

              <div className="cover-url-input">

                <input
                  type="text"
                  placeholder="Paste image URL..."

                  value={urlInput}

                  onChange={(e) =>
                    setUrlInput(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="cover-button"

                  onClick={() => {

                    if (!urlInput)
                      return

                    setCoverImageAction(
                      urlInput
                    )

                  }}
                >
                  Use URL
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  )
}