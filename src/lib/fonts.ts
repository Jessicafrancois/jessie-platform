import { supabase }
from '@/lib/supabase'

export async function getFonts() {

  const { data, error } =
    await supabase
      .from('font_library')
      .select('*')
      .eq('active', true)
      .order('name')

  if (error) {
    console.error(error)
    return []
  }

  return data
}