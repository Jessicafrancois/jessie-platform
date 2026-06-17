import type { World, WorldSlide } from '@/types/worlds'

type Props = { slide: WorldSlide; world: World }


export default function HeroSlide({ slide, world }: Props) {


  return (
    <div className="wv-slide-root">
      {/* Video or image background */}
      <div className="wv-slide-bg">
        {world.hero_video ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={world.hero_poster ?? undefined}
          >
            <source src={world.hero_video} type="video/mp4" />
          </video>
        ) : (slide.background_image || world.cover_image) ? (
          <img
            src={slide.background_image || world.cover_image!}
            alt={slide.title ?? world.title}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#0a0908' }} />
        )}
      </div>

      <div className="wv-overlay" style={{ '--overlay-strength': slide.overlay_strength } as React.CSSProperties} />
      <div className="wv-vignette" />
      <div className="wv-grain" />

      <div className={`wv-content wv-content--${slide.text_alignment || 'left'}`}>
        <span className="wv-hero-kicker">{slide.subtitle || world.title}</span>
        <h1 className="wv-title">{slide.title || world.title}</h1>
        {slide.content && (
          <p className="wv-subtitle">{slide.content}</p>
        )}
      </div>
    </div>
  )
}