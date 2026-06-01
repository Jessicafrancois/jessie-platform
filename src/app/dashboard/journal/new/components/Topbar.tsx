
interface TopbarProps {
  onPublish: () => void
}

export default function Topbar({
  onPublish,
}: TopbarProps) {
  return (
    <header className="editor-topbar">
      <div>
        Draft
      </div>

      <button
        type="button"
        onClick={onPublish}
      >
        Publish
      </button>
    </header>
  )
}

