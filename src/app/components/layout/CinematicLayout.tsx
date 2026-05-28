'use client'

import { useEffect, useState } from 'react'

import PageEffects from '../effects/PageEffects'
import CursorGlow from '../effects/CursorGlow'
import CinematicNav from '../navigation/CinematicNav'


type Props = {
  children: React.ReactNode
}

export default function CinematicLayout({
  children,
}: Props) {

const [loaded, setLoaded] = useState(false)

useEffect(() => {
  setLoaded(true)
}, [])

  return (
    <main
  className="cinematic-page"
  style={{
    opacity: loaded ? 1 : 0,
    transition: 'opacity 1.2s ease',
  }}
>

      <PageEffects />
      <CursorGlow />
      <CinematicNav />

      <div className="grain-overlay" />

      {children}

    </main>
  )
}