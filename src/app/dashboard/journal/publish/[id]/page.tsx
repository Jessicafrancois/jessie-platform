'use client'

import { useState } from 'react'

export default function PublishingPage() {

  const [seoTitle, setSeoTitle] =
    useState('')

  const [metaDescription, setMetaDescription] =
    useState('')

  const [canonicalUrl, setCanonicalUrl] =
    useState('')

  const [publishDate, setPublishDate] =
    useState('')

  const [featuredImage, setFeaturedImage] =
    useState('')

  return (

    <div className="publishing-page">

      <div className="publishing-header">

        <h1>
          Publishing Settings
        </h1>

        <p>
          Configure SEO, scheduling,
          and social sharing.
        </p>

      </div>

      <div className="publishing-card">

        <h2>
          Search Engine Optimization
        </h2>

        <label>
          SEO Title
        </label>

        <input
          type="text"
          value={seoTitle}
          onChange={(e) =>
            setSeoTitle(
              e.target.value
            )
          }
        />

        <label>
          Meta Description
        </label>

        <textarea
          value={metaDescription}
          onChange={(e) =>
            setMetaDescription(
              e.target.value
            )
          }
        />

        <label>
          Canonical URL
        </label>

        <input
          type="text"
          value={canonicalUrl}
          onChange={(e) =>
            setCanonicalUrl(
              e.target.value
            )
          }
        />

      </div>

      <div className="publishing-card">

        <h2>
          Scheduling
        </h2>

        <label>
          Publish Date
        </label>

        <input
          type="datetime-local"
          value={publishDate}
          onChange={(e) =>
            setPublishDate(
              e.target.value
            )
          }
        />

      </div>

      <div className="publishing-card">

        <h2>
          Social Preview
        </h2>

        <label>
          Featured Image
        </label>

        <input
          type="file"
          accept="image/*"
        />

      </div>

    </div>

  )
}