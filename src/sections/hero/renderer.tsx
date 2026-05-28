import { SectionComponentProps } from '../types'
import { HeroSectionContent } from './types'

export default function HeroRenderer({
  content,
}: SectionComponentProps<HeroSectionContent>) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
      {content.image_url && (
        <img
          src={content.image_url}
          alt={content.title}
          className="h-[420px] w-full object-cover opacity-70"
        />
      )}

      <div className="relative z-10 p-12">
        <h1 className="mb-4 text-5xl font-bold text-white">
          {content.title}
        </h1>

        {content.subtitle && (
          <p className="max-w-2xl text-lg text-white/70">
            {content.subtitle}
          </p>
        )}

        {content.cta_text && content.cta_url && (
          <a
            href={content.cta_url}
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-black transition hover:bg-white/80"
          >
            {content.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}