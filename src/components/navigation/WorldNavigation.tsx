'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function WorldNavigation() {

  const pathname = usePathname()

  return (

    <header className="world-nav">

      <Link
        href="/"
        className="world-brand"
      >
        Jessica Francois
      </Link>

      <nav className="world-nav-links">

        <Link
          href="/start-here"
          className={
            pathname.includes('start-here')
              ? 'active'
              : ''
          }
        >
          Start Here
        </Link>

        <Link
          href="/our-world"
          className={
            pathname.includes('our-world')
              ? 'active'
              : ''
          }
        >
          Our World
        </Link>

        <Link
          href="/library"
          className={
            pathname.includes('library')
              ? 'active'
              : ''
          }
        >
          Library
        </Link>

        <Link
          href="/journal"
          className={
            pathname.includes('journal')
              ? 'active'
              : ''
          }
        >
          Journal
        </Link>

        <Link
          href="/connect"
          className={
            pathname.includes('connect')
              ? 'active'
              : ''
          }
        >
          Connect
        </Link>

      </nav>

    </header>

  )
}