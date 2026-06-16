'use client'

import Link from 'next/link'

export default function QuickCreate() {
  return (

    <div className="quick-create glass-card">

      <p className="dashboard-label">
        Quick Create
      </p>

      <div className="quick-create-grid">

        <Link
          href="/dashboard/journal/new"
          className="quick-create-button"
        >
          + New Entry
        </Link>

        <Link
          href="/dashboard/projects/new"
          className="quick-create-button"
        >
          + New Project
        </Link>

        <Link
          href="/dashboard/worlds/new"
          className="quick-create-button"
        >
          + New World
        </Link>

        <Link
          href="/dashboard/assets"
          className="quick-create-button"
        >
          + Upload Asset
        </Link>

      </div>

    </div>

  )
}