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

export const essays: Essay[] = [
  {
    slug: 'internet-becoming-emotional',

    title: 'The internet is becoming emotional.',

    intro:
      'The next generation of experiences will compete through atmosphere, immersion, memory, and emotional gravity.',

    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop',

    blocks: [
      {
        type: 'paragraph',
        content: 'Static websites are disappearing.',
      },

      {
        type: 'paragraph',
        content:
          'The future belongs to immersive narrative systems.',
      },

      {
        type: 'quote',
        content: 'Atmosphere is becoming infrastructure.',
      },

      {
        type: 'image',
        image:
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1800&auto=format&fit=crop',
      },

      {
        type: 'paragraph',
        content:
          'The strongest experiences emotionally linger.',
      },
    ],
  },

  {
    slug: 'founders-are-becoming-world-builders',

    title: 'Founders are becoming world builders.',

    intro:
      'The strongest modern brands no longer feel like companies. They feel like narrative ecosystems.',

    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1800&auto=format&fit=crop',

    blocks: [
      {
        type: 'paragraph',
        content:
          'The internet is shifting from information to identity.',
      },

      {
        type: 'quote',
        content:
          'People no longer follow products. They enter worlds.',
      },

      {
        type: 'paragraph',
        content:
          'Narrative cohesion is becoming competitive advantage.',
      },
    ],
  },

  {
    slug: 'atmosphere-is-a-product-layer',

    title: 'Atmosphere is a product layer.',

    intro:
      'Interfaces are becoming emotional environments instead of static utility surfaces.',

    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop',

    blocks: [
      {
        type: 'paragraph',
        content:
          'Digital products are beginning to compete emotionally.',
      },

      {
        type: 'image',
        image:
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1800&auto=format&fit=crop',
      },

      {
        type: 'quote',
        content:
          'The future of UX is cinematic.',
      },
    ],
  },

  {
    slug: 'the-rise-of-immersive-journaling',

    title: 'The rise of immersive journaling.',

    intro:
      'Writing platforms are evolving from blogs into experiential publishing systems.',

    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1800&auto=format&fit=crop',

    blocks: [
      {
        type: 'paragraph',
        content:
          'Modern audiences remember emotional pacing more than information density.',
      },

      {
        type: 'quote',
        content:
          'Reading is becoming environmental.',
      },

      {
        type: 'paragraph',
        content:
          'Editorial systems are merging with cinematic design.',
      },
    ],
  },

  {
    slug: 'creative-direction-is-becoming-infrastructure',

    title: 'Creative direction is becoming infrastructure.',

    intro:
      'The next generation of platforms will be differentiated by emotional cohesion, not features.',

    image:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1800&auto=format&fit=crop',

    blocks: [
      {
        type: 'paragraph',
        content:
          'Aesthetic systems are becoming core architecture.',
      },

      {
        type: 'image',
        image:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1800&auto=format&fit=crop',
      },

      {
        type: 'quote',
        content:
          'The strongest interfaces feel authored.',
      },
    ],
  },
]