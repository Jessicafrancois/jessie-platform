// ─────────────────────────────────────────────────────────────────────────────
// src/lib/elementFactory.ts
// Creates typed slide elements with correct defaults for every type.
// Used by the Elements panel and toolbar quick-add.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SlideElement, ElementType, TextElement, ShapeElement, MediaElement,
  IconElement, DividerElement, FrameElement, WorldObjectElement,
  baseDefaults, defaultFill, defaultStroke,
} from '@/types/editor'

// ── Canvas dimensions (1280 × 720) ────────────────────────────────────────────
// All default positions are center of a 1280×720 slide minus half the element.

interface ElementSpec {
  x?: number; y?: number; w: number; h: number
}

function centered(w: number, h: number): { x: number; y: number } {
  return { x: Math.round((1280 - w) / 2), y: Math.round((720 - h) / 2) }
}

// ── TEXT elements ─────────────────────────────────────────────────────────────

function makeText(
  type: TextElement['type'],
  overrides: Partial<TextElement>,
  spec: ElementSpec
): TextElement {
  const pos = centered(spec.w, spec.h)
  return {
    id: crypto.randomUUID(),
    type,
    x: spec.x ?? pos.x,
    y: spec.y ?? pos.y,
    w: spec.w,
    h: spec.h,
    ...baseDefaults(type),
    fill: defaultFill('transparent'),
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 48,
    fontWeight: '700',
    textColor: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.2,
    letterSpacing: 0,
    textDecoration: 'none',
    textTransform: 'none',
    italic: false,
    padding: [8, 12, 8, 12],
    text: 'Your text here',
    ...overrides,
  } as TextElement
}

// ── SHAPE elements ────────────────────────────────────────────────────────────

function makeShape(
  type: ShapeElement['type'],
  overrides: Partial<ShapeElement>,
  spec: ElementSpec
): ShapeElement {
  const pos = centered(spec.w, spec.h)
  return {
    id: crypto.randomUUID(),
    type,
    x: spec.x ?? pos.x,
    y: spec.y ?? pos.y,
    w: spec.w,
    h: spec.h,
    ...baseDefaults(type),
    fill: defaultFill('rgba(255,255,255,0.08)'),
    borderRadius: 0,
    ...overrides,
  } as ShapeElement
}

// ── The factory map ───────────────────────────────────────────────────────────

type FactoryResult = SlideElement | null

export function createElement(type: ElementType, at?: { x: number; y: number }): FactoryResult {
  const offset = (w: number, h: number) => at
    ? { x: Math.round(at.x - w / 2), y: Math.round(at.y - h / 2) }
    : {}

  switch (type) {

    // ── TEXT ──────────────────────────────────────────────────────────────────

    case 'heading':
      return makeText('heading', {
        text: 'Heading',
        fontSize: 72,
        fontWeight: '700',
        textColor: '#ffffff',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        lineHeight: 1.05,
        letterSpacing: -2,
        h: 100,
      }, { w: 900, h: 100, ...offset(900, 100) })

    case 'subheading':
      return makeText('subheading', {
        text: 'Subheading',
        fontSize: 36,
        fontWeight: '300',
        textColor: 'rgba(255,255,255,0.7)',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        lineHeight: 1.2,
        letterSpacing: 0,
      }, { w: 700, h: 60, ...offset(700, 60) })

    case 'body':
      return makeText('body', {
        text: 'Your body text goes here. Write something meaningful about your world.',
        fontSize: 18,
        fontWeight: '400',
        textColor: 'rgba(255,255,255,0.8)',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'left',
        lineHeight: 1.7,
      }, { w: 560, h: 140, ...offset(560, 140) })

    case 'quote':
      return makeText('quote', {
        text: '"A great quote that captures the essence of your world."',
        fontSize: 28,
        fontWeight: '300',
        textColor: '#d8bc6e',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        textAlign: 'center',
        lineHeight: 1.5,
        italic: true,
      }, { w: 700, h: 120, ...offset(700, 120) })

    case 'label':
      return makeText('label', {
        text: 'LABEL',
        fontSize: 11,
        fontWeight: '600',
        textColor: '#d8bc6e',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'center',
        letterSpacing: 3,
        textTransform: 'uppercase',
        fill: defaultFill('rgba(216,188,110,0.12)'),
        borderRadius: 999,
        padding: [6, 14, 6, 14],
      }, { w: 140, h: 32, ...offset(140, 32) })

    case 'callout': {
      const el = makeText('callout', {
        text: '✦ Important note or callout text goes here.',
        fontSize: 15,
        fontWeight: '400',
        textColor: 'rgba(255,255,255,0.9)',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'left',
        fill: defaultFill('rgba(216,188,110,0.07)'),
        borderRadius: 10,
        padding: [16, 20, 16, 20],
      }, { w: 500, h: 80, ...offset(500, 80) })
      el.stroke = { color: 'rgba(216,188,110,0.3)', width: 1, style: 'solid', position: 'inside' }
      return el
    }

    case 'code':
      return makeText('code', {
        text: '// Your code here\nconst world = new AstraliaWorld()\nworld.initialize()',
        fontSize: 14,
        fontWeight: '400',
        textColor: '#50c878',
        fontFamily: "'Courier New', Courier, monospace",
        textAlign: 'left',
        fill: defaultFill('#0a0a0a'),
        borderRadius: 8,
        padding: [16, 20, 16, 20],
        lineHeight: 1.7,
      }, { w: 520, h: 160, ...offset(520, 160) })

    // ── SHAPES ────────────────────────────────────────────────────────────────

    case 'rect':
      return makeShape('rect', {
        fill: defaultFill('rgba(255,255,255,0.06)'),
        stroke: { color: 'rgba(255,255,255,0.12)', width: 1, style: 'solid', position: 'inside' },
        borderRadius: 12,
      }, { w: 300, h: 180, ...offset(300, 180) })

    case 'ellipse':
      return makeShape('ellipse', {
        fill: defaultFill('rgba(216,188,110,0.15)'),
        stroke: { color: 'rgba(216,188,110,0.4)', width: 1, style: 'solid', position: 'inside' },
        borderRadius: 999,
      }, { w: 200, h: 200, ...offset(200, 200) })

    case 'line':
      return makeShape('line', {
        fill: defaultFill('transparent'),
        stroke: { color: 'rgba(255,255,255,0.25)', width: 1, style: 'solid', position: 'center' },
        h: 2,
      }, { w: 400, h: 2, ...offset(400, 2) })

    case 'triangle': {
      const s = makeShape('triangle', {
        fill: defaultFill('rgba(155,109,255,0.2)'),
        stroke: { color: 'rgba(155,109,255,0.5)', width: 1, style: 'solid', position: 'inside' },
      }, { w: 160, h: 140, ...offset(160, 140) })
      return s
    }

    // ── MEDIA ─────────────────────────────────────────────────────────────────

    case 'image': {
      const pos = centered(500, 320)
      return {
        id: crypto.randomUUID(),
        type: 'image',
        x: at?.x ? at.x - 250 : pos.x,
        y: at?.y ? at.y - 160 : pos.y,
        w: 500,
        h: 320,
        ...baseDefaults('image'),
        fill: defaultFill('#111118'),
        borderRadius: 12,
        src: '',
        alt: '',
        objectFit: 'cover',
        objectPosition: 'center center',
      } as MediaElement
    }

    case 'video': {
      const pos = centered(640, 360)
      return {
        id: crypto.randomUUID(),
        type: 'video',
        x: at?.x ? at.x - 320 : pos.x,
        y: at?.y ? at.y - 180 : pos.y,
        w: 640,
        h: 360,
        ...baseDefaults('video'),
        fill: defaultFill('#000'),
        borderRadius: 8,
        src: '',
        alt: '',
        objectFit: 'cover',
        objectPosition: 'center center',
        autoplay: false,
        muted: true,
        loop: false,
        controls: true,
      } as MediaElement
    }

    // ── ICON ──────────────────────────────────────────────────────────────────

    case 'icon': {
      const pos = centered(80, 80)
      return {
        id: crypto.randomUUID(),
        type: 'icon',
        x: at?.x ? at.x - 40 : pos.x,
        y: at?.y ? at.y - 40 : pos.y,
        w: 80,
        h: 80,
        ...baseDefaults('icon'),
        fill: defaultFill('transparent'),
        icon: '✦',
        iconColor: '#d8bc6e',
        iconSize: 48,
      } as IconElement
    }

    // ── DIVIDER ───────────────────────────────────────────────────────────────

    case 'divider': {
      const pos = centered(600, 2)
      return {
        id: crypto.randomUUID(),
        type: 'divider',
        x: at?.x ? at.x - 300 : pos.x,
        y: at?.y ? at.y - 1 : pos.y,
        w: 600,
        h: 2,
        ...baseDefaults('divider'),
        fill: defaultFill('transparent'),
        stroke: { color: 'rgba(255,255,255,0.15)', width: 1, style: 'solid', position: 'center' },
        orientation: 'horizontal',
        style: 'solid',
      } as DividerElement
    }

    // ── FRAMES ────────────────────────────────────────────────────────────────

    case 'card': {
      const pos = centered(320, 240)
      return {
        id: crypto.randomUUID(),
        type: 'card',
        x: at?.x ? at.x - 160 : pos.x,
        y: at?.y ? at.y - 120 : pos.y,
        w: 320,
        h: 240,
        ...baseDefaults('card'),
        fill: defaultFill('rgba(255,255,255,0.04)'),
        stroke: { color: 'rgba(255,255,255,0.08)', width: 1, style: 'solid', position: 'inside' },
        borderRadius: 16,
        children: [],
        layout: 'flex-col',
        gap: 12,
        padding: [20, 20, 20, 20],
        backdropBlur: 10,
      } as FrameElement
    }

    case 'frame': {
      const pos = centered(800, 500)
      return {
        id: crypto.randomUUID(),
        type: 'frame',
        x: at?.x ? at.x - 400 : pos.x,
        y: at?.y ? at.y - 250 : pos.y,
        w: 800,
        h: 500,
        ...baseDefaults('frame'),
        fill: defaultFill('transparent'),
        stroke: { color: 'rgba(255,255,255,0.06)', width: 1, style: 'dashed', position: 'inside' },
        borderRadius: 0,
        children: [],
        layout: 'free',
        gap: 0,
        padding: [0, 0, 0, 0],
      } as FrameElement
    }

    case 'bento': {
      const pos = centered(680, 400)
      return {
        id: crypto.randomUUID(),
        type: 'bento',
        x: at?.x ? at.x - 340 : pos.x,
        y: at?.y ? at.y - 200 : pos.y,
        w: 680,
        h: 400,
        ...baseDefaults('bento'),
        fill: defaultFill('transparent'),
        stroke: defaultStroke(),
        borderRadius: 0,
        children: [],
        layout: 'grid',
        gap: 10,
        padding: [0, 0, 0, 0],
      } as FrameElement
    }

    // ── WORLD OBJECTS ─────────────────────────────────────────────────────────

    case 'character':
    case 'location':
    case 'artifact':
    case 'lore':
    case 'organization':
    case 'event': {
      const pos = centered(200, 240)
      const meta: Record<string, { icon: string; color: string; label: string }> = {
        character:    { icon: '👤', color: 'rgba(216,188,110,0.1)',  label: 'Character' },
        location:     { icon: '📍', color: 'rgba(100,180,255,0.08)', label: 'Location' },
        artifact:     { icon: '🏺', color: 'rgba(155,109,255,0.08)', label: 'Artifact' },
        lore:         { icon: '📜', color: 'rgba(80,200,120,0.08)',  label: 'Lore Entry' },
        organization: { icon: '🏛', color: 'rgba(255,130,80,0.08)',  label: 'Organization' },
        event:        { icon: '⚡', color: 'rgba(255,220,80,0.08)',  label: 'Event' },
      }
      const m = meta[type]
      return {
        id: crypto.randomUUID(),
        type,
        x: at?.x ? at.x - 100 : pos.x,
        y: at?.y ? at.y - 120 : pos.y,
        w: 200,
        h: 240,
        ...baseDefaults(type as ElementType),
        fill: defaultFill(m.color),
        stroke: { color: 'rgba(255,255,255,0.08)', width: 1, style: 'solid', position: 'inside' },
        borderRadius: 16,
        objectId: undefined,
        label: m.label,
        sublabel: m.icon,
        imageUrl: '',
        tags: [],
        color: m.color,
      } as WorldObjectElement
    }

    default:
      return null
  }
}

// ── Element groups for the Elements panel ─────────────────────────────────────

export const ELEMENT_GROUPS: Array<{
  label: string
  items: Array<{ type: ElementType; label: string; icon: string }>
}> = [
  {
    label: 'Text',
    items: [
      { type: 'heading',    label: 'Heading',    icon: 'H' },
      { type: 'subheading', label: 'Subhead',    icon: 'h' },
      { type: 'body',       label: 'Body',       icon: '¶' },
      { type: 'quote',      label: 'Quote',      icon: '"' },
      { type: 'label',      label: 'Label',      icon: '—' },
      { type: 'callout',    label: 'Callout',    icon: '✦' },
      { type: 'code',       label: 'Code',       icon: '</>' },
    ],
  },
  {
    label: 'Shapes',
    items: [
      { type: 'rect',     label: 'Rectangle', icon: '▭' },
      { type: 'ellipse',  label: 'Ellipse',   icon: '◯' },
      { type: 'line',     label: 'Line',      icon: '─' },
      { type: 'triangle', label: 'Triangle',  icon: '△' },
      { type: 'divider',  label: 'Divider',   icon: '÷' },
    ],
  },
  {
    label: 'Media',
    items: [
      { type: 'image', label: 'Image', icon: '🖼' },
      { type: 'video', label: 'Video', icon: '▶' },
      { type: 'icon',  label: 'Icon',  icon: '★' },
    ],
  },
  {
    label: 'Layout',
    items: [
      { type: 'card',  label: 'Card',  icon: '▭' },
      { type: 'frame', label: 'Frame', icon: '⊞' },
      { type: 'bento', label: 'Bento', icon: '⊟' },
    ],
  },
  {
    label: 'World Objects',
    items: [
      { type: 'character',    label: 'Character',    icon: '👤' },
      { type: 'location',     label: 'Location',     icon: '📍' },
      { type: 'artifact',     label: 'Artifact',     icon: '🏺' },
      { type: 'lore',         label: 'Lore',         icon: '📜' },
      { type: 'organization', label: 'Org',          icon: '🏛' },
      { type: 'event',        label: 'Event',        icon: '⚡' },
    ],
  },
]