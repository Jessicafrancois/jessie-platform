'use client'

import { useState } from 'react'
import { FAQContent } from '@/lib/blocks/types'

export default function FAQBlock({ content }: { content: FAQContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    content.openFirst ? 0 : null
  )

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section className="block-faq">
      {content.title && <h2>{content.title}</h2>}
      <div className="block-faq-list">
        {content.items.map((item, i) => (
          <div key={i} className={`block-faq-item ${openIndex === i ? 'is-open' : ''}`}>
            <button className="block-faq-question" onClick={() => toggle(i)}>
              <span>{item.question}</span>
              <span className="block-faq-chevron">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="block-faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}