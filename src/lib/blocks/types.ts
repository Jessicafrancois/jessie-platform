export type BlockType =
  | 'hero'
  | 'richtext'
  | 'image'
  | 'gallery'
  | 'quote'
  | 'button'
  | 'world_slider'
  | 'projects'
  | 'journal_feed'
  | 'columns'
  | 'moodboard_embed'
  | 'testimonial_grid'
  | 'stats_row'
  | 'contact_form'
  | 'video_embed'
  | 'faq'
  | 'logo_strip'
  | 'team_grid'
  | 'spacer'
  | 'divider'

// ── Columns ────────────────────────────────────────────────────────────────
// Each slot holds a list of blocks rendered inline inside the column.
// The editor shows a simplified version (left/right text only, no nesting).
// For richer layouts, slots accept any non-columns block type.

export interface ColumnSlot {
  blocks: Array<{ type: BlockType; content: BlockContent }>
}

export interface ColumnsContent {
  layout: '2-col' | '3-col' | '1-2' | '2-1' // ratio variants
  gap: number             // px gap between columns
  slots: ColumnSlot[]     // length matches column count
}

// ── Moodboard Embed ────────────────────────────────────────────────────────
export interface MoodboardEmbedContent {
  moodboardId: string     // UUID from your `moodboards` table
  displayMode: 'full' | 'cover_link'  // full = embedded slides, cover_link = card + CTA
  title: string           // override; leave empty to use moodboard's own title
  ctaLabel: string        // e.g. "View Presentation" — used in cover_link mode
}

// ── Testimonial Grid ───────────────────────────────────────────────────────
export interface Testimonial {
  quote: string
  author: string
  role: string
  avatar: string          // URL or empty
}

export interface TestimonialGridContent {
  title: string
  items: Testimonial[]
  columns: 2 | 3
}

// ── Stats Row ──────────────────────────────────────────────────────────────
export interface Stat {
  value: string           // "150", "$2M+", "3"  — displayed large
  label: string           // "active drivers", "projected revenue", "ventures"
  prefix: string          // e.g. "$"
  suffix: string          // e.g. "+"
}

export interface StatsRowContent {
  title: string
  items: Stat[]
  accentColor: string     // hex — defaults to your gold #d8bc6e
}

// ── Contact Form ───────────────────────────────────────────────────────────
export type InquiryFormType = 'collaborate' | 'partner' | 'contact'

export interface ContactFormContent {
  formType: InquiryFormType
  heading: string
  subheading: string
  submitLabel: string
  successMessage: string
}

// ── Video Embed ────────────────────────────────────────────────────────────
export type VideoProvider = 'youtube' | 'vimeo' | 'self_hosted'

export interface VideoEmbedContent {
  provider: VideoProvider
  url: string             // full URL for all providers
  caption: string
  aspectRatio: '16:9' | '4:3' | '1:1'
  autoplay: boolean       // only respected for self_hosted
}

// ── FAQ / Accordion ────────────────────────────────────────────────────────
export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  title: string
  items: FAQItem[]
  openFirst: boolean      // expand first item on load
}

// ── Logo Strip ─────────────────────────────────────────────────────────────
export interface LogoItem {
  image: string           // URL
  alt: string
  url: string             // optional link
}

export interface LogoStripContent {
  title: string           // e.g. "Partners & Sponsors" — leave empty to hide
  items: LogoItem[]
  maxHeight: number       // px height for logo images
}

// ── Team Grid ──────────────────────────────────────────────────────────────
export interface TeamMember {
  name: string
  role: string
  bio: string
  photo: string           // URL
  link: string            // optional personal/portfolio URL
}

export interface TeamGridContent {
  title: string
  items: TeamMember[]
  columns: 2 | 3 | 4
}
export interface HeroContent {
  headline: string
  subheadline: string
  backgroundImage: string
}

export interface RichTextContent {
  html: string
  json: Record<string, unknown> | null
}

export interface ImageContent {
  image: string
  caption: string
}

export interface GalleryContent {
  images: string[]
}

export interface QuoteContent {
  quote: string
  author: string
}

export interface ButtonContent {
  label: string
  url: string
  style: 'primary' | 'secondary'
}

export interface WorldSliderContent {
  title: string
  limit: number
}

export interface ProjectsContent {
  title: string
  limit: number
}

export interface JournalFeedContent {
  title: string
  limit: number
}

export interface SpacerContent {
  height: number
}

export interface DividerContent {
  style: 'line' | 'dotted'
}

export type BlockContent =
  | HeroContent
  | RichTextContent
  | ImageContent
  | GalleryContent
  | QuoteContent
  | ButtonContent
  | WorldSliderContent
  | ProjectsContent
  | JournalFeedContent
  | ColumnsContent
  | MoodboardEmbedContent
  | TestimonialGridContent
  | StatsRowContent
  | ContactFormContent
  | VideoEmbedContent
  | FAQContent
  | LogoStripContent
  | TeamGridContent
  | SpacerContent
  | DividerContent

export interface PageBlock {
  id: string
  page: string
  type: BlockType
  content: BlockContent
  sort_order: number
  created_at?: string
  updated_at?: string
}

export function defaultContentFor(type: BlockType): BlockContent {
  switch (type) {
    case 'hero':
      return {
        headline: 'New Headline',
        subheadline: '',
        backgroundImage: '',
      }

    case 'richtext':
      return {
        html: '<p>Start writing...</p>',
        json: null,
      }

    case 'image':
      return {
        image: '',
        caption: '',
      }

    case 'gallery':
      return {
        images: [],
      }

    case 'quote':
      return {
        quote: 'Type a quote...',
        author: '',
      }

    case 'button':
      return {
        label: 'Click Here',
        url: '#',
        style: 'primary',
      }

    case 'world_slider':
      return {
        title: 'Our Worlds',
        limit: 6,
      }

    case 'projects':
      return {
        title: 'Projects',
        limit: 6,
      }

    case 'journal_feed':
      return {
        title: 'Journal',
        limit: 3,
      }

    case 'columns':
      return {
        layout: '2-col',
        gap: 32,
        slots: [],
      }

    case 'moodboard_embed':
      return {
        moodboardId: '',
        displayMode: 'cover_link',
        title: '',
        ctaLabel: 'View Moodboard',
      }

    case 'testimonial_grid':
      return {
        title: 'Testimonials',
        columns: 3,
        items: [],
      }

    case 'stats_row':
      return {
        title: 'Stats',
        accentColor: '#d8bc6e',
        items: [],
      }

    case 'contact_form':
      return {
        formType: 'contact',
        heading: 'Get in Touch',
        subheading: '',
        submitLabel: 'Submit',
        successMessage: 'Thank you for your message.',
      }

    case 'video_embed':
      return {
        provider: 'youtube',
        url: '',
        caption: '',
        aspectRatio: '16:9',
        autoplay: false,
      }

    case 'faq':
      return {
        title: 'Frequently Asked Questions',
        items: [],
        openFirst: false,
      }

    case 'logo_strip':
      return {
        title: 'Partners',
        items: [],
        maxHeight: 48,
      }

    case 'team_grid':
      return {
        title: 'Our Team',
        items: [],
        columns: 3,
      }

    case 'spacer':
      return {
        height: 80,
      }

    case 'divider':
      return {
        style: 'line',
      }
  }
}

export const BLOCK_DEFINITIONS: {
  type: BlockType
  label: string
  icon: string
  group: string
}[] = [

  { type: 'hero', label: 'Hero', icon: '◈', group: 'Layout' },
  { type: 'richtext', label: 'Rich Text', icon: '¶', group: 'Content' },
  { type: 'image', label: 'Image', icon: '▣', group: 'Media' },
  { type: 'gallery', label: 'Gallery', icon: '▦', group: 'Media' },
  { type: 'quote', label: 'Quote', icon: '"', group: 'Content' },
  { type: 'button', label: 'Button', icon: '▭', group: 'Content' },

  { type: 'world_slider', label: 'World Slider', icon: '◎', group: 'Dynamic' },
  { type: 'projects', label: 'Projects', icon: '□', group: 'Dynamic' },
  { type: 'journal_feed', label: 'Journal Feed', icon: '≡', group: 'Dynamic' },

  { type: 'columns', label: 'Columns', icon: '▥', group: 'Layout' },
  { type: 'moodboard_embed', label: 'Moodboard', icon: '◫', group: 'Media' },
  { type: 'testimonial_grid', label: 'Testimonials', icon: '❝', group: 'Content' },
  { type: 'stats_row', label: 'Stats Row', icon: '#', group: 'Content' },
  { type: 'contact_form', label: 'Contact Form', icon: '✉', group: 'Forms' },
  { type: 'video_embed', label: 'Video Embed', icon: '▶', group: 'Media' },
  { type: 'faq', label: 'FAQ', icon: '?', group: 'Content' },
  { type: 'logo_strip', label: 'Logo Strip', icon: '◉', group: 'Brand' },
  { type: 'team_grid', label: 'Team Grid', icon: '👥', group: 'Content' },

  { type: 'spacer', label: 'Spacer', icon: '↕', group: 'Layout' },
  { type: 'divider', label: 'Divider', icon: '—', group: 'Layout' },
]

export interface BlockStyleOverrides {
  fontFamily?:    string
  fontSize?:      string   // e.g. "1.2rem", "sm", "lg"
  paddingTop?:    number   // px
  paddingBottom?: number
  background?:    string   // hex / rgba
  borderRadius?:  number
  shadow?:        'none' | 'sm' | 'md' | 'lg'
  textColor?:     string
}

export interface PageBlock {
  id:              string
  page:            string
  type:            BlockType
  content:         BlockContent
  sort_order:      number
  variant?:        string
  animation?:      string
  styleOverrides?: BlockStyleOverrides
  created_at?:     string
  updated_at?:     string
}