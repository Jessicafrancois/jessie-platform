import PublicLayout from '@/components/public/PublicLayout'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { getBlocksForPage } from '@/lib/blocks/queries'

export default async function JournalPage() {
  const blocks = await getBlocksForPage('journal')

  return (
    <PublicLayout>
      {blocks.map(block => (
        <BlockRenderer
          key={block.id}
          block={block}
        />
      ))}
    </PublicLayout>
  )
}