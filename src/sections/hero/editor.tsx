'use client'

import { SectionComponentProps } from '../types'
import { HeroSectionContent } from './types'

type Props = SectionComponentProps<HeroSectionContent> & {
  onChange: (content: HeroSectionContent) => void
}

export default function HeroEditor({
  content,
  onChange,
}: Props) {
  function update<K extends keyof HeroSectionContent>(
    key: K,
    value: HeroSectionContent[K]
  ) {
    onChange({
      ...content,
      [key]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-white/60">
          Title
        </label>

        <input
          value={content.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/60">
          Subtitle
        </label>

        <textarea
          value={content.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
          className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/60">
          Image URL
        </label>

        <input
          value={content.image_url}
          onChange={(e) => update('image_url', e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
        />
      </div>
    </div>
  )
}