import EditorSidebar from './editor/EditorSidebar'
import TiptapEditor from './editor/tiptap/TiptapEditor'

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

  return (
    <div className="editor-layout">

      {/* Editor-specific sidebar only — no dashboard nav */}
      <EditorSidebar />

      <main className="editor-main">

        <TiptapEditor viewMode="create" />

      </main>

    </div>
  )
}
