interface HeroSectionProps {
  title?: string
  content: {
    title?: string
    subtitle?: string
    image_url?: string
  }
}

export default function HeroSection({
  content,
}: HeroSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
      {content.image_url && (
        <img
          src={content.image_url}
          alt=""
          className="w-full h-[320px] object-cover"
        />
      )}

      <div className="p-10">
        {content.title && (
          <h1 className="text-5xl font-semibold mb-4">
            {content.title}
          </h1>
        )}

        {content.subtitle && (
          <p className="text-xl text-neutral-400 max-w-3xl leading-8">
            {content.subtitle}
          </p>
        )}
      </div>
    </section>
  )
}