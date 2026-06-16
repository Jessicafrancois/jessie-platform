'use client'

export default function MediaDrawer({
  asset,
  onClose,
}: {
  asset: any
  onClose: () => void
}) {

  if (!asset) return null

  return (

    <div className="media-drawer">

      <button
        onClick={onClose}
      >
        ×
      </button>

      <img
        src={asset.file_url}
        alt=""
      />

      <h2>
        {asset.name}
      </h2>

      <p>
        {asset.type}
      </p>

      <p>
        {asset.file_size}
      </p>

    </div>

  )
}