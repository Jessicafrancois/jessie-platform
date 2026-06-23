import Link from 'next/link'
import { ButtonContent } from '@/lib/blocks/types'

export default function ButtonBlock({ content }: { content: ButtonContent }) {
  return (
    <div className="block-button">
      <Link href={content.url} className={`block-button-link block-button-link--${content.style}`}>
        {content.label}
      </Link>
    </div>
  )
}