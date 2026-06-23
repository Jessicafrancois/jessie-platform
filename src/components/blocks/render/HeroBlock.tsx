import { HeroContent } from '@/lib/blocks/types'

export default function HeroBlock({ content }: { content: HeroContent }) {
  return (
    <section
      className="block-hero"
      style={content.backgroundImage ? { backgroundImage: `url(${content.backgroundImage})` } : undefined}
    >
      <div className="block-hero-overlay" />
      <div className="block-hero-content">
        <h1>{content.headline}</h1>
        {content.subheadline && <p>{content.subheadline}</p>}
      </div>
    </section>
  )
}