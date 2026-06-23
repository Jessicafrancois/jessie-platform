import { supabase } from '@/lib/supabase'
import type { ComponentType } from 'react'
import TiptapEditor from '../../new/editor/tiptap/TiptapEditor'

const TiptapEditorWithInitialData = TiptapEditor as ComponentType<{
  initialData: unknown
}>

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditEntryPage({
  params,
}: Props) {

  const { id } =
    await params

  const { data: entry } =
    await supabase

      .from('entries')

      .select('*')

      .eq('id', id)

      .single()

  if (!entry) {

    return (

      <div>
        Entry not found.
      </div>

    )

  }

  return (

  <TiptapEditor
    initialData={entry}
  />

)
}