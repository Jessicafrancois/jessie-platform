'use client'

import EditorSidebar from '@/app/dashboard/journal/new/editor/EditorSidebar'
import Topbar from './components/Topbar'
import TiptapEditor from './editor/TiptapEditor'

import './editor.css'

export default function NewJournalPage() {
function handlePublish() {
console.log('publish')
}

return ( <div className="editor-layout"> <EditorSidebar />


  <main className="editor-main">
    <Topbar
      onPublish={handlePublish}
    />

    <TiptapEditor />
  </main>
</div>


)
}
