import PublicNavbar from './PublicNavbar'
import PublicFooter from './PublicFooter'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  )
}