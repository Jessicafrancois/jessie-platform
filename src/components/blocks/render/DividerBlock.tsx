import { DividerContent } from '@/lib/blocks/types'

export default function DividerBlock({ content }: { content: DividerContent }) {
  return <hr className={`block-divider block-divider--${content.style || 'line'}`} />
}