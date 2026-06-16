'use client'

type ViewSelectorProps = {
  viewMode: string
  setViewModeAction: (
    value: string
  ) => void
}

export default function ViewSelector({
  viewMode,
  setViewModeAction,
}: ViewSelectorProps) {

  return (

    <select
  className="view-select"
  value={viewMode}
  onChange={(e) =>
    setViewModeAction(
      e.target.value
    )
  }
>
  <option value="create">
    Create
  </option>

  <option value="review">
    Review
  </option>

  <option value="edit">
    Edit
  </option>

  <option value="presentation">
    Presentation
  </option>

  <option value="focus">
    Focus Mode
  </option>
</select>

  )
}