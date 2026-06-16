'use client'

import { useState } from 'react'
import { PanelRightOpen } from 'lucide-react'

import ThemeSelector from '../components/ThemeSelector'
import ViewSelector from '../components/ViewSelector'

type SettingsMenuProps = {
entryId?: string

theme: string
setThemeAction: (
value: string
) => void

viewMode: string
setViewModeAction: (
value: string
) => void
}

export default function SettingsMenu({
entryId,
theme,
setThemeAction,
viewMode,
setViewModeAction,
}: SettingsMenuProps) {

const [open, setOpen] =
useState(false)

return ( 

<div className="settings-menu">

<button
  type="button"
  className="topbar-icon-button"
  onClick={() => setOpen(!open)}
  title="Settings"
>
  <div className="menu-lines">

    <span />

    <span />

    <span />

  </div>
</button>

  {open && (

    <div className="settings-dropdown">

      <div className="settings-section">

        <div className="settings-section-title">
          Appearance
        </div>

        <ThemeSelector
          theme={theme}
          setThemeAction={
            setThemeAction
          }
        />

      </div>

      <div className="settings-divider" />

      <div className="settings-section">

        <div className="settings-section-title">
          View
        </div>

        <ViewSelector
          viewMode={viewMode}
          setViewModeAction={
            setViewModeAction
          }
        />

      </div>

      <div className="settings-divider" />

      <div className="settings-section">

        <div className="settings-section-title">
          Publishing
        </div>

        <button>
          Publishing Settings
        </button>

        <button>
          Schedule Post
        </button>

        <button>
          SEO Settings
        </button>

      </div>

      <div className="settings-divider" />

      <div className="settings-section">

        <div className="settings-section-title">
          Organization
        </div>

        <button>
          Add To Project
        </button>

        <button>
          Add To World
        </button>

        <button>
          Favorite Entry
        </button>

      </div>

      <div className="settings-divider" />

      <div className="settings-section">

        <div className="settings-section-title">
          Export
        </div>

        <button>
          Export PDF
        </button>

        <button>
          Export DOCX
        </button>

        <button>
          Export Markdown
        </button>

      </div>

      <div className="settings-divider" />

<div className="settings-section">

  <div className="settings-section-title">
    Collaboration
  </div>

  <button>
    Copy Entry Link
  </button>

  <button>
    Invite Collaborator
  </button>

 <button
  onClick={() =>
    window.location.href =
      '/dashboard/journal/new/publishing'
  }
>
  Publishing Settings
</button>

</div>

    <div className="settings-divider" />

    <div className="settings-section">

      <div className="settings-section-title">
        History
      </div>

      <button>
        Version History
      </button>

      <button>
        Update History
      </button>

      <button>
        Copy Page Content
      </button>

    </div>

    </div>

  )}

</div>


)
}
