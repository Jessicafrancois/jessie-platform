
'use client'

import DashboardRail
from '../../components/dashboard/DashboardRail'


import DashboardEssays
from '../../components/dashboard/DashboardEssays'

import DashboardDock
from '../../components/dashboard/DashboardDock'


import DashboardHero
from '../../components/dashboard/DashboardHero'


import DashboardProjects
from '../../components/dashboard/DashboardProjects'

import { useEffect, useState }
from 'react'

import './dashboard.css'

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
  id: number
  title: string
  description: string
  status: string
  progress: number
}

export default function DashboardPage() {

  const [spark, setSpark] =
    useState<Spark | null>(null)

  const [essays, setEssays] =
    useState<Essay[]>([])

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

    const { data: essayData } = await supabase
      .from('essays').select('title, slug')
      .order('created_at', { ascending: false }).limit(3)
    setEssays(essayData || [])

    const { data: inquiryData } = await supabase
      .from('inquiries').select('*')
      .order('created_at', { ascending: false })
    setInquiries(inquiryData || [])

    const { data: projectData } = await supabase
      .from('projects').select('*')
      .order('created_at', { ascending: false })
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

  const latestInquiry =
    inquiries[0]

if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>

  return (

    <main className="creative-dashboard">

      {/* LEFT DOCK */}

      <aside className="dashboard-dock">

        <div className="dashboard-brand">
          Jessie
        </div>

        <nav className="dashboard-dock-nav">

          <a href="/dashboard">
            Home
          </a>

          <a href="/dashboard/journal/new">
            Journal
          </a>

          <a href="/dashboard/projects">
            Projects
          </a>

          <a href="/dashboard/inquiries">
            Inquiries
          </a>

          <a href="/">
            Site
          </a>

          <button
            onClick={handleLogout}
            className="logout-button"
          >

            Logout

          </button>

        </nav>

      </aside>

      {/* CENTER */}

      <section className="dashboard-feed">

        <div className="dashboard-hero glass-card">

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

        <div className="dashboard-module-grid">

          {/* JOURNAL */}

          <a
            href="/dashboard/journal/new"
            className="dashboard-module glass-card"
          >

            <p>
              Journal
            </p>

            <h2>
              Writing Space
            </h2>

            <span>
              Draft cinematic essays and visual stories.
            </span>

          </a>

          {/* PROJECTS */}

          <div className="dashboard-module glass-card">

            <p>
              Active Projects
            </p>

            <h2>
              Venture Worlds
            </h2>

            <div className="project-list">

              {projects.map((project) => (

                <div
                  key={project.id}
                  className="project-item"
                >

                  <div className="project-top">

                    <h3>
                      {project.title}
                    </h3>

                    <span>
                      {project.status}
                    </span>

                  </div>

                  <p>
                    {project.description}
                  </p>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width:
                          `${project.progress}%`
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ESSAYS */}

          <div className="dashboard-module glass-card">

            <p>
              Recent Essays
            </p>

            <h2>
              Latest Writing
            </h2>

            <div className="essay-list">

              {essays.map((essay) => (

                <a
                  key={essay.slug}
                  href={`/journal/${essay.slug}`}
                  className="essay-link"
                >

                  {essay.title}

                </a>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* RIGHT RAIL */}

      <DashboardRail
        inquiries={inquiries}
      />

    </main>
  )
}

