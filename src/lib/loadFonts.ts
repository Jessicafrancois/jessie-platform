import { supabase } from '@/lib/supabase'

export async function loadFonts() {
  const { data: fonts, error } = await supabase
    .from('font_library')
    .select('*')
    .eq('active', true)

  if (error) {
    console.error(error)
    return
  }

  for (const font of fonts) {
    const { data } = supabase.storage
      .from('fonts')
      .getPublicUrl(
        font.bucket_path.replace('fonts/', '')
      )

    const fontFace = new FontFace(
      font.family,
      `url(${data.publicUrl})`
    )

    try {
      await fontFace.load()
      document.fonts.add(fontFace)
    } catch (err) {
      console.error(
        `Failed to load ${font.family}`,
        err
      )
    }
  }
}