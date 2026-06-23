'use client'

import { useRef, useState } from 'react'
import { uploadBlockImage } from '@/lib/blocks/upload'

export default function ImageUploadField({
  value,
  onChangeAction,
  label = 'Image',
}: {
  value: string
  onChangeAction: (url: string) => void
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadBlockImage(file)
    if (url) onChangeAction(url)
    setUploading(false)
  }

  return (
    <div className="bb-field">
      <label className="bb-label">{label}</label>

      {value ? (
        <div className="bb-image-preview">
          <img src={value} alt="" />
          <button className="bb-image-remove" onClick={() => onChangeAction('')}>Remove</button>
        </div>
      ) : (
        <button className="bb-image-upload-btn" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : '+ Upload Image'}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      <input
        className="bb-input bb-input--url"
        type="text"
        placeholder="Or paste an image URL..."
        value={value}
        onChange={e => onChangeAction(e.target.value)}
      />
    </div>
  )
}