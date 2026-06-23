// ─────────────────────────────────────────────────────────────────────────────
// src/types/editor.ts
// All types for the World Slide Editor.
// ─────────────────────────────────────────────────────────────────────────────

// ── Element types ─────────────────────────────────────────────────────────────

export type ElementType =
  // Text
  | 'heading' | 'subheading' | 'body' | 'quote' | 'label' | 'callout' | 'code'
  // Shapes
  | 'rect' | 'ellipse' | 'line' | 'triangle'
  // Media
  | 'image' | 'video' | 'gif' | 'icon'
  // Layout
  | 'card' | 'bento' | 'divider' | 'frame'
  // World objects
  | 'character' | 'location' | 'artifact' | 'lore' | 'organization' | 'event'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken'
  | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light'
  | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation'

export type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'glow' | 'inner'
export type AnimationType =
  | 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'zoom-in' | 'zoom-out' | 'blur-in' | 'rotate-in' | 'typewriter'
  | 'slide-left' | 'slide-right' | 'bounce' | 'flip'

export type AnimationTrigger = 'load' | 'click' | 'hover' | 'scroll'
export type EasingType = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring'

// ── Animation ─────────────────────────────────────────────────────────────────

export interface ElementAnimation {
  id: string
  type: AnimationType
  trigger: AnimationTrigger
  delay: number       // ms
  duration: number    // ms
  easing: EasingType
  loop: boolean
  direction?: 'normal' | 'reverse' | 'alternate'
}

// ── Fill system ───────────────────────────────────────────────────────────────

export type FillType = 'solid' | 'linear-gradient' | 'radial-gradient' | 'none'

export interface GradientStop {
  color: string
  position: number  // 0–100
}

export interface Fill {
  type: FillType
  color: string                   // for solid
  gradient?: GradientStop[]       // for gradients
  angle?: number                  // for linear gradient (0–360)
  opacity: number                 // 0–100 applied to this fill
}

// ── Stroke ────────────────────────────────────────────────────────────────────

export interface Stroke {
  color: string
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  position: 'inside' | 'outside' | 'center'
}

// ── Shadow ────────────────────────────────────────────────────────────────────

export interface Shadow {
  preset: ShadowPreset
  // Custom overrides
  x?: number
  y?: number
  blur?: number
  spread?: number
  color?: string
  inset?: boolean
}

// ── Base element ──────────────────────────────────────────────────────────────

export interface BaseElement {
  id: string
  type: ElementType

  // Position & size (pixels on the 1280×720 canvas)
  x: number
  y: number
  w: number
  h: number

  // Transform
  rotation: number        // degrees
  scaleX: number
  scaleY: number
  flipX: boolean
  flipY: boolean

  // Layer
  zIndex: number
  opacity: number         // 0–100
  locked: boolean
  hidden: boolean
  name: string            // display name in layers panel

  // Fill & stroke
  fill: Fill
  stroke: Stroke

  // Effects
  shadow: Shadow
  blendMode: BlendMode
  borderRadius: number    // px (for shapes)

  // Animations
  animations: ElementAnimation[]
}

// ── Text element ──────────────────────────────────────────────────────────────

export interface TextElement extends BaseElement {
  type: 'heading' | 'subheading' | 'body' | 'quote' | 'label' | 'callout' | 'code'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: FontWeight
  textColor: string
  textAlign: TextAlign
  lineHeight: number
  letterSpacing: number
  textDecoration: 'none' | 'underline' | 'line-through'
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  italic: boolean
  padding: [number, number, number, number]  // top right bottom left
}

// ── Shape element ─────────────────────────────────────────────────────────────

export interface ShapeElement extends BaseElement {
  type: 'rect' | 'ellipse' | 'line' | 'triangle'
  cornerRadii?: [number, number, number, number]  // per-corner override
}

// ── Media element ─────────────────────────────────────────────────────────────

export interface MediaElement extends BaseElement {
  type: 'image' | 'video' | 'gif'
  src: string
  alt: string
  objectFit: 'cover' | 'contain' | 'fill' | 'none'
  objectPosition: string   // e.g. "center center"
  filters?: {
    brightness?: number   // 0–200
    contrast?: number
    saturation?: number
    blur?: number
    grayscale?: number
    sepia?: number
  }
  // Video-specific
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}

// ── Icon element ──────────────────────────────────────────────────────────────

export interface IconElement extends BaseElement {
  type: 'icon'
  icon: string       // unicode character or emoji
  iconColor: string
  iconSize: number
}

// ── Divider element ───────────────────────────────────────────────────────────

export interface DividerElement extends BaseElement {
  type: 'divider'
  orientation: 'horizontal' | 'vertical'
  style: 'solid' | 'dashed' | 'dotted' | 'double'
}

// ── Frame / container element ─────────────────────────────────────────────────

export interface FrameElement extends BaseElement {
  type: 'card' | 'bento' | 'frame'
  children: string[]    // element IDs nested inside
  layout: 'free' | 'grid' | 'flex-row' | 'flex-col'
  gap: number
  padding: [number, number, number, number]
  backdropBlur?: number
}

// ── World object elements ─────────────────────────────────────────────────────

export interface WorldObjectElement extends BaseElement {
  type: 'character' | 'location' | 'artifact' | 'lore' | 'organization' | 'event'
  objectId?: string        // references a world object from the DB
  label: string
  sublabel: string
  imageUrl: string
  tags: string[]
  color: string            // accent color for the card
}

// ── Union type ────────────────────────────────────────────────────────────────

export type SlideElement =
  | TextElement
  | ShapeElement
  | MediaElement
  | IconElement
  | DividerElement
  | FrameElement
  | WorldObjectElement

// ── Slide background ──────────────────────────────────────────────────────────

export type BackgroundType = 'solid' | 'linear-gradient' | 'radial-gradient' | 'image' | 'video' | 'mesh'

export interface SlideBackground {
  type: BackgroundType
  color: string
  gradient?: GradientStop[]
  gradientAngle?: number
  imageUrl?: string
  videoUrl?: string
  blur?: number           // background blur in px
  overlay?: string        // color overlay e.g. "rgba(0,0,0,0.4)"
  overlayBlend?: BlendMode
  noise?: number          // 0–100 noise texture opacity
}

// ── Slide transition ──────────────────────────────────────────────────────────

export type TransitionType =
  | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
  | 'zoom-in' | 'zoom-out' | 'flip-horizontal' | 'flip-vertical'
  | 'dissolve' | 'morph' | 'portal' | 'wipe' | 'none'

export interface SlideTransition {
  type: TransitionType
  duration: number     // ms
  easing: EasingType
}

// ── Ambient effects ───────────────────────────────────────────────────────────

export type AmbientEffect =
  | 'particles' | 'stars' | 'fog' | 'rain' | 'snow'
  | 'fireflies' | 'clouds' | 'light-rays' | 'moving-gradient' | 'none'

export interface SlideAmbient {
  effect: AmbientEffect
  intensity: number    // 0–100
  color?: string
  speed?: number       // 0–100
}

// ── Slide ─────────────────────────────────────────────────────────────────────

export interface Slide {
  id: string
  worldId: string
  title: string
  notes: string           // speaker notes
  sortOrder: number

  // Canvas config
  width: number           // default 1280
  height: number          // default 720

  background: SlideBackground
  transition: SlideTransition
  ambient: SlideAmbient

  elements: SlideElement[]

  // Meta
  tags: string[]
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

// ── Editor state ──────────────────────────────────────────────────────────────

export type EditorTool =
  | 'select' | 'text' | 'rect' | 'ellipse' | 'line'
  | 'pen' | 'image' | 'pan' | 'zoom'

export type LeftPanelTab = 'slides' | 'elements' | 'layers'
export type RightPanelTab = 'properties' | 'slide' | 'animate' | 'theme'

export interface EditorViewport {
  zoom: number          // 0.1 – 4
  offsetX: number       // pan offset
  offsetY: number
}

export interface EditorSelection {
  ids: string[]
}

export interface HistoryEntry {
  slides: Slide[]
  label: string
}

export interface EditorState {
  slides: Slide[]
  activeSlideIndex: number
  selection: EditorSelection
  tool: EditorTool
  viewport: EditorViewport
  leftPanel: LeftPanelTab
  rightPanel: RightPanelTab
  showGrid: boolean
  showRulers: boolean
  snapToGrid: boolean
  gridSize: number
  history: HistoryEntry[]
  historyIndex: number
  isDirty: boolean
  isSaving: boolean
}

// ── Element defaults factory ──────────────────────────────────────────────────

export function defaultFill(color = 'rgba(255,255,255,0.08)'): Fill {
  return { type: 'solid', color, opacity: 100 }
}

export function defaultStroke(): Stroke {
  return { color: '#ffffff', width: 0, style: 'solid', position: 'outside' }
}

export function defaultShadow(): Shadow {
  return { preset: 'none' }
}

export function defaultAnimation(): ElementAnimation {
  return {
    id: crypto.randomUUID(),
    type: 'fade-in',
    trigger: 'load',
    delay: 0,
    duration: 600,
    easing: 'ease-out',
    loop: false,
  }
}

export function baseDefaults(type: ElementType): Omit<BaseElement, 'id' | 'type' | 'x' | 'y' | 'w' | 'h'> {
  return {
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: false,
    flipY: false,
    zIndex: 1,
    opacity: 100,
    locked: false,
    hidden: false,
    name: type,
    fill: defaultFill('transparent'),
    stroke: defaultStroke(),
    shadow: defaultShadow(),
    blendMode: 'normal',
    borderRadius: 0,
    animations: [],
  }
}

// ── Slide defaults ────────────────────────────────────────────────────────────

export function createSlide(worldId: string, sortOrder: number, title = 'Untitled Slide'): Slide {
  return {
    id: crypto.randomUUID(),
    worldId,
    title,
    notes: '',
    sortOrder,
    width: 1280,
    height: 720,
    background: {
      type: 'linear-gradient',
      color: '#0e0e1a',
      gradient: [
        { color: '#0a0a14', position: 0 },
        { color: '#12122a', position: 50 },
        { color: '#1a0e2a', position: 100 },
      ],
      gradientAngle: 135,
    },
    transition: { type: 'fade', duration: 600, easing: 'ease-out' },
    ambient: { effect: 'none', intensity: 50 },
    elements: [],
    tags: [],
    isHidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}