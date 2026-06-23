import { ReactNode } from 'react'
import PublicNavbar from '@/components/public/PublicNavbar'

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <PublicNavbar />

      <main>
        {children}
      </main>
    </>
  )
}