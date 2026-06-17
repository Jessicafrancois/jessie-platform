'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import './stacked-carousel.css'

export type CarouselCard = {
  id: string
  number: string
  year: string
  category: string
  title: string
  description: string
  cta: string
  ctaHref: string
  image?: string
}

type Props = {
  cards: CarouselCard[]
  heading?: string
  subheading?: string
}

const STACK_OFFSET = 28    // px each rear card is offset upward
const STACK_SCALE  = 0.045 // scale reduction per depth level

export default function StackedCarousel({
  cards,
  heading = 'Designs That Blend\nCreativity & Functionality',
  subheading = 'PROJECTS',
}: Props) {
  const [order, setOrder] = useState<number[]>(cards.map((_, i) => i))

  function advance() {
    setOrder(prev => {
      const next = [...prev]
      next.push(next.shift()!)
      return next
    })
  }

  const visible = order.slice(0, Math.min(4, cards.length))

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <span className="carousel-label">{subheading}</span>
        <h2 className="carousel-heading">
          {heading.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h2>
      </div>

      <div className="carousel-stage">
        <AnimatePresence>
          {[...visible].reverse().map((cardIndex, stackPos) => {
            const depth = visible.length - 1 - stackPos
            const card  = cards[cardIndex]
            const isFront = depth === 0

            return (
              <motion.div
                key={card.id}
                className={`carousel-card ${isFront ? 'carousel-card--front' : ''}`}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{
                  opacity: isFront ? 1 : 0.6 + depth * 0.05,
                  y:       -(depth * STACK_OFFSET),
                  scale:   1 - (depth === 0 ? 0 : (visible.length - 1 - depth + 1) * STACK_SCALE),
                  zIndex:  depth,
                }}
                exit={{ opacity: 0, scale: 0.85, y: 60 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 30,
                  mass: 0.8,
                }}
              >
                {isFront ? (
                  <div className="carousel-card-inner">
                    <div className="carousel-card-left">
                      <span className="carousel-card-number">{card.number}</span>
                      <div className="carousel-card-meta">
                        {card.year} • {card.category}
                      </div>
                      <h3 className="carousel-card-title">{card.title}</h3>
                      <p className="carousel-card-desc">{card.description}</p>
                      <Link href={card.ctaHref} className="carousel-card-cta">
                        {card.cta} →
                      </Link>
                    </div>

                    <div className="carousel-card-right">
                      {card.image
                        ? <img src={card.image} alt={card.title} className="carousel-card-img" />
                        : <div className="carousel-card-img-placeholder" />
                      }
                    </div>
                  </div>
                ) : (
                  <div className="carousel-card-peek" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <button className="carousel-btn" onClick={advance} aria-label="Next project">
          Next →
        </button>
        <span className="carousel-count">
          {String(order.indexOf(order[0]) + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  )
}