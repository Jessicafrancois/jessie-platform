'use client'

import Link from 'next/link'

export default function BackNavigation() {
  return (
    <Link
      href="/"
      className="back-navigation"
    >
      <span>←</span>
      <span>Home</span>
    </Link>
  )
}