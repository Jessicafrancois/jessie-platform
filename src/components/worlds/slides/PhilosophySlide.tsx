import type { WorldSlide } from '../../../types/worlds'
type Props = { slide: WorldSlide }

export default function PhilosophySlide({ slide }: Props) {
  const lines = slide.content?.split('\n').filter(Boolean) ?? []

  return (
    <div className="wv-slide-root" style={{ background: '#0a0908' }}>
      <div className="wv-grain" />
      <div className="wv-content wv-content--center">
        {slide.subtitle && (
          <span className="wv-eyebrow">{slide.subtitle}</span>
        )}
        <h2 className="wv-title" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', marginBottom: '3rem' }}>
          {slide.title}
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxWidth: '640px',
          width: '100%',
        }}>
          {lines.map((line, i) => (
            <p key={i} style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              lineHeight: 1.7,
              color: 'rgba(245,241,235,0.65)',
              borderLeft: '2px solid rgba(201,169,110,0.3)',
              paddingLeft: '1.25rem',
              margin: 0,
            }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
