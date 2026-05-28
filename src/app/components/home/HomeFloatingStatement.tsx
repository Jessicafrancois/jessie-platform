export default function HomeFloatingStatement() {
  return (
    <section
      className="cinematic-section reveal"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >

      <div
        className="constraint-lg"
        style={{
          position: 'relative',
        }}
      >

        <div
          className="ambient-glow glow-bronze"
          style={{
            top: '20%',
            left: '30%',
          }}
        />

        <p
          className="display-xl balance"
          style={{
            position: 'relative',
            zIndex: 2,
          }}
        >
          The strongest stories
          don’t just communicate.
          They linger.
        </p>

      </div>

    </section>
  )
}