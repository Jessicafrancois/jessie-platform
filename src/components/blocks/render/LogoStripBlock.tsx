import Link from 'next/link'
import { LogoStripContent } from '@/lib/blocks/types'

export default function LogoStripBlock({ content }: { content: LogoStripContent }) {
  if (!content.items?.length) return null

  return (
    <section className="block-logo-strip">
      {content.title && <p className="block-logo-strip-label">{content.title}</p>}
      <div className="block-logo-strip-row">
        {content.items.map((item, i) =>
          item.url ? (
            <Link key={i} href={item.url} className="block-logo-item" target="_blank" rel="noopener">
              <img
                src={item.image}
                alt={item.alt}
                style={{ maxHeight: content.maxHeight || 48 }}
              />
            </Link>
          ) : (
            <div key={i} className="block-logo-item">
              <img
                src={item.image}
                alt={item.alt}
                style={{ maxHeight: content.maxHeight || 48 }}
              />
            </div>
          )
        )}
      </div>
    </section>
  )
}