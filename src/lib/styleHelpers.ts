// ─────────────────────────────────────────────────────────────────────────────
// src/lib/styleHelpers.ts
// Pure functions that turn element data into CSS style objects.
// Used by SlideCanvas, PreviewCanvas, and public renderers.
// ─────────────────────────────────────────────────────────────────────────────

import {
  SlideElement, TextElement, Fill, Stroke, Shadow, SlideBackground,
} from '@/types/editor'

// ── Fill → CSS background ─────────────────────────────────────────────────────

export function fillToCSS(fill: Fill): string {
  if (!fill || fill.type === 'none') return 'transparent'
  if (fill.type === 'solid') return fill.color
  if (fill.type === 'linear-gradient' && fill.gradient?.length) {
    const stops = fill.gradient.map(s => `${s.color} ${s.position}%`).join(', ')
    return `linear-gradient(${fill.angle ?? 135}deg, ${stops})`
  }
  if (fill.type === 'radial-gradient' && fill.gradient?.length) {
    const stops = fill.gradient.map(s => `${s.color} ${s.position}%`).join(', ')
    return `radial-gradient(circle, ${stops})`
  }
  return fill.color
}

// ── Stroke → CSS border ────────────────────────────────────────────────────────

export function strokeToCSS(stroke: Stroke): Partial<React.CSSProperties> {
  if (!stroke || stroke.width === 0) return {}
  return {
    border: `${stroke.width}px ${stroke.style} ${stroke.color}`,
    boxSizing: 'border-box',
  }
}

// ── Shadow → CSS box-shadow ───────────────────────────────────────────────────

export function shadowToCSS(shadow: Shadow, fillColor?: string): string {
  if (!shadow || shadow.preset === 'none') return 'none'

  // Custom shadow overrides
  if (shadow.x !== undefined) {
    const inset = shadow.inset ? 'inset ' : ''
    return `${inset}${shadow.x}px ${shadow.y ?? 0}px ${shadow.blur ?? 8}px ${shadow.spread ?? 0}px ${shadow.color ?? 'rgba(0,0,0,0.4)'}`
  }

  const accent = fillColor ?? 'rgba(216,188,110,0.5)'
  switch (shadow.preset) {
    case 'sm':    return '0 2px 8px rgba(0,0,0,0.3)'
    case 'md':    return '0 8px 24px rgba(0,0,0,0.45)'
    case 'lg':    return '0 16px 48px rgba(0,0,0,0.55)'
    case 'glow':  return `0 0 28px ${accent}88, 0 0 60px ${accent}33`
    case 'inner': return 'inset 0 2px 12px rgba(0,0,0,0.4)'
    default:      return 'none'
  }
}

// ── Slide background → CSS ────────────────────────────────────────────────────

export function slideBgToCSS(bg: SlideBackground): React.CSSProperties {
  const styles: React.CSSProperties = {}

  switch (bg.type) {
    case 'solid':
      styles.background = bg.color
      break

    case 'linear-gradient':
      if (bg.gradient?.length) {
        const stops = bg.gradient.map(s => `${s.color} ${s.position}%`).join(', ')
        styles.background = `linear-gradient(${bg.gradientAngle ?? 135}deg, ${stops})`
      } else {
        styles.background = bg.color
      }
      break

    case 'radial-gradient':
      if (bg.gradient?.length) {
        const stops = bg.gradient.map(s => `${s.color} ${s.position}%`).join(', ')
        styles.background = `radial-gradient(circle, ${stops})`
      }
      break

    case 'image':
    case 'video':
      styles.background = bg.color  // fallback
      break

    case 'mesh':
      // Mesh gradient using multiple radial gradients
      styles.background = `
        radial-gradient(at 20% 30%, rgba(155,109,255,0.3) 0px, transparent 50%),
        radial-gradient(at 80% 20%, rgba(216,188,110,0.25) 0px, transparent 50%),
        radial-gradient(at 60% 80%, rgba(100,180,255,0.2) 0px, transparent 50%),
        ${bg.color || '#0e0e1a'}
      `
      break

    default:
      styles.background = bg.color
  }

  return styles
}

// ── Element container styles ──────────────────────────────────────────────────

export function elementContainerStyles(el: SlideElement): React.CSSProperties {
  return {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.w,
    height: el.h,
    opacity: (el.opacity ?? 100) / 100,
    transform: buildTransform(el),
    zIndex: el.zIndex ?? 1,
    mixBlendMode: el.blendMode as React.CSSProperties['mixBlendMode'],
    pointerEvents: el.locked ? 'none' : undefined,
    display: el.hidden ? 'none' : undefined,
    cursor: el.locked ? 'not-allowed' : 'move',
  }
}

function buildTransform(el: SlideElement): string {
  const parts: string[] = []
  if (el.rotation) parts.push(`rotate(${el.rotation}deg)`)
  if (el.scaleX !== 1 || el.scaleY !== 1) parts.push(`scale(${el.scaleX ?? 1}, ${el.scaleY ?? 1})`)
  if (el.flipX) parts.push('scaleX(-1)')
  if (el.flipY) parts.push('scaleY(-1)')
  return parts.length ? parts.join(' ') : 'none'
}

// ── Element inner styles ──────────────────────────────────────────────────────

export function elementInnerStyles(el: SlideElement): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: fillToCSS(el.fill),
    boxShadow: shadowToCSS(el.shadow, el.fill?.color),
    borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  // Stroke
  if (el.stroke && el.stroke.width > 0) {
    base.border = `${el.stroke.width}px ${el.stroke.style} ${el.stroke.color}`
  }

  return base
}

// ── Text element styles ────────────────────────────────────────────────────────

export function textElementStyles(el: TextElement): React.CSSProperties {
  return {
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight as React.CSSProperties['fontWeight'],
    fontStyle: el.italic ? 'italic' : 'normal',
    color: el.textColor,
    textAlign: el.textAlign,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
    textDecoration: el.textDecoration !== 'none' ? el.textDecoration : undefined,
    textTransform: el.textTransform !== 'none' ? el.textTransform as React.CSSProperties['textTransform'] : undefined,
    padding: el.padding ? `${el.padding[0]}px ${el.padding[1]}px ${el.padding[2]}px ${el.padding[3]}px` : '8px 12px',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
    whiteSpace: 'pre-wrap',
    outline: 'none',
  }
}

// ── Slide thumbnail preview CSS ───────────────────────────────────────────────
// Used in the slide navigator — returns inline style for thumbnail bg

export function slideThumbnailBg(bg: SlideBackground): React.CSSProperties {
  return slideBgToCSS(bg)
}

// ── CSS animation keyframes (injected once into <head>) ───────────────────────

export const ANIMATION_KEYFRAMES = `
@keyframes we-fade-in      { from { opacity: 0 } to { opacity: 1 } }
@keyframes we-fade-up      { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
@keyframes we-fade-down    { from { opacity: 0; transform: translateY(-24px) } to { opacity: 1; transform: translateY(0) } }
@keyframes we-fade-left    { from { opacity: 0; transform: translateX(24px) } to { opacity: 1; transform: translateX(0) } }
@keyframes we-fade-right   { from { opacity: 0; transform: translateX(-24px) } to { opacity: 1; transform: translateX(0) } }
@keyframes we-zoom-in      { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
@keyframes we-zoom-out     { from { opacity: 0; transform: scale(1.2) } to { opacity: 1; transform: scale(1) } }
@keyframes we-blur-in      { from { opacity: 0; filter: blur(12px) } to { opacity: 1; filter: blur(0) } }
@keyframes we-rotate-in    { from { opacity: 0; transform: rotate(-12deg) scale(0.9) } to { opacity: 1; transform: rotate(0) scale(1) } }
@keyframes we-slide-left   { from { opacity: 0; transform: translateX(-48px) } to { opacity: 1; transform: translateX(0) } }
@keyframes we-slide-right  { from { opacity: 0; transform: translateX(48px) } to { opacity: 1; transform: translateX(0) } }
@keyframes we-bounce       { 0%,100% { transform: translateY(0) } 40% { transform: translateY(-20px) } 60% { transform: translateY(-10px) } }
@keyframes we-flip         { from { opacity: 0; transform: rotateY(90deg) } to { opacity: 1; transform: rotateY(0) } }
`

export function getAnimationStyle(anim: { type: string; delay: number; duration: number; easing: string }): React.CSSProperties {
  const keyframeMap: Record<string, string> = {
    'fade-in':    'we-fade-in',
    'fade-up':    'we-fade-up',
    'fade-down':  'we-fade-down',
    'fade-left':  'we-fade-left',
    'fade-right': 'we-fade-right',
    'zoom-in':    'we-zoom-in',
    'zoom-out':   'we-zoom-out',
    'blur-in':    'we-blur-in',
    'rotate-in':  'we-rotate-in',
    'slide-left': 'we-slide-left',
    'slide-right':'we-slide-right',
    'bounce':     'we-bounce',
    'flip':       'we-flip',
  }
  const kf = keyframeMap[anim.type] ?? 'we-fade-in'
  return {
    animation: `${kf} ${anim.duration}ms ${anim.easing} ${anim.delay}ms both`,
  }
}