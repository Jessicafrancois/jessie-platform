import ImageUpload from '../media/ImageUpload'

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
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 min-h-[720px] flex items-end">
      {content.image_url && (
        <>
          <img
            src={content.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </>
      )}

      <div className="relative z-10 p-12 md:p-20 max-w-5xl">
        {content.title && (
          <h1 className="text-6xl md:text-8xl font-semibold leading-none mb-8">
            {content.title}
          </h1>
        )}

        {content.subtitle && (
          <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed max-w-3xl">
            {content.subtitle}
          </p>
        )}
      </div>
    </section>
  )
}