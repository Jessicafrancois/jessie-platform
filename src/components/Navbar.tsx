import Link from 'next/link'

export default function Navbar() {

  return (
    <nav className="home-nav">

      <p className="home-logo">
        Jessie
      </p>

      <div className="home-links">

        <Link href="/">
          Home
        </Link>

        <Link href="/journal">
          Journal
        </Link>

      </div>

    </nav>
  )
}