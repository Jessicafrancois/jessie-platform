import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function SeriesPage({
  params,
}: Props) {

  const { id } = await params

  const {
    data: series,
  } = await supabase
    .from('series')
    .select('*')
    .eq('id', id)
    .single()

  const {
    data: seriesEntries,
  } = await supabase
    .from('entries')
    .select('*')
    .eq('series_id', id)
    .order('updated_at', {
      ascending: false,
    })

  if (!series) {
    return (
      <div style={{ padding: '40px' }}>
        Series not found
      </div>
    )
  }

  return (
    <div style={{ padding: '40px' }}>

      <h1>{series.name}</h1>

      <p>
        {series.description}
      </p>

      <p>
        {seriesEntries?.length || 0}
        {' '}
        entries
      </p>

      <div>

        {seriesEntries?.map(
          (entry) => (
            <Link
              key={entry.id}
              href={`/dashboard/journal/edit/${entry.id}`}
            >
              <div
                style={{
                  marginBottom: '16px',
                }}
              >
                {entry.title}
              </div>
            </Link>
          )
        )}

      </div>

    </div>
  )
}