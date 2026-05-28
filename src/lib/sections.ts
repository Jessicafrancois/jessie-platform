export type SectionType =
  | 'hero'
  | 'statement'
  | 'quote'
  | 'image'
  | 'gallery'
  | 'manifesto'
  | 'intro'
  | 'shift'

export type Section = {
  type: SectionType

  title?: string

  content?: string

  quote?: string

  image?: string

  align?: 'left' | 'center'

  theme?: 'dark' | 'light'

  height?: 'sm' | 'md' | 'lg'
}