import { TestimonialGridContent } from '@/lib/blocks/types'

export default function TestimonialGridBlock({
  content,
}: {
  content: TestimonialGridContent
}) {
  return (
    <section className="block-testimonials">
      {content.title && <h2>{content.title}</h2>}
      <div
        className="block-testimonials-grid"
        style={{ gridTemplateColumns: `repeat(${content.columns}, 1fr)` }}
      >
        {content.items.map((item, i) => (
          <div key={i} className="block-testimonial-card">
            <p className="block-testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
            <div className="block-testimonial-author">
              {item.avatar && (
                <img src={item.avatar} alt={item.author} className="block-testimonial-avatar" />
              )}
              <div>
                <strong>{item.author}</strong>
                {item.role && <span>{item.role}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}