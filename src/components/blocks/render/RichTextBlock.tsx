import { RichTextContent } from '@/lib/blocks/types'

export default function RichTextBlock({ content }: { content: RichTextContent }) {
  return <div className="block-richtext" dangerouslySetInnerHTML={{ __html: content.html }} />
}