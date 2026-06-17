import type { CSSProperties } from 'react'
import type { WorldSlide } from '../../../types/worlds'


type Props = {
  slide: WorldSlide
}   

export default function NarrativeSlide({ slide }: Props) {
  return (
    <div className="wv-slide-root">
      {slide.background_image && (
        <>
          <div className="wv-slide-bg">
            <img src={slide.background_image} alt={slide.title ?? ''} />
          </div>
          <div
            className="wv-overlay"
            style={{
              '--overlay-strength': slide.overlay_strength,
            } as CSSProperties}
          />
          <div className="wv-grain" />
        </>
      )}

      {!slide.background_image && (
        <div style={{ position: 'absolute', inset: 0, background: '#050505' }} />
      )}

      <div className={`wv-content wv-content--${slide.text_alignment || 'left'}`}>
        {slide.subtitle && <span className="wv-eyebrow">{slide.subtitle}</span>}
        <h2 className="wv-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>
          {slide.title}
        </h2>
        {slide.content && (
          <p className="wv-body">{slide.content}</p>
        )}
      </div>
    </div>
  )
}