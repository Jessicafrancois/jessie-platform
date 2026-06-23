import { supabase } from '@/lib/supabase'
import { PageBlock, BlockType, BlockContent, defaultContentFor } from './types'

export async function getBlocksForPage(page: string): Promise<PageBlock[]> {
  const { data, error } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page', page)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getBlocksForPage error:', error)
    return []
  }
  return data as PageBlock[]
}

export async function insertBlock(
  page: string,
  type: BlockType,
  sortOrder: number,
): Promise<PageBlock | null> {
  const { data, error } = await supabase
    .from('page_blocks')
    .insert({ page, type, content: defaultContentFor(type), sort_order: sortOrder })
    .select()
    .single()

  if (error) {
    console.error('insertBlock error:', error)
    return null
  }
  return data as PageBlock
}

export async function duplicateBlockRow(
  block: PageBlock,
  newSortOrder: number,
): Promise<PageBlock | null> {
  const { data, error } = await supabase
    .from('page_blocks')
    .insert({
      page: block.page,
      type: block.type,
      content: block.content,
      sort_order: newSortOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('duplicateBlockRow error:', error)
    return null
  }
  return data as PageBlock
}

export async function deleteBlockRow(id: string): Promise<void> {
  const { error } = await supabase.from('page_blocks').delete().eq('id', id)
  if (error) console.error('deleteBlockRow error:', error)
}

export async function updateBlockContent(id: string, content: BlockContent): Promise<void> {
  const { error } = await supabase
    .from('page_blocks')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) console.error('updateBlockContent error:', error)
}

export async function saveBlocksBatch(blocks: PageBlock[]): Promise<void> {
  await Promise.all(
    blocks.map((block, index) =>
      supabase
        .from('page_blocks')
        .update({
          content: block.content,
          sort_order: index,
          updated_at: new Date().toISOString(),
        })
        .eq('id', block.id),
    ),
  )
}
