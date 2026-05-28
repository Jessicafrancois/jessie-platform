import { supabase }
from './supabase'

export async function getSiteSettings() {

  const {
    data,
    error,
  } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) {

    console.error(error)

    return {
      signature_font:
        'Cormorant Garamond',
    }
  }

  return data
}