import { SpacerContent } from '@/lib/blocks/types'

export default function SpacerBlock({ content }: { content: SpacerContent }) {
  return <div style={{ height: content.height || 80 }} />
}