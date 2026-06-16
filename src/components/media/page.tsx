import MediaUploader from '@/components/media/MediaUploader'

export default function MediaPage() {
  return (
    <div
      style={{
        padding: '40px',
      }}
    >
      <h1>Media Library</h1>

      <p>
        Upload and manage assets.
      </p>

      <MediaUploader />
    </div>
  )
}

