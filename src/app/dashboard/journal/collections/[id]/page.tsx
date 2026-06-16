import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function CollectionPage({
  params,
}: Props) {

  const { id } = await params

  const {
    data: collection,
  } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single()

  const {
    data: collectionEntries,
  } = await supabase
    .from('entries')
    .select('*')
    .eq('collection_id', id)
    .order('updated_at', {
      ascending: false,
    })

  if (!collection) {
    return (
      <div style={{ padding: '40px' }}>
        Collection not found
      </div>
    )
  }

  return (
    <div style={{ padding: '40px' }}>

      <h1>{collection.name}</h1>

      <p>
        {collection.description}
      </p>

      <p>
        {collectionEntries?.length || 0}
        {' '}
        entries
      </p>

      <div>

        {collectionEntries?.map(
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