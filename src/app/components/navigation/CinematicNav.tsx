export default function CinematicNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: '2rem 0',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(10,10,10,0.35)',
        borderBottom: '1px solid rgba(230,226,215,0.06)',
      }}
    >
      <div
        className="cinematic-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >

        <a
          href="/"
          style={{
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Jessica Francois
        </a>

        <div
          style={{
            display: 'flex',
            gap: '2rem',
          }}
        >
          <a href="/introductions">Introductions</a>
          <a href="/worlds">Worlds</a>
          <a href="/journal">Journal</a>
          <a href="/connect">Connect</a>
        </div>

      </div>
    </nav>
  )
}