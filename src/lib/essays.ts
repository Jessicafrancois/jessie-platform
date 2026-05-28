import { supabase }
from './supabase'

export async function getPublishedEssays() {

  const {
    data,
    error,
  } = await supabase
    .from('essays')
    .select('*')
    .eq('published', true)

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function getEssayBySlug(
  slug: string
) {

  const {
    data,
    error,
  } = await supabase
    .from('essays')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}