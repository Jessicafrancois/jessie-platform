export type EssayBlock =
  | {
      type: 'paragraph'
      content: string
    }
  | {
      type: 'quote'
      content: string
    }
  | {
      type: 'image'
      image: string
    }

export interface Essay {
  slug: string
  title: string
  intro: string
  image: string
  blocks: EssayBlock[]
}
