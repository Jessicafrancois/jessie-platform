import type { CSSProperties } from 'react'
import type { WorldSlide } from '../../../types/worlds'

type Props = {
  slide: WorldSlide
}

export default function QuoteSlide({
  slide,
}: Props) {
  return (
    <div
      className="wv-slide-root"
      style={{ background: '#050505' }}
    >
      {slide.background_image && (
        <>
          <div className="wv-slide-bg">
            <img
              src={slide.background_image}
              alt=""
            />
          </div>

          <div
            className="wv-overlay"
            style={{
              '--overlay-strength': 0.8,
            } as CSSProperties}
          />

          <div className="wv-grain" />
        </>
      )}

      <div className="wv-content wv-content--center">

        <blockquote className="wv-quote">
          {slide.content || slide.title}
        </blockquote>

        {slide.subtitle && (
          <p className="wv-quote-attr">
            — {slide.subtitle}
          </p>
        )}

      </div>
    </div>
  )
}