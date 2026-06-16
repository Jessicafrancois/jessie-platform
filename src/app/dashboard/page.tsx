
'use client'

import DashboardRail
from '../../components/dashboard/DashboardRail'

import './dashboard.css'

import QuickCreate
from '../../components/dashboard/QuickCreate'

import RecentActivity
from '../../components/dashboard/RecentActivity'

import { useEffect, useState }
from 'react'

import { supabase }
from '../../lib/supabase'

type Spark = {
  quote: string
  author: string
}

type Essay = {
  title: string
  slug: string
}

type Inquiry = {
  name: string
  email: string
  company: string
}

type Project = {
  id: string
  title: string
  short_description: string | null
  status: string
  progress: number
  created_at: string
}

type Entry = {
  title: string
  slug: string
  status: string
  type: string
  updated_at: string
}

export default function DashboardPage() {

  const [spark, setSpark] =
    useState<Spark | null>(null)

  const [entries, setEntries] =
    useState<Entry[]>([])

  const [inquiries, setInquiries] =
    useState<Inquiry[]>([])

  const [projects, setProjects] =
    useState<Project[]>([])

const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadDashboard() {

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      window.location.href = '/login'
      return
    }

    const { data: sparkData } = await supabase
      .from('sparks').select('quote, author')
    if (sparkData?.length) {
      const currentHour = new Date().getHours()
      setSpark(sparkData[currentHour % sparkData.length])
    }

const { data: entryData } = await supabase

  .from('entries')

    .select('title,slug,status,type,updated_at')

  .order('updated_at', {
    ascending: false,
  })

  .limit(5)

setEntries(entryData || [])

    const { data: inquiryData } = await supabase
      .from('inquiries').select('*')
      .order('created_at', { ascending: false })
    setInquiries(inquiryData || [])

    const { data: projectData } = await supabase
  .from('projects')
 .select(`
  id,
  title,
  short_description,
  status,
  progress,
  created_at
`)
.order('created_at', {
  ascending: false,
})
  setProjects(projectData || [])

    setLoading(false)
  }

  loadDashboard()
}, [])

  async function handleLogout() {

    await supabase.auth.signOut()

    window.location.href =
      '/login'
  }

   const heroImage =
  'https://kpbehguoxekpfejjahcf.supabase.co/storage/v1/object/public/assets/dashboard/hero.jpg'


if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>

  return (

    <main className="dashboard-home">
      {/* LEFT DOCK */}

      

      {/* CENTER */}

      <section className="dashboard-feed">

        <div className="dashboard-hero glass-card">

  <div className="dashboard-hero-overlay" />

      <img
        src={heroImage}
        alt=""
        className="dashboard-hero-image"
    />

  <div className="dashboard-hero-content">

    <p className="dashboard-label">
      Today's Spark
    </p>

    <h1>
      {spark?.quote}
    </h1>

    <span>
      {spark?.author}
    </span>

  </div>

</div>

            <QuickCreate />

          <RecentActivity />


        <div className="dashboard-module-grid">

          {/* JOURNAL */}

         <a
          href="/dashboard/worlds"
          className="dashboard-module glass-card"
        >

          <p>
            Worlds
          </p>

          <h2>
            Living Universes
          </h2>

          <span>
            Build characters,
            locations,
            histories,
            and systems.
          </span>

        </a>

        </div>

       <div className="dashboard-focus glass-card">

          <p className="dashboard-label">
            Command Center
          </p>

          <h2>
            Today's Priorities
          </h2>

          <div className="command-grid">

            <div className="command-card">

              <span>
                Active Projects
              </span>

              <strong>
                {projects.length}
              </strong>

            </div>

            <div className="command-card">

              <span>
                Draft Entries
              </span>

              <strong>
                {
                  entries.filter(
                    (entry: any) =>
                      entry.status?.toLowerCase() === 'draft'
                  ).length
                }
              </strong>

            </div>

            <div className="command-card">

              <span>
                Open Leads
              </span>

              <strong>
                {inquiries.length}
              </strong>

            </div>
          </div>

            {/* CREATIVE QUEUE — from projects table */}
          <div className="creative-queue glass-card">
            <p className="dashboard-label">Creative Queue</p>
            <h2>Waiting For Attention</h2>
            <div className="queue-list">
              {projects.slice(0, 3).map((project) => (
                <a
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="queue-item"
                >
                  <span className="queue-item-title">{project.title}</span>
                  <span className={`queue-status queue-status--${project.status?.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </a>
              ))}
              {projects.length === 0 && (
                <div className="queue-item queue-item--empty">
                  No active projects yet.{' '}
                  <a href="/dashboard/projects/new">Create one →</a>
                </div>
              )}
            </div>
          </div>

          </div>

{/* SUGGESTED NEXT ACTION — from most recently updated project */}
{projects[0] && (
  <div className="next-action glass-card">
    <p className="dashboard-label">Suggested Next Action</p>
    <h2>Continue {projects[0].title}</h2>
    <p>
      Last updated{' '}
      {new Date(projects[0].created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric'
      })}.
      {projects[0].progress > 0 && ` Progress at ${projects[0].progress}%.`}
    </p>
    <a href={`/dashboard/projects/${projects[0].id}`} className="action-button">
      Open Project
    </a>
  </div>
)}
        

        </section>
  

      {/* RIGHT RAIL */}

     <DashboardRail
  inquiries={inquiries}
  projects={projects}
  entries={entries}
/>


    </main>
  )
}
