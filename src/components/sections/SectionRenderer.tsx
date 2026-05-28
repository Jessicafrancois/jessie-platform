import { SECTION_REGISTRY } from '@/sections/registry'

type Props = {
  section: {
    id: string
    type: string
    content: any
  }
}

export default function SectionRenderer({
  section,
}: Props) {
  const sectionDef = SECTION_REGISTRY[section.type]

  if (!sectionDef) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        Unknown section type: {section.type}
      </div>
    )
  }

  const parsed = sectionDef.schema.safeParse(section.content)

  if (!parsed.success) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-yellow-200">
        Invalid content for section: {section.type}
      </div>
    )
  }

  const Renderer = sectionDef.renderer

  return (
    <Renderer
      content={parsed.data}
      sectionId={section.id}
    />
  )
}