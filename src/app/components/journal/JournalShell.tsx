type Props = {
  children: React.ReactNode
}

export default function JournalShell({
  children,
}: Props) {
  return (
    <div
      style={{
        width: 'min(1200px, 92%)',
        margin: '0 auto',
        paddingTop: '12rem',
        paddingBottom: '10rem',
      }}
    >
      {children}
    </div>
  )
}