interface TextSectionEditorProps {
  section: any
  onChange: (content: any) => void
}

export default function TextSectionEditor({
  section,
  onChange,
}: TextSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-2 text-neutral-400">
          Heading
        </label>

        <input
          type="text"
          value={section.content.heading || ''}
          onChange={(e) =>
            onChange({
              ...section.content,
              heading: e.target.value,
            })
          }
          className="w-full rounded-xl bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-[#e8c86d]"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-neutral-400">
          Body
        </label>

        <textarea
          value={section.content.body || ''}
          onChange={(e) =>
            onChange({
              ...section.content,
              body: e.target.value,
            })
          }
          rows={8}
          className="w-full rounded-xl bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-[#e8c86d]"
        />
      </div>
    </div>
  )
}