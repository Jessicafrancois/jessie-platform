import { StatsRowContent } from '@/lib/blocks/types'

export default function StatsRowBlock({ content }: { content: StatsRowContent }) {
  return (
    <section className="block-stats">
      {content.title && <h2>{content.title}</h2>}
      <div className="block-stats-row">
        {content.items.map((stat, i) => (
          <div key={i} className="block-stat">
            <span
              className="block-stat-value"
              style={{ color: content.accentColor || '#d8bc6e' }}
            >
              {stat.prefix}{stat.value}{stat.suffix}
            </span>
            <span className="block-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}