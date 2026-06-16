'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MediaCard({
  asset,
}: {
  asset: any
}) {

    async function archiveAsset() {

  const { error } =
    await supabase
      .from('media_assets')
      .update({
        archived: true,
      })
      .eq('id', asset.id)

  if (error) {
    console.error(error)
    return
  }

  window.location.reload()
}

async function deleteAsset() {

  const confirmed =
    window.confirm(
      'Delete this media asset?'
    )

  if (!confirmed) return

  const { error } =
    await supabase
      .from('media_assets')
      .delete()
      .eq('id', asset.id)

  if (error) {
    console.error(error)
    return
  }

  window.location.reload()
}
  const [open, setOpen] =
    useState(false)

    const [selectedAsset, setSelectedAsset] =
  useState<any | null>(null)

  


return (

  <div className="media-card">

    <div className="media-card-header">

      <div className="media-card-meta">

        <h4>
          {asset.name}
        </h4>

        <p>
          {asset.type}
        </p>

      </div>

      <button
        className="media-menu-button"
        onClick={() =>
          setOpen(!open)
        }
      >
        ⋮
      </button>

      

    </div>

    {open && (

      <div className="media-dropdown">

        <button>
          Add To Project
        </button>

        <button>
          Add To World
        </button>

        <button>
          Add To Entry
        </button>

       <button
            onClick={archiveAsset}
            >
            Archive
         </button>

       <button
            onClick={deleteAsset}
            >
            Delete
        </button>

      </div>

    )}

    <div className="media-preview">

      <img
        src={asset.file_url}
        alt=""
      />

    </div>

  </div>

)
}