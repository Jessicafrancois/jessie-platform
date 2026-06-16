import { supabase } from './supabase'

type SettingsMap = Record<string, string>

export async function getPageSettings(page: string): Promise<SettingsMap> {
  const { data } = await supabase
    .from('site_settings')
    .select('section, key, value')
    .eq('page', page)

  const map: SettingsMap = {}
  ;(data || []).forEach(s => {
    map[`${s.section}.${s.key}`] = s.value || ''
  })
  return map
}

export function get(map: SettingsMap, section: string, key: string, fallback = '') {
  return map[`${section}.${key}`] || fallback
}