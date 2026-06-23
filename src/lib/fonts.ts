import { supabase } from '@/lib/supabase'

export async function syncFonts() {
const { data: files, error } =
await supabase.storage
.from('fonts')
.list('', { limit: 1000 })

if (error) {
throw error
}

let imported = 0

for (const file of files || []) {
const fontName = file.name.replace(/.[^/.]+$/, '')


const { error: insertError } =
  await supabase
    .from('fonts')
    .upsert(
      {
        name: fontName,
        family: fontName,
        bucket_path: file.name,
        category: 'Custom',
        active: true,
      },
      {
        onConflict: 'bucket_path',
      }
    )

if (!insertError) {
  imported++
}


}

return imported
}
