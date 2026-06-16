'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {

  const pathname = usePathname()

  const segments =
    pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  return (

    <div className="breadcrumbs">

      <Link href="/">
        Home
      </Link>

      {segments.map((segment, index) => {

        const href =
          '/' +
          segments
            .slice(0, index + 1)
            .join('/')

        const label =
          segment
            .replace(/-/g, ' ')
            .replace(
              /\b\w/g,
              char => char.toUpperCase()
            )

        return (

          <span
            key={href}
            className="breadcrumb-item"
          >

            <span className="breadcrumb-divider">
              /
            </span>

            <Link href={href}>
              {label}
            </Link>

          </span>

        )

      })}

    </div>

  )
}