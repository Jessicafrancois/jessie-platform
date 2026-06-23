import { supabase } from '@/lib/supabase'

export async function uploadBlockImage(file: File, folder = 'blocks'): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('assets')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.error('uploadBlockImage error:', error)
    return null
  }

  const { data } = supabase.storage.from('assets').getPublicUrl(path)
  return data.publicUrl
}