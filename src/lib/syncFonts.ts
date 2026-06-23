import { supabase } from '@/lib/supabase'

export async function syncFonts() {
const { data: files, error } = await supabase.storage
.from('fonts')
.list('', {
limit: 1000,
sortBy: {
column: 'name',
order: 'asc',
},
})

if (error) {
throw error
}

let imported = 0

for (const file of files || []) {
if (
!file.name.endsWith('.ttf') &&
!file.name.endsWith('.otf') &&
!file.name.endsWith('.woff') &&
!file.name.endsWith('.woff2')
) {
continue
}


const fontName = file.name.replace(/\.[^/.]+$/, '')

const { error: upsertError } = await supabase
  .from('fonts')
  .upsert(
    {
      name: fontName,
      family: fontName,
      bucket_path: file.name,
      category: 'Custom',
    },
    {
      onConflict: 'bucket_path',
    }
  )

if (!upsertError) {
  imported++
}


}

return imported
}
