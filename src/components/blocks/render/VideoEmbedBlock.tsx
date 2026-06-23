import { VideoEmbedContent } from '@/lib/blocks/types'

function toEmbedUrl(provider: string, url: string): string | null {
  if (!url) return null

  if (provider === 'youtube') {
    // Handles youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const match =
      url.match(/[?&]v=([^&]+)/) ||
      url.match(/youtu\.be\/([^?]+)/) ||
      url.match(/youtube\.com\/embed\/([^?]+)/)
    if (!match) return null
    return `https://www.youtube.com/embed/${match[1]}?rel=0`
  }

  if (provider === 'vimeo') {
    // Handles vimeo.com/ID and player.vimeo.com/video/ID
    const match =
      url.match(/vimeo\.com\/(\d+)/) ||
      url.match(/player\.vimeo\.com\/video\/(\d+)/)
    if (!match) return null
    return `https://player.vimeo.com/video/${match[1]}`
  }

  // self_hosted — use raw URL directly in <video>
  return url
}

const ASPECT_PADDING: Record<string, string> = {
  '16:9': '56.25%',
  '4:3':  '75%',
  '1:1':  '100%',
}

export default function VideoEmbedBlock({ content }: { content: VideoEmbedContent }) {
  const embedUrl = toEmbedUrl(content.provider, content.url)
  if (!embedUrl) return null

  const paddingBottom = ASPECT_PADDING[content.aspectRatio] || '56.25%'

  return (
    <figure className="block-video">
      <div className="block-video-wrapper" style={{ paddingBottom }}>
        {content.provider === 'self_hosted' ? (
          <video
            src={embedUrl}
            controls
            autoPlay={content.autoplay}
            muted={content.autoplay}
            loop={content.autoplay}
            playsInline
          />
        ) : (
          <iframe
            src={embedUrl}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
      {content.caption && <figcaption>{content.caption}</figcaption>}
    </figure>
  )
}