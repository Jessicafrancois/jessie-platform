export const SECTION_TYPES = {
  hero: {
    label: 'Hero',
    icon: '🎯',
    color: 't-hero',
    desc: 'Large hero with title & media',
  },

  text: {
    label: 'Text',
    icon: '📝',
    color: 't-text',
    desc: 'Rich text with optional heading',
  },

  gallery: {
    label: 'Gallery',
    icon: '🖼️',
    color: 't-gallery',
    desc: 'Image gallery with layouts',
  },

  quote: {
    label: 'Pull Quote',
    icon: '💬',
    color: 't-quote',
    desc: 'Emphasized quote with author',
  },

  metrics: {
    label: 'Metrics',
    icon: '📊',
    color: 't-metrics',
    desc: 'Key numbers & results',
  },
} as const