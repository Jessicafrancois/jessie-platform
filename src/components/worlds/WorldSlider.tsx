'use client'

import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type World = {
  id: string
  title: string
  description: string
  type: string
  cover_image: string | null
  status: string
  slug: string | null
}

export default function WorldSlider() {
  const [worlds, setWorlds] = useState<World[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
  })

  const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadWorlds() {
    const { data, error } = await supabase
      .from('worlds')
      .select('id, title, description, type, cover_image, status, slug')
      .eq('status', 'Published')

    if (error) console.error('World slider load error:', error)

    setWorlds(data || [])
    setLoading(false)
  }

  loadWorlds()
}, [])


  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || isPaused || worlds.length <= 1) return

    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [emblaApi, isPaused, worlds.length])

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  if (worlds.length === 0) {
    return (
      <section className="worlds-section">
        <div className="worlds-loading">Loading worlds...</div>
      </section>
    )
  }

  if (loading) {
  return <div>Loading worlds...</div>
}

if (!worlds.length) {
  return <div>No published worlds found.</div>
}

  return (
    <section
      className="worlds-section"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Our Worlds carousel"
    >

      <div className="worlds-slider-header">
        <div className="worlds-slider-meta">
          <span className="worlds-counter">
            {String(selectedIndex + 1).padStart(2, '0')} /
            {String(worlds.length).padStart(2, '0')}
          </span>
          <h2 className="worlds-slider-title">
            {worlds[selectedIndex]?.title}
          </h2>
          <p className="worlds-slider-description">
            {worlds[selectedIndex]?.description}
          </p>
          <span className="worlds-slider-type">
            {worlds[selectedIndex]?.type}
          </span>
        </div>

        <div className="worlds-slider-controls">
          <button className="worlds-arrow" onClick={prev}>←</button>
          <button className="worlds-arrow" onClick={next}>→</button>
        </div>
      </div>

      <div className="worlds-slider" ref={emblaRef}>
        <div className="worlds-slider-container">
          {worlds.map((world, index) => (
            <div
              key={world.id}
              className={`world-slide ${selectedIndex === index ? 'is-active' : ''}`}
            >
              <Link
               href={`/worlds/${world.slug}`}
                className="world-card"
              >
                {world.cover_image ? (
                  <img
                    src={world.cover_image}
                    alt={world.title}
                    className="world-card-image"
                  />
                ) : (
                  <div className="world-card-placeholder">
                    <span>{world.title[0]}</span>
                  </div>
                )}

                <div className="world-card-overlay">
                  <span className="world-card-type">{world.type}</span>
                  <h3 className="world-card-title">{world.title}</h3>
                  <span className="world-card-cta">Enter World →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="worlds-filmstrip">
        {worlds.map((world, index) => (
          <button
            key={world.id}
            className={`worlds-filmstrip-thumb ${selectedIndex === index ? 'is-active' : ''}`}
            onClick={() => emblaApi?.scrollTo(index)}
          >
            {world.cover_image ? (
              <img src={world.cover_image} alt={world.title} />
            ) : (
              <div className="worlds-filmstrip-placeholder" />
            )}
          </button>
        ))}
      </div>

    </section>
  )
}
