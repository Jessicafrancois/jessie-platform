export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#111] min-h-screen">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-lg font-semibold text-[#e8c86d]">
          ✦ Jessie
        </h1>

        <p className="text-sm text-neutral-500 mt-1">
          Content Platform
        </p>
      </div>

      <nav className="p-4 space-y-2">
        <button className="w-full text-left px-4 py-2 rounded-lg bg-white/5">
          Projects
        </button>

        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
          Media
        </button>
      </nav>
    </aside>
  )
}