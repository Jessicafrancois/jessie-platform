import { supabase } from '@/lib/supabase'

export async function getFonts() {
  try {
    const { data, error } = await supabase
      .from('fonts')
      .select('*')
      .order('name')

    if (error) {
      console.warn('Font table unavailable:', error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.warn('Font lookup failed:', error)
    return []
  }
}
