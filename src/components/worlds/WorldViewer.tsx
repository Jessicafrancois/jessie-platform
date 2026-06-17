'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import type {World,WorldSlide,} from '@/types/worlds'

import HeroSlide from './slides/HeroSlide'
import NarrativeSlide from './slides/NarrativeSlide'
import QuoteSlide from './slides/QuoteSlide'
import PhilosophySlide from './slides/PhilosophySlide'
import CTASlide from './slides/CTASlide'
import GallerySlide from './slides/GallerySlide'
import GenericSlide from './slides/GenericSlide'

type Props = {
  world: World
  slides: WorldSlide[]
}

type TransitionSpec = {
  initial: Record<string, unknown>
  animate: Record<string, unknown>
  exit: Record<string, unknown>
}

const TRANSITIONS = {
      fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  slide: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0,      opacity: 1 },
    exit:    { x: '-100%', opacity: 0 },
  },
  zoom: {
    initial: { scale: 1.08, opacity: 0 },
    animate: { scale: 1,    opacity: 1 },
    exit:    { scale: 0.94, opacity: 0 },
  },
  push: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0,      opacity: 1 },
    exit:    { y: '-100%', opacity: 0 },
  },
}

function getTransition(type?: string) {
  return TRANSITIONS[
    (type as keyof typeof TRANSITIONS) || 'fade'
  ] || TRANSITIONS.fade
}

function renderSlide(slide: WorldSlide, world: World) {
  switch (slide.slide_type) {
    case 'hero':        return <HeroSlide slide={slide} world={world} />
    case 'narrative':   return <NarrativeSlide slide={slide} />
    case 'quote':       return <QuoteSlide slide={slide} />
    case 'philosophy':  return <PhilosophySlide slide={slide} />
    case 'cta':         return <CTASlide slide={slide} world={world} />
    case 'gallery':     return <GallerySlide slide={slide} />
    default:            return <GenericSlide slide={slide} />
  }
}

export default function WorldViewer({ world, slides }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const touchStartX = useRef<number>(0)
  const totalSlides = slides.length

  const goTo = useCallback((index: number, dir: 1 | -1) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const next = useCallback(() => {
    if (current < totalSlides - 1) goTo(current + 1, 1)
  }, [current, totalSlides, goTo])

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1)
  }, [current, goTo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
  }

  function onClickZone(e: React.MouseEvent) {
    const { clientX, currentTarget } = e
    const midpoint = (currentTarget as HTMLElement).offsetWidth / 2
    clientX > midpoint ? next() : prev()
  }

  if (totalSlides === 0) {
    return (
      <div className="wv-empty">
        <h1>{world.title}</h1>
        <p>This world is being built.</p>
      </div>
    )
  }

  const slide = slides[current]
  const t = getTransition(slide.transition)



  return (
    <div
      className="wv-root"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClickZone}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          className="wv-slide"
          custom={direction}
          initial={t.initial}
          animate={t.animate}
          exit={t.exit}
          transition={{ duration: (slide.duration ?? 800) / 1000, ease: 'easeInOut'}}
        >
          {renderSlide(slide, world)}
        </motion.div>
      </AnimatePresence>

      {/* SLIDE COUNTER */}
      <div className="wv-counter" aria-label="Slide progress">
        <span className="wv-counter-current">
          {String(current + 1).padStart(2, '0')}
        </span>
        <span className="wv-counter-divider">/</span>
        <span className="wv-counter-total">
          {String(totalSlides).padStart(2, '0')}
        </span>
      </div>

      {/* DOT NAVIGATION */}
      <nav className="wv-dots" aria-label="Slide navigation">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`wv-dot ${i === current ? 'wv-dot--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? 1 : -1) }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </nav>

      {/* PREV / NEXT ARROWS */}
      {current > 0 && (
        <button
          className="wv-arrow wv-arrow--prev"
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Previous slide"
        >
          ←
        </button>
      )}
      {current < totalSlides - 1 && (
        <button
          className="wv-arrow wv-arrow--next"
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Next slide"
        >
          →
        </button>
      )}

      {/* WORLD TITLE BADGE */}
      <div className="wv-title-badge">{world.title}</div>
    </div>
  )
}