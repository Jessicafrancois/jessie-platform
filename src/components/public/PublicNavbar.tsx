'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import './public.css'

/**
 * PublicNavbar
 *
 * Changes from original:
 *  - Added Home link (/) as wordmark/logo on the left
 *  - Kept existing scroll-hide behavior
 *  - Active state now uses startsWith for more accurate matching
 *
 * NAVBAR RECOMMENDATION (see handoff doc section below)
 * Keep horizontal. The current hide-on-scroll behavior is correct.
 * A right-rail nav would conflict with the editorial left-margin
 * typography already established across the public pages.
 * A hybrid system is premature — add it when a page count exceeds 10.
 */

export default function PublicNavbar() {
  const pathname = usePathname()

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 100) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  function isActive(path: string) {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header
      className={`public-navbar ${
        visible ? 'navbar-visible' : 'navbar-hidden'
      }`}
    >
      {/* Wordmark acts as Home link — left anchor */}
      <Link href="/" className="public-navbar-wordmark">
        Jessica Francois
      </Link>

      <nav className="public-nav-links">

        <Link
          href="/start-here"
          className={isActive('/start-here') ? 'active' : ''}
        >
          Start Here
        </Link>

        <Link
          href="/meet-the-mind"
          className={isActive('/meet-the-mind') ? 'active' : ''}
        >
          Meet The Mind
        </Link>

        <Link
          href="/our-world"
          className={isActive('/our-world') ? 'active' : ''}
        >
          Our World
        </Link>

        <Link
          href="/journal"
          className={isActive('/journal') ? 'active' : ''}
        >
          Journal
        </Link>

        <Link
          href="/connect"
          className={isActive('/connect') ? 'active' : ''}
        >
          Connect
        </Link>

      </nav>
    </header>
  )
}