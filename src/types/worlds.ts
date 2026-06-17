export type WorldStatus = 'draft' | 'published' | 'archived'

export type SlideType =
  | 'hero'
  | 'narrative'
  | 'philosophy'
  | 'vision'
  | 'timeline'
  | 'gallery'
  | 'projects'
  | 'journal'
  | 'quote'
  | 'cta'

export type TransitionType =
  | 'fade'
  | 'slide'
  | 'push'
  | 'reveal'
  | 'zoom'
  | 'parallax'
  | 'wipe'

export type TextAlignment = 'left' | 'center' | 'right'

export type World = {
  id:           string
  title:        string
  slug:         string
  description:  string | null
  cover_image:  string | null
  hero_video:   string | null
  hero_poster:  string | null
  status:       WorldStatus
  created_at:   string
  updated_at:   string
}

export type WorldSlide = {
  id:               string
  world_id:         string
  title:            string | null
  subtitle:         string | null
  content:          string | null
  slide_type:       string
  background_image: string | null
  background_video: string | null
  overlay_strength: number
  transition:       TransitionType
  duration:         number
  text_alignment:   TextAlignment
  sort_order:       number
  settings:         Record<string, unknown>
  created_at:       string
  updated_at:       string
}