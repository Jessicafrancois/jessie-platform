import { supabase } from '@/lib/supabase'
import WorldsDashboardClient from '../../../components/worlds/WorldsDashboardClient'
import './worlds-dashboard.css'

export const revalidate = 0

export default async function WorldsDashboardPage() {
  const { data: worlds, error } = await supabase
    .from('worlds')
    .select('*, world_slides(count)')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })

  if (error) console.error('WORLDS DASHBOARD ERROR:', error)

  const worldsList = (worlds ?? []).map(w => ({
    ...w,
    slide_count: w.world_slides?.[0]?.count ?? 0,
  }))

  return <WorldsDashboardClient initialWorlds={worldsList} />
}