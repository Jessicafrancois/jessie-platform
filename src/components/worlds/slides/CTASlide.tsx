import type { World, WorldSlide } from '../../../types/worlds'
import Link from 'next/link'

type Props = { slide: WorldSlide; world: World }

export default function CTASlide({ slide, world }: Props) {
  const ctaHref = (slide.settings as { cta_href?: string })?.cta_href ?? `mailto:hello@example.com`
  const ctaLabel = (slide.settings as { cta_label?: string })?.cta_label ?? 'Get Involved'

  return (
    <div className="wv-slide-root">
      {slide.background_image && (
        <>
          <div className="wv-slide-bg">
            <img src={slide.background_image} alt="" />
          </div>
          <div className="wv-overlay" style={{ '--overlay-strength': slide.overlay_strength } as React.CSSProperties} />
          <div className="wv-vignette" />
          <div className="wv-grain" />
        </>
      )}

      {!slide.background_image && (
        <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />
      )}

      <div className="wv-content wv-content--center">
        {slide.subtitle && (
          <span className="wv-eyebrow">{slide.subtitle}</span>
        )}
        <h2 className="wv-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
          {slide.title}
        </h2>
        {slide.content && (
          <p className="wv-subtitle">{slide.content}</p>
        )}
        <Link href={ctaHref} className="wv-cta-btn">
          {ctaLabel} →
        </Link>
      </div>
    </div>
  )
}