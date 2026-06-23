'use client'

import Link from 'next/link'
import SettingsMenu from '../editor/SettingsMenu'


type TopbarProps = {
saveDraftAction: () => void
publishEntryAction: () => void
entryId?: string
editor?: unknown

theme: string
setThemeAction: (
value: string
) => void

viewMode: string
setViewModeAction: (
value: string
) => void

saveLabel?: string
publishing?: boolean
searchQuery?: string
searchMatchCount?: number
activeSearchIndex?: number
onSearchChangeAction?: (value: string) => void
onSearchNextAction?: () => void
onSearchPreviousAction?: () => void
}

export default function Topbar({
saveDraftAction,
publishEntryAction,
entryId,
editor,

theme,
setThemeAction,

viewMode,
setViewModeAction,
saveLabel = 'Save Draft',
publishing = false,
searchQuery = '',
searchMatchCount = 0,
activeSearchIndex = 0,
onSearchChangeAction,
onSearchNextAction,
onSearchPreviousAction,
}: TopbarProps) {

return (

<div className="editor-topbar">

  <div className="topbar-title">
    <Link href="/dashboard/journal" className="topbar-back-link">
      Journal
    </Link>
    <span>Editor</span>
  </div>

  <div className="topbar-actions">

  <div className="topbar-search" role="search">
    <input
      className="topbar-search-input"
      value={searchQuery}
      onChange={(event) => onSearchChangeAction?.(event.target.value)}
      placeholder="Search entry..."
      aria-label="Search entry"
    />
    {searchQuery && (
      <span className="topbar-search-count">
        {searchMatchCount > 0 ? `${activeSearchIndex + 1}/${searchMatchCount}` : '0/0'}
      </span>
    )}
    <button
      type="button"
      className="topbar-search-btn"
      onClick={onSearchPreviousAction}
      disabled={!searchQuery || searchMatchCount === 0}
      aria-label="Previous search result"
    >
      ^
    </button>
    <button
      type="button"
      className="topbar-search-btn"
      onClick={onSearchNextAction}
      disabled={!searchQuery || searchMatchCount === 0}
      aria-label="Next search result"
    >
      v
    </button>
  </div>

  <button
    type="button"
    className="topbar-button"
    onClick={saveDraftAction}
  >
    {saveLabel}
  </button>

  <button
    type="button"
    className="publish-button"
    onClick={publishEntryAction}
    disabled={publishing}
  >
    {publishing ? 'Publishing...' : 'Publish'}
  </button>


  <SettingsMenu
    entryId={entryId}
    editor={editor}
    theme={theme}
    setThemeAction={setThemeAction}
    viewMode={viewMode}
    setViewModeAction={setViewModeAction}
    onSaveDraftAction={saveDraftAction}
    onPublishAction={publishEntryAction}
  />

</div>
</div>
)
}
