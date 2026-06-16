export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="editor-layout">
      {children}
    </main>
  )
}