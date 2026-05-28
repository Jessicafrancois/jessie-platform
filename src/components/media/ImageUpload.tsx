'use client'

import { supabase } from '../../lib/supabase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
}

export default function ImageUpload({
  value,
  onChange,
}: ImageUploadProps) {
  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) return

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('project-media')
      .upload(fileName, file)

    if (error) {
      console.error(error)
      return
    }

    const { data } = supabase.storage
      .from('project-media')
      .getPublicUrl(fileName)

    onChange(data.publicUrl)
  }

  return (
    <div className="space-y-4">
      {value && (
        <img
          src={value}
          alt=""
          className="w-full h-[220px] object-cover rounded-2xl border border-white/10"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-neutral-400"
      />
    </div>
  )
}