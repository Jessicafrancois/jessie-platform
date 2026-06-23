// components/favorites/FavoritesWidget.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useFavorites } from '@/hooks/useFavorites'
import FavoriteButton from './FavoriteButton'

interface EntryPreview {
  id: string
  title: string
  status: string
  updated_at: string
  cover_image?: string
}

export default function FavoritesWidget() {
  const { favorites, isFavorited, toggleFavorite } = useFavorites()
  const [entries, setEntries] = useState<EntryPreview[]>([])

  useEffect(() => {
    if (favorites.length === 0) return
    const ids = favorites.slice(0, 6).map(f => f.entry_id)
    supabase
      .from('entries')
      .select('id, title, status, updated_at, cover_image')
      .in('id', ids)
      .then(({ data }) => setEntries(data || []))
  }, [favorites])

  if (favorites.length === 0) return null

  return (
    <div className="favorites-widget">
      <div className="favorites-widget__header">
        <span className="favorites-widget__icon">★</span>
        <h3 className="favorites-widget__title">Favorite Entries</h3>
        <span className="favorites-widget__count">{favorites.length}</span>
      </div>

      <ul className="favorites-widget__list">
        {entries.map(entry => (
          <li key={entry.id} className="favorites-widget__item">
            {entry.cover_image && (
              <img
                src={entry.cover_image}
                alt={entry.title}
                className="favorites-widget__thumb"
              />
            )}
            <div className="favorites-widget__info">
              <a href={`/dashboard/journal/${entry.id}`} className="favorites-widget__name">
                {entry.title || 'Untitled Entry'}
              </a>
              <span className="favorites-widget__meta">
                {entry.status} · {new Date(entry.updated_at).toLocaleDateString()}
              </span>
            </div>
            <FavoriteButton
              entryId={entry.id}
              isFavorited={isFavorited(entry.id)}
              onToggle={toggleFavorite}
              size="sm"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}