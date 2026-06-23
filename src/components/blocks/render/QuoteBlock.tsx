import { QuoteContent } from '@/lib/blocks/types'

export default function QuoteBlock({ content }: { content: QuoteContent }) {
  return (
    <blockquote className="block-quote">
      <p>&ldquo;{content.quote}&rdquo;</p>
      {content.author && <cite>{content.author}</cite>}
    </blockquote>
  )
}