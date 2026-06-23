// JournalCarousel.tsx  (full replacement)
'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { JournalEntry } from '@/app/dashboard/journal/page'
import JournalNavigation from './JournalNavigation'
import JournalPreview from './JournalPreview'
import JournalDock from './JournalDock'
import CollaboratorAvatars from '../collaboration/CollaboratorAvatars'
import FavoriteButton from '../favorites/FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'

interface Props {
  entries: JournalEntry[]
}

const FADE_DURATION = 0.7
const TRANSITION: any = { duration: FADE_DURATION, ease: [0.16, 1, 0.3, 1] }

const mediaVariants = {
  enter:  { opacity: 0, scale: 1.03 },
  center: { opacity: 1, scale: 1    },
  exit:   { opacity: 0, scale: 0.98 },
}

const textVariants = {
  enter:  { opacity: 0, y:  18 },
  center: { opacity: 1, y:   0 },
  exit:   { opacity: 0, y: -12 },
}

export default function JournalCarousel({ entries }: Props) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const { isFavorited, toggleFavorite } = useFavorites()

  // Sort: favorited entries appear first
  const sortedEntries = [...entries].sort((a, b) => {
    const af = isFavorited(a.id) ? 0 : 1
    const bf = isFavorited(b.id) ? 0 : 1
    return af - bf
  })

  const navigate = useCallback((dir: 'next' | 'prev') => {
    setDirection(dir)
    setIndex(i => {
      if (dir === 'next') return Math.min(i + 1, sortedEntries.length - 1)
      return Math.max(i - 1, 0)
    })
  }, [sortedEntries.length])

  const current  = sortedEntries[index]
  const previous = index > 0 ? sortedEntries[index - 1] : null

  if (!current) {
    return (
      <div className="journal-layout" style={{ gridTemplateColumns: '1fr' }}>
        <div className="journal-col-right" style={{ paddingLeft: '3rem', alignItems: 'flex-start' }}>
          <p className="journal-entry-type">No published entries yet.</p>
        </div>
      </div>
    )
  }

  const formattedDate = current.published_at
    ? new Date(current.published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <>
      {/* Top Bar */}
      <header className="journal-topbar">
        <span className="journal-topbar__wordmark">Journal</span>
        <button className="journal-topbar__menu" aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* Three-Column Layout */}
      <div className="journal-layout">

        {/* Left: Previous entry preview */}
        <div className="journal-col-left">
          <AnimatePresence mode="wait">
            {previous && (
              <motion.div
                key={`prev-${previous.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="journal-card-wrapper">
                  {/* Favorite star on preview card */}
                  <FavoriteButton
                    entryId={previous.id}
                    isFavorited={isFavorited(previous.id)}
                    onToggle={toggleFavorite}
                    size="sm"
                  />
                  <JournalPreview entry={previous} onClick={() => navigate('prev')} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Featured cover */}
        <div className="journal-col-center">
          <div className="journal-cover-frame">
            <AnimatePresence mode="wait">
              <motion.div
                key={`media-${current.id}`}
                className="journal-cover-media"
                variants={mediaVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={TRANSITION}
              >
                {current.cover_video ? (
                  <video
                    className="journal-cover-video"
                    src={current.cover_video}
                    autoPlay muted loop playsInline
                  />
                ) : current.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="journal-cover-img" src={current.cover_image} alt={current.title} />
                ) : (
                  <div className="journal-cover-placeholder"><span>No Cover</span></div>
                )}
              </motion.div>
            </AnimatePresence>

            <span className="journal-cover-counter">
              {String(index + 1).padStart(2, '0')} / {String(sortedEntries.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right: Entry metadata */}
        <div className="journal-col-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current.id}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...TRANSITION, duration: 0.6 }}
            >
              {/* Favorite + Collaborators row */}
              <div className="journal-entry-top-row">
                <FavoriteButton
                  entryId={current.id}
                  isFavorited={isFavorited(current.id)}
                  onToggle={toggleFavorite}
                />
                <CollaboratorAvatars entryId={current.id} max={4} />
              </div>

              {current.entry_type && (
                <p className="journal-entry-type">{current.entry_type}</p>
              )}

              <h1 className="journal-entry-title">{current.title}</h1>

              {current.intro && (
                <p className="journal-entry-intro">{current.intro}</p>
              )}

              <div className="journal-entry-meta">
                {formattedDate && <span>{formattedDate}</span>}
                {formattedDate && current.reading_time && (
                  <div className="journal-entry-meta__divider" />
                )}
                {current.reading_time && <span>{current.reading_time} min read</span>}
              </div>

              <JournalNavigation
                onPrev={() => navigate('prev')}
                onNext={() => navigate('next')}
                hasPrev={index > 0}
                hasNext={index < sortedEntries.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Dock */}
      <JournalDock />
    </>
  )
}