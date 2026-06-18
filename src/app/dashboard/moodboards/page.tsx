import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import './moodboards.css'

export const revalidate = 0

export default async function MoodboardsPage() {
  const { data: moodboards, error } = await supabase
    .from('moodboards')
    .select('*, projects(id, title)')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('MOODBOARDS ERROR:', error)
  }

  const moodboardsList = moodboards ?? []

  return (
    <main className="moodboards-page">
      <DashboardHeader
        title="Moodboards"
        subtitle="Build presentation-ready strategy and creative direction packages."
      />

      <div className="moodboards-header-bar">
        <Link
          href="/dashboard/moodboards/new"
          className="moodboards-new-btn"
        >
          + New Moodboard
        </Link>
      </div>

      <div className="moodboards-grid">
        {moodboardsList.length === 0 ? (
          <div className="moodboards-empty">
            <h3>No moodboards yet.</h3>

            <p>
              Build your first strategy presentation,
              creative direction board, or client deck.
            </p>

            <Link
              href="/dashboard/moodboards/new"
              className="moodboards-new-btn"
            >
              Create Your First Moodboard
            </Link>
          </div>
        ) : (
          moodboardsList.map((mb) => (
            <div
              key={mb.id}
              className="moodboard-card"
            >
              {mb.cover_image ? (
                <div className="moodboard-card-cover">
                  <img
                    src={mb.cover_image}
                    alt={mb.title}
                  />
                </div>
              ) : (
                <div className="moodboard-card-cover moodboard-card-cover--empty">
                  <span>{mb.slides?.length || 0}</span>
                  <p>slides</p>
                </div>
              )}

              <div className="moodboard-card-body">
                <div className="moodboard-card-meta">
                  <span
                    className={`moodboard-status moodboard-status--${mb.status}`}
                  >
                    {mb.status}
                  </span>

                  {mb.projects?.title && (
                    <span className="moodboard-project">
                      {mb.projects.title}
                    </span>
                  )}
                </div>

                <h3>{mb.title}</h3>

                <p>
                  {mb.slides?.length || 0} slides
                </p>
              </div>

              <div className="moodboard-card-actions">
                <Link
                  href={`/dashboard/moodboards/${mb.id}`}
                  className="moodboard-action"
                >
                  Edit
                </Link>

                {mb.status === 'published' && (
                  <a
                    href={`/moodboards/${mb.slug || mb.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="moodboard-action moodboard-action--view"
                  >
                    View →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}