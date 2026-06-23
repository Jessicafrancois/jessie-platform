// hooks/useFavorites.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { FavoriteEntry } from '@/types'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = useCallback(async () => {
    const { data } = await supabase
      .from('favorite_entries')
      .select('*')
      .order('created_at', { ascending: false })
    setFavorites(data || [])
  }, [])

  const isFavorited = useCallback(
    (entryId: string) => favorites.some(f => f.entry_id === entryId),
    [favorites]
  )

  const toggleFavorite = useCallback(async (entryId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (isFavorited(entryId)) {
      await supabase
        .from('favorite_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('entry_id', entryId)
    } else {
      await supabase
        .from('favorite_entries')
        .insert({ user_id: user.id, entry_id: entryId })
    }

    await loadFavorites()
  }, [isFavorited, loadFavorites])

  // Realtime sync
  useEffect(() => {
    loadFavorites().finally(() => setLoading(false))

    const channel = supabase
      .channel('favorites')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorite_entries' }, loadFavorites)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadFavorites])

  return {
    favorites,
    loading,
    isFavorited,
    toggleFavorite,
    favoriteCount: favorites.length,
    reload: loadFavorites,
  }
}