import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import './worlds-dashboard.css'

export const revalidate = 0

type World = {
  id: string
  title: string
  slug: string | null
  description: string | null
  type: string | null
  status: string | null
  cover_image: string | null
  tagline: string | null
  created_at: string
  updated_at: string
}

type WorldWithCounts = World & {
  campaign_count: number
  project_count: number
  entry_count: number
  moodboard_count: number
}

export default async function WorldsDashboardPage() {

  // Fetch worlds
  const { data: worlds, error } = await supabase
    .from('worlds')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'white' }}>
        <p style={{ color: '#ff6b6b' }}>Error loading worlds: {error.message}</p>
        <Link href="/dashboard" style={{ color: '#d8bc6e' }}>← Back to dashboard</Link>
      </div>
    )
  }

  // Get counts per world in parallel
  const worldsWithCounts: WorldWithCounts[] = await Promise.all(
    (worlds || []).map(async (world) => {
      const [campaigns, projects, entries, moodboards] = await Promise.all([
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('world_id', world.id),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('world_id', world.id),
        supabase.from('entries').select('id', { count: 'exact', head: true }).eq('world_id', world.id).eq('status', 'published'),
        supabase.from('moodboards').select('id', { count: 'exact', head: true }).eq('world_id', world.id),
      ])
      return {
        ...world,
        campaign_count: campaigns.count || 0,
        project_count: projects.count || 0,
        entry_count: entries.count || 0,
        moodboard_count: moodboards.count || 0,
      }
    })
  )

  // Summary stats
  const totalWorlds   = worldsWithCounts.length
  const activeWorlds  = worldsWithCounts.filter(w => w.status === 'Active').length
  const totalProjects = worldsWithCounts.reduce((sum, w) => sum + w.project_count, 0)
  const totalEntries  = worldsWithCounts.reduce((sum, w) => sum + w.entry_count, 0)

  // Group by status for display
  const active      = worldsWithCounts.filter(w => w.status === 'Active')
  const inDev       = worldsWithCounts.filter(w => w.status === 'In Development')
  const onHold      = worldsWithCounts.filter(w => w.status === 'On Hold')
  const archived    = worldsWithCounts.filter(w => w.status === 'Archived')

  const STATUS_COLOR: Record<string, string> = {
    'Active':          '#50c878',
    'In Development':  '#d8bc6e',
    'On Hold':         'rgba(255,255,255,.35)',
    'Archived':        'rgba(255,255,255,.2)',
  }

  const TYPE_ICON: Record<string, string> = {
    'Brand':     '◈',
    'Story':     '✦',
    'Community': '◎',
    'Ecosystem': '⬡',
    'Concept':   '◇',
    'Research':  '≡',
  }

  return (
    <main className="worlds-dash">

      <DashboardHeader
        title="Worlds"
        subtitle="Design brands, stories, experiences, and ecosystems."
      />

      {/* ── STATS BAR ─────────────────────── */}
      <div className="worlds-dash-stats">
        <div className="worlds-dash-stat">
          <span className="worlds-dash-stat-number">{totalWorlds}</span>
          <span className="worlds-dash-stat-label">Total Worlds</span>
        </div>
        <div className="worlds-dash-stat">
          <span className="worlds-dash-stat-number worlds-dash-stat-number--active">
            {activeWorlds}
          </span>
          <span className="worlds-dash-stat-label">Active</span>
        </div>
        <div className="worlds-dash-stat">
          <span className="worlds-dash-stat-number">{totalProjects}</span>
          <span className="worlds-dash-stat-label">Projects</span>
        </div>
        <div className="worlds-dash-stat">
          <span className="worlds-dash-stat-number">{totalEntries}</span>
          <span className="worlds-dash-stat-label">Published Entries</span>
        </div>
        <div className="worlds-dash-actions">
          <Link href="/dashboard/worlds/new" className="worlds-dash-new-btn">
            + Create World
          </Link>
        </div>
      </div>

      {/* ── EMPTY STATE ──────────────────── */}
      {totalWorlds === 0 && (
        <div className="worlds-dash-empty">
          <span className="worlds-dash-empty-icon">◈</span>
          <h3>No worlds yet.</h3>
          <p>
            A world is a designed reality with a purpose. Create your first
            to start organizing everything under it.
          </p>
          <Link href="/dashboard/worlds/new" className="worlds-dash-new-btn">
            Create Your First World
          </Link>
        </div>
      )}

      {/* ── ACTIVE WORLDS ────────────────── */}
      {active.length > 0 && (
        <div className="worlds-dash-group">
          <div className="worlds-dash-group-header">
            <span className="worlds-dash-group-dot worlds-dash-group-dot--active" />
            <h2 className="worlds-dash-group-title">Active</h2>
            <span className="worlds-dash-group-count">{active.length}</span>
          </div>
          <div className="worlds-dash-grid">
            {active.map((world, index) => (
              <WorldCard
                key={world.id}
                world={world}
                index={index}
                statusColor={STATUS_COLOR}
                typeIcon={TYPE_ICON}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── IN DEVELOPMENT ───────────────── */}
      {inDev.length > 0 && (
        <div className="worlds-dash-group">
          <div className="worlds-dash-group-header">
            <span className="worlds-dash-group-dot worlds-dash-group-dot--dev" />
            <h2 className="worlds-dash-group-title">In Development</h2>
            <span className="worlds-dash-group-count">{inDev.length}</span>
          </div>
          <div className="worlds-dash-grid">
            {inDev.map((world, index) => (
              <WorldCard
                key={world.id}
                world={world}
                index={index}
                statusColor={STATUS_COLOR}
                typeIcon={TYPE_ICON}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── ON HOLD ──────────────────────── */}
      {onHold.length > 0 && (
        <div className="worlds-dash-group">
          <div className="worlds-dash-group-header">
            <span className="worlds-dash-group-dot worlds-dash-group-dot--hold" />
            <h2 className="worlds-dash-group-title">On Hold</h2>
            <span className="worlds-dash-group-count">{onHold.length}</span>
          </div>
          <div className="worlds-dash-grid worlds-dash-grid--muted">
            {onHold.map((world, index) => (
              <WorldCard
                key={world.id}
                world={world}
                index={index}
                statusColor={STATUS_COLOR}
                typeIcon={TYPE_ICON}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── ARCHIVED ─────────────────────── */}
      {archived.length > 0 && (
        <div className="worlds-dash-group">
          <div className="worlds-dash-group-header">
            <span className="worlds-dash-group-dot worlds-dash-group-dot--archived" />
            <h2 className="worlds-dash-group-title">Archived</h2>
            <span className="worlds-dash-group-count">{archived.length}</span>
          </div>
          <div className="worlds-dash-grid worlds-dash-grid--muted">
            {archived.map((world, index) => (
              <WorldCard
                key={world.id}
                world={world}
                index={index}
                statusColor={STATUS_COLOR}
                typeIcon={TYPE_ICON}
              />
            ))}
          </div>
        </div>
      )}

    </main>
  )
}

// ── WORLD CARD COMPONENT ──────────────────

function WorldCard({
  world,
  index,
  statusColor,
  typeIcon,
}: {
  world: WorldWithCounts
  index: number
  statusColor: Record<string, string>
  typeIcon: Record<string, string>
}) {
  const statusCol = statusColor[world.status || ''] || 'rgba(255,255,255,.3)'
  const icon      = typeIcon[world.type || ''] || '◇'

  return (
    <Link
      href={`/dashboard/worlds/${world.id}`}
      className="world-card-dash"
    >
      {/* Cover */}
      <div className="world-card-dash-cover">
        {world.cover_image ? (
          <img src={world.cover_image} alt={world.title} />
        ) : (
          <div className="world-card-dash-cover--empty">
            <span className="world-card-dash-cover-icon">{icon}</span>
          </div>
        )}
        <div className="world-card-dash-cover-overlay" />

        {/* Type badge overlaid on cover */}
        {world.type && (
          <span className="world-card-dash-type">
            {icon} {world.type}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="world-card-dash-body">

        <div className="world-card-dash-header">
          <h3 className="world-card-dash-title">{world.title}</h3>
          <span
            className="world-card-dash-status"
            style={{ color: statusCol, borderColor: `${statusCol}30` }}
          >
            {world.status}
          </span>
        </div>

        {world.tagline && (
          <p className="world-card-dash-tagline">{world.tagline}</p>
        )}

        {world.description && (
          <p className="world-card-dash-description">{world.description}</p>
        )}

        {/* Counts */}
        <div className="world-card-dash-counts">
          {world.campaign_count > 0 && (
            <div className="world-card-dash-count">
              <span className="world-card-dash-count-number">
                {world.campaign_count}
              </span>
              <span className="world-card-dash-count-label">
                {world.campaign_count === 1 ? 'Campaign' : 'Campaigns'}
              </span>
            </div>
          )}
          {world.project_count > 0 && (
            <div className="world-card-dash-count">
              <span className="world-card-dash-count-number">
                {world.project_count}
              </span>
              <span className="world-card-dash-count-label">
                {world.project_count === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
          )}
          {world.entry_count > 0 && (
            <div className="world-card-dash-count">
              <span className="world-card-dash-count-number">
                {world.entry_count}
              </span>
              <span className="world-card-dash-count-label">
                {world.entry_count === 1 ? 'Entry' : 'Entries'}
              </span>
            </div>
          )}
          {world.moodboard_count > 0 && (
            <div className="world-card-dash-count">
              <span className="world-card-dash-count-number">
                {world.moodboard_count}
              </span>
              <span className="world-card-dash-count-label">
                {world.moodboard_count === 1 ? 'Moodboard' : 'Moodboards'}
              </span>
            </div>
          )}
          {world.campaign_count === 0 &&
           world.project_count === 0 &&
           world.entry_count === 0 && (
            <span className="world-card-dash-count-empty">
              Nothing added yet
            </span>
          )}
        </div>

        <div className="world-card-dash-footer">
          <span className="world-card-dash-updated">
            Updated {new Date(world.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="world-card-dash-open">Open →</span>
        </div>

      </div>
    </Link>
  )
}