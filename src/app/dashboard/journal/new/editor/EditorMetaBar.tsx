'use client'

import TagInput from './TagInput'

type EditorMetaBarProps = {
slug: string
setSlugAction: (value: string) => void

collection: string
setCollectionAction: (value: string) => void

series: string
setSeriesAction: (value: string) => void

entryType: string
setEntryTypeAction: (value: string) => void

status: string
setStatusAction: (value: string) => void

featured: boolean
setFeaturedAction: (value: boolean) => void

tags: string[]
setTagsAction: (tags: string[]) => void

collections: {
id: string
name: string
}[]

seriesList: {
id: string
name: string
}[]
}


export default function EditorMetaBar({
collection,
setCollectionAction,

series,
setSeriesAction,

collections,
seriesList,

entryType,
setEntryTypeAction,

status,
setStatusAction,

slug,
setSlugAction,

featured,
setFeaturedAction,

tags,
setTagsAction,
}: EditorMetaBarProps) {


return (

<div className="editor-meta-bar">

  <div className="meta-chip">
    <span>Collection</span>

    <select
  value={collection}
  onChange={(e) =>
    setCollectionAction(e.target.value)
  }
>
  <option value="">
    Select Collection
  </option>

  {collections.map((collection) => (
    <option
      key={collection.id}
      value={collection.id}
    >
      {collection.name}
    </option>
  ))}
</select>
  </div>

  <div className="meta-chip">

  <span>Series</span>

  <select
    value={series}
    onChange={(e) =>
      setSeriesAction(
        e.target.value
      )
    }
  >
    <option value="">
      Select Series
    </option>

    {seriesList.map((series) => (
      <option
        key={series.id}
        value={series.id}
      >
        {series.name}
      </option>
    ))}
  </select>

</div>

  <div className="meta-chip">
    <span>Type</span>

    <select
      value={entryType}
      onChange={(e) =>
        setEntryTypeAction(
          e.target.value
        )
      }
    >
      <option value="Essay">
        Essay
      </option>

      <option value="Research Note">
        Research Note
      </option>

      <option value="Reflection">
        Reflection
      </option>

      <option value="Observation">
        Observation
      </option>
    </select>
  </div>

  <div className="meta-chip">
    <span>Status</span>

    <select
      value={status}
      onChange={(e) =>
        setStatusAction(
          e.target.value
        )
      }
    >
      <option value="Draft">
        Draft
      </option>

      <option value="Published">
        Published
      </option>

      <option value="Archived">
        Archived
      </option>
    </select>
  </div>

 <div className="meta-chip">
  <span>Slug</span>

  <div className="slug-input">

    <input
      type="text"
      value={slug}
      onChange={(e) =>
        setSlugAction(e.target.value)
      }
    />
  </div>
</div>

  <div className="meta-chip meta-tags">
    <span>Tags</span>

    <TagInput
      tags={tags}
      setTagsAction={setTagsAction}
    />
  </div>

    <div className="meta-chip meta-featured">

    <span>Featured</span>

    <label className="notion-checkbox">

      <input
        type="checkbox"
        checked={featured}
        onChange={(e) =>
          setFeaturedAction(
            e.target.checked
          )
        }
      />

      <span className="checkmark">
        ✓
      </span>

    </label>

      <div className="meta-chip">
    <span>Slug</span>

    </div>

  </div>

</div>

)
}
