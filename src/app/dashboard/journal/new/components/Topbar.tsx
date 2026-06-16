'use client'

import ThemeSelector from '../components/ThemeSelector'
import ViewSelector from './ViewSelector'
import SettingsMenu from '../editor/SettingsMenu'

type TopbarProps = {
saveDraftAction: () => void
publishEntryAction: () => void

theme: string
setThemeAction: (
value: string
) => void

viewMode: string
setViewModeAction: (
value: string
) => void
}

export default function Topbar({
saveDraftAction,
publishEntryAction,

theme,
setThemeAction,

viewMode,
setViewModeAction,
}: TopbarProps) {

return (

<div className="editor-topbar">

  <div className="topbar-title">
    Journal Editor
  </div>

  <div className="topbar-actions">

    <button
      type="button"
      className="topbar-button"
      onClick={saveDraftAction}
    >
      Save Draft
    </button>

    <button
      type="button"
      className="publish-button"
      onClick={publishEntryAction}
    >
      Publish
    </button>

    <ViewSelector
      viewMode={viewMode}
      setViewModeAction={
        setViewModeAction
      }
    />

    <SettingsMenu
  theme={theme}
  setThemeAction={setThemeAction}
  viewMode={viewMode}
  setViewModeAction={setViewModeAction}
/>

  </div>

</div>


)
}
