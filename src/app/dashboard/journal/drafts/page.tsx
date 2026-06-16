import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function DraftsPage() {

const { data: drafts, error } =
  await supabase
    .from('entries')
    .select(`
      *,
      collections (
        id,
        name
      ),
      series (
        id,
        name
      )
    `)
    .eq('status', 'Draft')
    .order(
      'updated_at',
      { ascending: false }
    )


  if (error) {
    console.error(error)
  }

  

  return (

    <div
      style={{
        padding: '40px',
      }}
    >

      <h1>
        Drafts
      </h1>

      <p>
        Draft entries across all collections.
      </p>

      <div className="draft-grid">

  {drafts?.map((draft) => (

    <Link
      key={draft.id}
      href={`/dashboard/journal/edit/${draft.id}`}
      className="draft-card"
    >

      <div className="draft-card-header">

        <span>
          {draft.entry_type}
        </span>

<span>
  {draft.collections?.name ||
    'No Collection'}
</span>

<span>
  {draft.series?.name ||
    'No Series'}
</span>

      </div>

      <h2>
        {draft.title}
      </h2>

      <p>
        {draft.excerpt}
      </p>

      <div className="draft-card-footer">

        <span>
          {draft.word_count} words
        </span>

        <span>
          {draft.reading_time} min
        </span>

      </div>

    </Link>

  ))}

      </div>
    </div>
  )
}

