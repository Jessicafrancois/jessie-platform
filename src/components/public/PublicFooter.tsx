import Link from 'next/link'

/**
 * PublicFooter
 *
 * Changes from original:
 *  - /start  → /start-here
 *  - /world  → /our-world
 *  - Added Home link
 *  - Added Login / Creator Portal link
 */

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">

        <div className="public-footer-brand">
          <h3>Jessie</h3>
          <p>
            Building ventures,
            worlds,
            and experiences.
          </p>
        </div>

        <nav className="public-footer-links">
          <Link href="/">Home</Link>
          <Link href="/start-here">Start Here</Link>
          <Link href="/our-world">Our World</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/connect">Connect</Link>
        </nav>

        <div className="public-footer-bottom">
          <Link href="/login" className="public-footer-portal">
            Creator Portal →
          </Link>
          <span className="public-footer-copy">
            © {new Date().getFullYear()} Jessica Francois
          </span>
        </div>

      </div>
    </footer>
  )
}