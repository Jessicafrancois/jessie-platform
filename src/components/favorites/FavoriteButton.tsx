// components/favorites/FavoriteButton.tsx
'use client'

interface Props {
  entryId: string
  isFavorited: boolean
  onToggle: (entryId: string) => void
  size?: 'sm' | 'md'
}

export default function FavoriteButton({ entryId, isFavorited, onToggle, size = 'md' }: Props) {
  return (
    <button
      className={`favorite-btn favorite-btn--${size} ${isFavorited ? 'favorite-btn--active' : ''}`}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        onToggle(entryId)
      }}
      title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      aria-label={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <span className="favorite-btn__star" aria-hidden="true">
        {isFavorited ? '★' : '☆'}
      </span>
      {size === 'md' && (
        <span className="favorite-btn__label">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  )
}