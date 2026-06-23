import Link from 'next/link'

export default function Navbar() {

  return (
    <nav className="home-nav">

      <p className="home-logo">
        Jessica Francois
      </p>

      <div className="home-links">

        <Link href="/">
          Home
        </Link>

        <Link href="/Introduction">
          Introduction
        </Link>

        <Link href="/World">
          World
        </Link>

        <Link href="/journal">
          Journal
        </Link>

        <Link href="/Connect">
            Connect
        </Link>
      </div>

    </nav>
  )
}