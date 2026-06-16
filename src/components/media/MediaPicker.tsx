'use client'

type MediaAsset = {
  id: string
  file_url: string
  name: string
}

type Props = {
  assets: MediaAsset[]
  onSelect: (
    url: string
  ) => void
}

export default function MediaPicker({
  assets,
  onSelect,
}: Props) {

  return (
    <div className="media-picker">

      {assets.map(asset => (

        <button
          key={asset.id}
          type="button"
          onClick={() =>
            onSelect(
              asset.file_url
            )
          }
        >

          <img
            src={asset.file_url}
            alt={asset.name}
          />

        </button>

      ))}

    </div>
  )
}