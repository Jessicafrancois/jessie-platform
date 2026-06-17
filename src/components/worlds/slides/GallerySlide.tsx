import type { WorldSlide } from '../../../types/worlds'

type Props = { slide: WorldSlide }

export default function GallerySlide({ slide }: Props) {
  const images: string[] =
    (slide.settings as { images?: string[] })?.images ?? []

  return (
    <div className="wv-slide-root" style={{ background: '#050505' }}>
      <div className="wv-grain" />

      {images.length > 0 ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`,
          gap: '2px',
        }}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Gallery image ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ))}
        </div>
      ) : (
        <div className="wv-content wv-content--center">
          <span className="wv-eyebrow">Gallery</span>
          <h2 className="wv-title">{slide.title}</h2>
        </div>
      )}

      {slide.title && (
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '5vw',
          zIndex: 10,
        }}>
          <span className="wv-eyebrow">{slide.subtitle || 'Gallery'}</span>
          <h2 className="wv-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            {slide.title}
          </h2>
        </div>
      )}
    </div>
  )
}