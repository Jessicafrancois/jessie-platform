import { supabase } from '@/lib/supabase'
import JournalCarousel from '@/components/journal/JournalCarousel'
import './journal.css'

export const revalidate = 60

export type JournalEntry = {
  id: string
  title: string
  slug: string
  intro: string | null
  entry_type: string | null
  cover_image: string | null
  cover_video: string | null
  published_at: string | null
  reading_time: number | null
  status: string
}

export default async function JournalDashboardPage() {
  const { data, error } = await supabase
    .from('entries')
    .select(
      'id, title, slug, intro, entry_type, cover_image, cover_video, published_at, reading_time, status'
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) console.error('journal entries error:', error)

  const entries: JournalEntry[] = data ?? []

  return (
    <div className="jd-root">
      {/* Grain overlay */}
      <div className="jd-grain" aria-hidden="true" />

      {/* Top bar */}
      <header className="jd-topbar">
        <span className="jd-topbar-title">JOURNAL</span>
        <button className="jd-topbar-menu" aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* Main carousel */}
      <main className="jd-main">
        {entries.length === 0 ? (
          <div className="jd-empty">
            <p>No published entries yet.</p>
            <a href="/dashboard/journal/new" className="jd-empty-cta">
              Create First Entry →
            </a>
          </div>
        ) : (
          <JournalCarousel entries={entries} />
        )}
      </main>
    </div>
  )
}