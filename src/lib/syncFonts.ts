import { supabase } from '@/lib/supabase'

function formatFontName(filename: string) {
  const withoutExtension = filename.replace(/\.[^/.]+$/, '')

  const family = withoutExtension
    .replace(/-(Regular|Bold|Italic|Light|Medium|SemiBold|ExtraBold|Black).*$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()

  const name = withoutExtension
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .trim()

  return {
    name,
    family,
  }
}

export async function syncFonts() {
  const { data: files, error } = await supabase.storage
    .from('fonts')
    .list('', {
      limit: 1000,
    })

  if (error) throw error

  let imported = 0

  for (const file of files || []) {
    if (!file.name.match(/\.(ttf|otf|woff|woff2)$/i)) continue

    const bucketPath = `fonts/${file.name}`

    const { data: existing } = await supabase
      .from('font_library')
      .select('id')
      .eq('bucket_path', bucketPath)
      .maybeSingle()

    if (existing) continue

    const { name, family } = formatFontName(file.name)

    const { error: insertError } = await supabase
      .from('font_library')
      .insert({
        name,
        family,
        bucket_path: bucketPath,
        category: 'Uncategorized',
      })

    if (!insertError) imported++
  }

  return imported
}