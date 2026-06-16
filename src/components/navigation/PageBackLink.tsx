'use client'

import Link from 'next/link'

export default function PageBackLink() {
  return (
    <Link
      href="/"
      className="page-back-link"
    >
      ← Back Home
    </Link>
  )
}