'use client'

import { useState } from 'react'

import EditorSidebar from './editor/EditorSidebar'
import Topbar from './components/Topbar'
import TiptapEditor from './editor/TiptapEditor'

import './editor/editor.css'

/**
 * NewJournalPage
 *
 * Layout: EditorSidebar (left) + editor main (right).
 * The dashboard sidebar has been removed — this page lives
 * in its own full-screen editor context.
 *
 * Route: /dashboard/journal/new
 */

export default function NewJournalPage() {

  const [theme, setTheme] = useState('system')
  const [viewMode, setViewMode] = useState('create')

  function handleSaveDraft() {
    console.log('save draft')
  }

  function handlePublish() {
    console.log('publish')
  }

  return (
    <div className="editor-layout">

      {/* Editor-specific sidebar only — no dashboard nav */}
      <EditorSidebar />

      <main className="editor-main">

        <Topbar
          saveDraftAction={handleSaveDraft}
          publishEntryAction={handlePublish}
          theme={theme}
          setThemeAction={setTheme}
          viewMode={viewMode}
          setViewModeAction={setViewMode}
        />

        <TiptapEditor
          viewMode={viewMode}
        />

      </main>

    </div>
  )
}