import Link from 'next/link'
import { TeamGridContent } from '@/lib/blocks/types'

export default function TeamGridBlock({ content }: { content: TeamGridContent }) {
  return (
    <section className="block-team">
      {content.title && <h2>{content.title}</h2>}
      <div
        className="block-team-grid"
        style={{ gridTemplateColumns: `repeat(${content.columns}, 1fr)` }}
      >
        {content.items.map((member, i) => {
          const card = (
            <div className="block-team-card">
              {member.photo && (
                <div className="block-team-photo">
                  <img src={member.photo} alt={member.name} />
                </div>
              )}
              <div className="block-team-info">
                <strong>{member.name}</strong>
                {member.role && <span>{member.role}</span>}
                {member.bio && <p>{member.bio}</p>}
              </div>
            </div>
          )

          return member.link ? (
            <Link key={i} href={member.link} className="block-team-card-link">
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          )
        })}
      </div>
    </section>
  )
}