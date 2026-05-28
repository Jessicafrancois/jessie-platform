'use client'

import { SECTION_REGISTRY } from '@/sections/registry'

type Props = {
  section: {
    id: string
    type: string
    content: any
  }

  onChange: (content: any) => void
}

export default function SectionEditor({
  section,
  onChange,
}: Props) {
  const sectionDef = SECTION_REGISTRY[section.type]

  if (!sectionDef) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        Unknown editor type: {section.type}
      </div>
    )
  }

  const Editor = sectionDef.editor

  return (
    <Editor
      content={section.content}
      sectionId={section.id}
      isEditing
      onChange={onChange}
    />
  )
}