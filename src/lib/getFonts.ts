// src/lib/getFonts.ts

import { supabase } from './supabase'

export async function getFonts() {
  const { data, error } = await supabase
    .storage
    .from('fonts')
    .list()

  if (error) {
    console.error(error)
    return []
  }

  return data
    .filter(file =>
      /\.(ttf|otf|woff|woff2)$/i.test(file.name)
    )
    .map(file => ({
      name: file.name
        .replace(/\.(ttf|otf|woff|woff2)$/i, '')
        .replace(/-/g, ' '),
      file: file.name,
    }))
}