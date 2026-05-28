export type ParagraphBlock = {
  type: 'paragraph'
  content: string
}

export type QuoteBlock = {
  type: 'quote'
  content: string
}

export type AmbientQuoteBlock = {
  type: 'ambient-quote'
  content: string
}

export type ImageBlock = {
  type: 'image'
  content: string
}

export type FullscreenImageBlock = {
  type: 'fullscreen-image'
  content: string
}

export type SplitBlock = {
  type: 'split'
  content: string
  image?: string
}

export type GalleryBlock = {
  type: 'gallery'
  images: string[]
}

export type TimelineBlock = {
  type: 'timeline'
  items: {
    year: string
    title: string
    description: string
  }[]
}

export type EssayBlock =
  | ParagraphBlock
  | QuoteBlock
  | AmbientQuoteBlock
  | ImageBlock
  | FullscreenImageBlock
  | SplitBlock
  | GalleryBlock
  | TimelineBlock

export interface Essay {
  id: string

  slug: string

  title: string

  intro: string

  image: string

  content: EssayBlock[]

  published: boolean
}