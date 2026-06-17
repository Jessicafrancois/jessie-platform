'use client'


import type {World,WorldSlide,} from '@/types/worlds'


type Props = {
  slide: WorldSlide | null
  world: World
}

export default function SlideCanvas({ slide, world }: Props) {
  if (!slide) {
    return (
      <div className="sc-empty">
        <p>Select or add a slide to begin.</p>
      </div>
    )
  }

  return (
    <div className="sc-root">
      <div className="sc-ratio">
        <div
          className="sc-stage"
          style={{
            backgroundImage: slide.background_image
              ? `url(${slide.background_image})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div
            className="sc-overlay"
            style={{ opacity: slide.overlay_strength }}
          />

          {/* Content preview */}
          <div className={`sc-content sc-content--${slide.text_alignment}`}>
            {slide.slide_type === 'quote' ? (
              <blockquote className="sc-quote">
                {slide.content || 'Enter a quote…'}
              </blockquote>
            ) : (
              <>
                <span className="sc-eyebrow">{slide.slide_type.toUpperCase()}</span>
                <h2 className="sc-title">{slide.title || 'Slide Title'}</h2>
                {slide.subtitle && (
                  <p className="sc-subtitle">{slide.subtitle}</p>
                )}
                {slide.content && (
                  <p className="sc-body">{slide.content}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slide type badge */}
      <div className="sc-meta">
        <span className="sc-meta-type">{slide.slide_type}</span>
        <span className="sc-meta-transition">↓ {slide.transition}</span>
      </div>
    </div>
  )
}