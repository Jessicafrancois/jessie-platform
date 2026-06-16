'use client'

import { supabase } from '@/lib/supabase'

export default function MediaUploader() {

  async function uploadFiles(
  e: React.ChangeEvent<HTMLInputElement>
) {

  const files = e.target.files

  if (!files?.length) return

  for (const file of Array.from(files)) {

    const fileName =
  `media/${crypto.randomUUID()}-${file.name}`

    const { error } =
      await supabase.storage
        .from('assets')
        .upload(
          fileName,
          file
        )

    if (error) {
      console.error(error)
      continue
    }

    const { data: publicUrlData } =
      supabase.storage
        .from('assets')
        .getPublicUrl(fileName)

    await supabase
      .from('media_assets')
      .insert({
        name: file.name,

        type: file.type,

        file_url:
          publicUrlData.publicUrl,

        size: file.size,

        file_size: file.size,
      })
  }

  window.location.reload()
  }

  return (
    <label className="media-upload-btn">
      + Add Media

      <input
        type="file"
        multiple
        style={{
          display: 'none',
        }}
        onChange={uploadFiles}
      />
    </label>
  )
}