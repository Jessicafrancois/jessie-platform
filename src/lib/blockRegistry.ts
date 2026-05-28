export const blockRegistry = [

  {
    type: 'paragraph',
    label: 'Paragraph',

    create: () => ({
      type: 'paragraph',
      content: '',
    }),
  },

  {
    type: 'quote',
    label: 'Quote',

    create: () => ({
      type: 'quote',
      content: '',
    }),
  },

  {
    type: 'ambient-quote',
    label: 'Ambient Quote',

    create: () => ({
      type: 'ambient-quote',
      content: '',
    }),
  },

  {
    type: 'image',
    label: 'Image',

    create: () => ({
      type: 'image',
      content: '',
    }),
  },

  {
    type: 'fullscreen-image',
    label: 'Fullscreen Image',

    create: () => ({
      type: 'fullscreen-image',
      content: '',
    }),
  },

  {
    type: 'split',
    label: 'Split Layout',

    create: () => ({
      type: 'split',
      content: '',
      image: '',
    }),
  },

  {
    type: 'gallery',
    label: 'Gallery',

    create: () => ({
      type: 'gallery',
      images: [],
    }),
  },

  {
    type: 'timeline',
    label: 'Timeline',

    create: () => ({
      type: 'timeline',
      items: [],
    }),
  },

]