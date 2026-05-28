import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="flex gap-4">

        <Link
          href="/admin/projects"
          className="border px-6 py-3 rounded-xl"
        >
          Projects
        </Link>

        <Link
          href="/admin/media"
          className="border px-6 py-3 rounded-xl"
        >
          Media
        </Link>

      </div>

    </main>
  )
}