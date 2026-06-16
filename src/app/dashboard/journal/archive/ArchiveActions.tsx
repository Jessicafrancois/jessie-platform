'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ArchiveActions({
  entryId,
  entryTitle,
}: {
  entryId: string
  entryTitle: string
}) {
  const router = useRouter()

  async function restore() {
    await supabase
      .from('entries')
      .update({ status: 'draft', updated_at: new Date().toISOString() })
      .eq('id', entryId)
    router.refresh()
  }

  async function deletePermanently() {
    if (!confirm(`Permanently delete "${entryTitle}"? This cannot be undone.`)) return
    await supabase.from('entries').delete().eq('id', entryId)
    router.refresh()
  }

  return (
    <div className="archive-entry-actions">
      <button className="archive-btn archive-btn--restore" onClick={restore}>
        Restore to Draft
      </button>
      <Link
        href={`/dashboard/journal/edit/${entryId}`}
        className="archive-btn"
      >
        Edit
      </Link>
      <button className="archive-btn archive-btn--delete" onClick={deletePermanently}>
        Delete
      </button>
    </div>
  )
}