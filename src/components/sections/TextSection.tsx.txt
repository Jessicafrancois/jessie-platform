interface TextSectionProps {
  title?: string
  content: {
    heading?: string
    body?: string
  }
}

export default function TextSection({
  title,
  content,
}: TextSectionProps) {
  return (
    <section className="bg-[#111] border border-white/10 rounded-2xl p-8">
      {title && (
        <div className="text-sm uppercase tracking-wide text-[#e8c86d] mb-4">
          {title}
        </div>
      )}

      {content.heading && (
        <h2 className="text-3xl font-semibold mb-6">
          {content.heading}
        </h2>
      )}

      {content.body && (
        <p className="text-neutral-300 leading-8 whitespace-pre-wrap">
          {content.body}
        </p>
      )}
    </section>
  )
}