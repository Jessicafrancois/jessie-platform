import type { WorldSlide } from '../../../types/worlds'

type Props = { slide: WorldSlide }

export default function GenericSlide({ slide }: Props) {
  return (
    <div className="wv-slide-root">
      {slide.background_image && (
        <>
          <div className="wv-slide-bg">
            <img src={slide.background_image} alt={slide.title ?? ''} />
          </div>
          <div className="wv-overlay" style={{ '--overlay-strength': slide.overlay_strength } as React.CSSProperties} />
          <div className="wv-vignette" />
          <div className="wv-grain" />
        </>
      )}

      {!slide.background_image && (
        <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />
      )}

      <div className={`wv-content wv-content--${slide.text_alignment || 'left'}`}>
        {slide.subtitle && <span className="wv-eyebrow">{slide.subtitle}</span>}
        <h2 className="wv-title">{slide.title}</h2>
        {slide.content && <p className="wv-body">{slide.content}</p>}
      </div>
    </div>
  )
}