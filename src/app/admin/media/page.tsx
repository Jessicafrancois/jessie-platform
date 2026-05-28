'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kpbehguoxekpfejjahcf.supabase.co',
  'sb_publishable_FEPU3lc-DQs86oa-Q7Fl9A_pP6pDxrZ'
)

export default function MediaPage() {

  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = event.target.files?.[0]

    if (!file) return

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('project-media')
      .upload(fileName, file)

    console.log(data)
    console.log(error)

    if (data) {

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('project-media')
        .getPublicUrl(fileName)

      setImageUrl(publicUrl)

      alert('Image Uploaded')
    }

    setUploading(false)
  }

  return (
    <main className="min-h-screen p-10">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Media Library
        </h1>

        <input
          type="file"
          onChange={uploadImage}
          className="mb-6"
        />

        {uploading && (
          <p className="mb-6">
            Uploading...
          </p>
        )}

        {imageUrl && (
          <div className="space-y-4">

            <img
              src={imageUrl}
              alt=""
              className="w-full rounded-2xl border"
            />

            <p className="break-all text-sm">
              {imageUrl}
            </p>

          </div>
        )}

      </div>

    </main>
  )
}