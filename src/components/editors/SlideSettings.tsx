'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/editor/SlideSettings.tsx
// Right panel: Properties, Slide BG, Animate, Layers.
// Adapts to the selected element type — shows contextual fields.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  ChevronUp, ChevronDown, ChevronsUp, ChevronsDown,
  Eye, EyeOff, Lock, Unlock, Trash2, Plus,
} from 'lucide-react'
import type { EditorController, AlignAxis } from '../../lib/useEditorState'
import type {
  SlideElement, TextElement, Fill, GradientStop,
  AnimationType, AnimationTrigger, EasingType,
} from '@/types/editor'
import { defaultAnimation } from '@/types/editor'
import './settings.css'

interface Props { controller: EditorController }

// ── Constants ─────────────────────────────────────────────────────────────────

const FONT_FAMILIES = [
  { label: 'Inter',              value: 'Inter, system-ui, sans-serif' },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', Georgia, serif" },
  { label: 'Playfair Display',   value: "'Playfair Display', Georgia, serif" },
  { label: 'Georgia',            value: 'Georgia, serif' },
  { label: 'Courier New',        value: "'Courier New', Courier, monospace" },
]

const FONT_WEIGHTS = [
  { label: 'Thin',     value: '100' }, { label: 'Light',    value: '300' },
  { label: 'Regular',  value: '400' }, { label: 'Medium',   value: '500' },
  { label: 'Semibold', value: '600' }, { label: 'Bold',     value: '700' },
  { label: 'Black',    value: '900' },
]

const TRANSITION_TYPES = [
  'fade','slide-left','slide-right','slide-up','slide-down',
  'zoom-in','zoom-out','flip-horizontal','flip-vertical',
  'dissolve','morph','portal','wipe','none',
]

const ANIM_TYPES: AnimationType[] = [
  'fade-in','fade-up','fade-down','fade-left','fade-right',
  'zoom-in','zoom-out','blur-in','rotate-in','typewriter',
  'slide-left','slide-right','bounce','flip',
]

const ANIM_TRIGGERS: AnimationTrigger[] = ['load','click','hover','scroll']

const SHADOW_PRESETS = ['none','sm','md','lg','glow','inner']

const BG_TYPES = ['solid','linear-gradient','radial-gradient','image','video','mesh']

// ── Component ─────────────────────────────────────────────────────────────────

export default function SlideSettings({ controller }: Props) {
  const {
    state, activeSlide, primarySelected, selectedElements,
    updateElement, updateSlide, deleteElements, reorderElement,
    alignElements, selectElements, clearSelection,
  } = controller

  const { rightPanel } = state
  const el = primarySelected as (SlideElement & TextElement) | null
  const isText = el ? ['heading','subheading','body','quote','label','callout','code'].includes(el.type) : false
  const hasSelection = selectedElements.length > 0

  const slideIndex = state.activeSlideIndex

  function patch(p: Partial<SlideElement>) {
    if (!el) return
    updateElement(el.id, p)
  }

  function patchSlide(p: Parameters<typeof updateSlide>[1]) {
    updateSlide(slideIndex, p)
  }

  return (
    <div className="we-settings">

      {/* TABS */}
      <div className="we-settings-tabs">
        {(['properties','slide','animate','layers'] as const).map(tab => (
          <button
            key={tab}
            className={`we-settings-tab ${rightPanel === tab ? 'active' : ''}`}
            onClick={() => controller.setRightPanel(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="we-settings-body">

        {/* ── PROPERTIES ── */}
        {(rightPanel as any) === 'properties' && (
          <div className="we-sp">
            {!hasSelection ? (
              <div className="we-sp-empty">Select an element to edit its properties.</div>
            ) : (
              <>
                {/* Position & size */}
                <Section label="Position & size">
                  <div className="we-sp-grid-2">
                    <Field label="X">
                      <input type="number" className="we-sp-num" value={Math.round(el?.x ?? 0)} onChange={e => patch({ x: Number(e.target.value) })} />
                    </Field>
                    <Field label="Y">
                      <input type="number" className="we-sp-num" value={Math.round(el?.y ?? 0)} onChange={e => patch({ y: Number(e.target.value) })} />
                    </Field>
                    <Field label="W">
                      <input type="number" className="we-sp-num" value={Math.round(el?.w ?? 0)} onChange={e => patch({ w: Number(e.target.value) })} />
                    </Field>
                    <Field label="H">
                      <input type="number" className="we-sp-num" value={Math.round(el?.h ?? 0)} onChange={e => patch({ h: Number(e.target.value) })} />
                    </Field>
                  </div>
                  <Row label="Rotation">
                    <input type="number" className="we-sp-num" value={el?.rotation ?? 0} onChange={e => patch({ rotation: Number(e.target.value) })} />
                    <span className="we-sp-unit">°</span>
                  </Row>
                </Section>

                {/* Fill */}
                <Section label="Fill">
                  <Row label="Type">
                    <select className="we-sp-select" value={el?.fill?.type ?? 'solid'} onChange={e => patch({ fill: { ...(el?.fill ?? { color:'transparent', opacity:100 }), type: e.target.value as Fill['type'] } })}>
                      <option value="solid">Solid</option>
                      <option value="linear-gradient">Linear gradient</option>
                      <option value="radial-gradient">Radial gradient</option>
                      <option value="none">None</option>
                    </select>
                  </Row>
                  {(el?.fill?.type === 'solid' || !el?.fill?.type) && (
                    <ColorRow
                      value={el?.fill?.color ?? '#2a2a3e'}
                      onChange={v => patch({ fill: { ...(el?.fill!), color: v } })}
                    />
                  )}
                  {(el?.fill?.type === 'linear-gradient' || el?.fill?.type === 'radial-gradient') && (
                    <GradientEditor
                      gradient={el.fill.gradient ?? [{ color: '#0e0e1a', position: 0 }, { color: '#2a1a4a', position: 100 }]}
                      angle={el.fill.angle ?? 135}
                      onChange={(gradient, angle) => patch({ fill: { ...el.fill!, gradient, angle } })}
                    />
                  )}
                  <Row label="Opacity">
                    <input type="range" min={0} max={100} value={el?.fill?.opacity ?? 100} onChange={e => patch({ fill: { ...(el?.fill!), opacity: Number(e.target.value) } })} className="we-sp-range" />
                    <span className="we-sp-unit">{el?.fill?.opacity ?? 100}%</span>
                  </Row>
                </Section>

                {/* Stroke */}
                <Section label="Stroke">
                  <Row label="Color">
                    <ColorRow
                      value={el?.stroke?.color ?? '#ffffff'}
                      onChange={v => patch({ stroke: { ...(el?.stroke!), color: v } })}
                    />
                  </Row>
                  <Row label="Width">
                    <input type="number" className="we-sp-num" min={0} max={20} value={el?.stroke?.width ?? 0} onChange={e => patch({ stroke: { ...(el?.stroke!), width: Number(e.target.value) } })} />
                    <span className="we-sp-unit">px</span>
                  </Row>
                  <Row label="Style">
                    <select className="we-sp-select" value={el?.stroke?.style ?? 'solid'} onChange={e => patch({ stroke: { ...(el?.stroke!), style: e.target.value as any } })}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </Row>
                </Section>

                {/* Appearance */}
                <Section label="Appearance">
                  <SliderRow label="Opacity" min={0} max={100} value={el?.opacity ?? 100} unit="%" onChange={v => patch({ opacity: v })} />
                  <Row label="Radius">
                    <input type="number" className="we-sp-num" min={0} max={999} value={el?.borderRadius ?? 0} onChange={e => patch({ borderRadius: Number(e.target.value) })} />
                    <span className="we-sp-unit">px</span>
                  </Row>
                  <Row label="Shadow">
                    <select className="we-sp-select" value={el?.shadow?.preset ?? 'none'} onChange={e => patch({ shadow: { preset: e.target.value as any } })}>
                      {SHADOW_PRESETS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Row>
                  <Row label="Blend mode">
                    <select className="we-sp-select" value={el?.blendMode ?? 'normal'} onChange={e => patch({ blendMode: e.target.value as any })}>
                      {['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','soft-light','difference','exclusion'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </Row>
                </Section>

                {/* Typography (text elements only) */}
                {isText && (
                  <Section label="Typography">
                    <Row label="Font">
                      <select className="we-sp-select" value={(el as TextElement).fontFamily} onChange={e => patch({ fontFamily: e.target.value } as any)}>
                        {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </Row>
                    <div className="we-sp-grid-2">
                      <Field label="Size">
                        <input type="number" className="we-sp-num" min={6} max={300} value={(el as TextElement).fontSize ?? 32} onChange={e => patch({ fontSize: Number(e.target.value) } as any)} />
                      </Field>
                      <Field label="Weight">
                        <select className="we-sp-select" value={(el as TextElement).fontWeight ?? '400'} onChange={e => patch({ fontWeight: e.target.value } as any)}>
                          {FONT_WEIGHTS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Row label="Color">
                      <ColorRow value={(el as TextElement).textColor ?? '#ffffff'} onChange={v => patch({ textColor: v } as any)} />
                    </Row>
                    <Row label="Align">
                      <div className="we-sp-btn-row">
                        {(['left','center','right','justify'] as const).map(a => (
                          <button key={a} className={`we-sp-icon-btn ${(el as TextElement).textAlign === a ? 'active' : ''}`} onClick={() => patch({ textAlign: a } as any)}>
                            {a === 'left' ? '≡' : a === 'center' ? '≡' : a === 'right' ? '≡' : '≡'}
                          </button>
                        ))}
                      </div>
                    </Row>
                    <SliderRow label="Line height" min={0.8} max={3} step={0.05} value={(el as TextElement).lineHeight ?? 1.3} onChange={v => patch({ lineHeight: v } as any)} />
                    <SliderRow label="Letter spacing" min={-5} max={20} step={0.5} value={(el as TextElement).letterSpacing ?? 0} unit="px" onChange={v => patch({ letterSpacing: v } as any)} />
                    <Row label="Transform">
                      <select className="we-sp-select" value={(el as TextElement).textTransform ?? 'none'} onChange={e => patch({ textTransform: e.target.value } as any)}>
                        <option value="none">None</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </Row>
                  </Section>
                )}

                {/* Arrange */}
                <Section label="Arrange">
                  <div className="we-sp-btn-row we-sp-btn-row--lg">
                    <button className="we-sp-icon-btn" title="Align left"         onClick={() => alignElements(state.selection.ids, 'left')}><AlignHorizontalJustifyStart size={13} /></button>
                    <button className="we-sp-icon-btn" title="Center horizontal"  onClick={() => alignElements(state.selection.ids, 'center-h')}><AlignHorizontalJustifyCenter size={13} /></button>
                    <button className="we-sp-icon-btn" title="Align right"        onClick={() => alignElements(state.selection.ids, 'right')}><AlignHorizontalJustifyEnd size={13} /></button>
                    <button className="we-sp-icon-btn" title="Align top"          onClick={() => alignElements(state.selection.ids, 'top')}><AlignVerticalJustifyStart size={13} /></button>
                    <button className="we-sp-icon-btn" title="Center vertical"    onClick={() => alignElements(state.selection.ids, 'center-v')}><AlignVerticalJustifyCenter size={13} /></button>
                    <button className="we-sp-icon-btn" title="Align bottom"       onClick={() => alignElements(state.selection.ids, 'bottom')}><AlignVerticalJustifyEnd size={13} /></button>
                  </div>
                  <div className="we-sp-btn-row" style={{ marginTop: 6 }}>
                    <button className="we-sp-icon-btn" title="Bring to front"   onClick={() => el && reorderElement(el.id, 'front')}><ChevronsUp size={13} /></button>
                    <button className="we-sp-icon-btn" title="Bring forward"    onClick={() => el && reorderElement(el.id, 'forward')}><ChevronUp size={13} /></button>
                    <button className="we-sp-icon-btn" title="Send backward"    onClick={() => el && reorderElement(el.id, 'backward')}><ChevronDown size={13} /></button>
                    <button className="we-sp-icon-btn" title="Send to back"     onClick={() => el && reorderElement(el.id, 'back')}><ChevronsDown size={13} /></button>
                    <button className="we-sp-icon-btn" title={el?.locked ? 'Unlock' : 'Lock'} onClick={() => el && patch({ locked: !el.locked })}>
                      {el?.locked ? <Unlock size={13} /> : <Lock size={13} />}
                    </button>
                    <button className="we-sp-icon-btn" title={el?.hidden ? 'Show' : 'Hide'} onClick={() => el && patch({ hidden: !el.hidden })}>
                      {el?.hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button className="we-sp-icon-btn we-sp-icon-btn--danger" title="Delete" onClick={() => { deleteElements(state.selection.ids); clearSelection() }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Section>
              </>
            )}
          </div>
        )}

        {/* ── SLIDE ── */}
        {(rightPanel as any) === 'slide' && activeSlide && (
          <div className="we-sp">
            <Section label="Slide info">
              <Row label="Title">
                <input type="text" className="we-sp-input" value={activeSlide.title} onChange={e => patchSlide({ title: e.target.value })} />
              </Row>
            </Section>

            <Section label="Background">
              <Row label="Type">
                <select className="we-sp-select" value={activeSlide.background.type} onChange={e => patchSlide({ background: { ...activeSlide.background, type: e.target.value as any } })}>
                  {BG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
              {activeSlide.background.type === 'solid' && (
                <ColorRow value={activeSlide.background.color} onChange={v => patchSlide({ background: { ...activeSlide.background, color: v } })} />
              )}
              {(activeSlide.background.type === 'linear-gradient' || activeSlide.background.type === 'radial-gradient') && (
                <GradientEditor
                  gradient={activeSlide.background.gradient ?? [{ color:'#0e0e1a', position:0 }, { color:'#2a1a4a', position:100 }]}
                  angle={activeSlide.background.gradientAngle ?? 135}
                  onChange={(gradient, angle) => patchSlide({ background: { ...activeSlide.background, gradient, gradientAngle: angle } })}
                />
              )}
              {(activeSlide.background.type === 'image' || activeSlide.background.type === 'video') && (
                <Row label="URL">
                  <input
                    type="text"
                    className="we-sp-input"
                    placeholder="Paste URL…"
                    value={activeSlide.background.imageUrl ?? ''}
                    onChange={e => patchSlide({ background: { ...activeSlide.background, imageUrl: e.target.value } })}
                  />
                </Row>
              )}
              <Row label="Overlay">
                <ColorRow value={activeSlide.background.overlay ?? 'transparent'} onChange={v => patchSlide({ background: { ...activeSlide.background, overlay: v } })} />
              </Row>
            </Section>

            <Section label="Transition">
              <Row label="Type">
                <select className="we-sp-select" value={activeSlide.transition.type} onChange={e => patchSlide({ transition: { ...activeSlide.transition, type: e.target.value as any } })}>
                  {TRANSITION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
              <Row label="Duration">
                <input type="number" className="we-sp-num" min={100} max={3000} step={100} value={activeSlide.transition.duration} onChange={e => patchSlide({ transition: { ...activeSlide.transition, duration: Number(e.target.value) } })} />
                <span className="we-sp-unit">ms</span>
              </Row>
              <Row label="Easing">
                <select className="we-sp-select" value={activeSlide.transition.easing} onChange={e => patchSlide({ transition: { ...activeSlide.transition, easing: e.target.value as EasingType } })}>
                  {['ease','ease-in','ease-out','ease-in-out','linear','spring'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </Row>
            </Section>

            <Section label="Speaker notes">
              <textarea
                className="we-sp-textarea"
                rows={4}
                placeholder="Notes visible during presentation…"
                value={activeSlide.notes}
                onChange={e => patchSlide({ notes: e.target.value })}
              />
            </Section>
          </div>
        )}

        {/* ── ANIMATE ── */}
        {(rightPanel as any) === 'animate' && (
          <div className="we-sp">
            {!hasSelection ? (
              <div className="we-sp-empty">Select an element to add animations.</div>
            ) : el && (
              <>
                <Section label="Animations">
                  {el.animations.length === 0 && (
                    <div className="we-sp-empty-sm">No animations. Add one below.</div>
                  )}
                  {el.animations.map((anim, i) => (
                    <div key={anim.id} className="we-anim-item">
                      <div className="we-anim-item-header">
                        <span>{anim.type}</span>
                        <div style={{ display:'flex', gap: 4 }}>
                          <span className="we-anim-trigger-chip">{anim.trigger}</span>
                          <button
                            className="we-sp-icon-btn we-sp-icon-btn--danger"
                            onClick={() => patch({ animations: el.animations.filter((_, j) => j !== i) } as any)}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <div className="we-sp-grid-2" style={{ marginTop: 8 }}>
                        <Field label="Delay">
                          <input type="number" className="we-sp-num" min={0} max={5000} step={50} value={anim.delay} onChange={e => {
                            const anims = el.animations.map((a, j) => j === i ? { ...a, delay: Number(e.target.value) } : a)
                            patch({ animations: anims } as any)
                          }} />
                        </Field>
                        <Field label="Duration">
                          <input type="number" className="we-sp-num" min={100} max={5000} step={50} value={anim.duration} onChange={e => {
                            const anims = el.animations.map((a, j) => j === i ? { ...a, duration: Number(e.target.value) } : a)
                            patch({ animations: anims } as any)
                          }} />
                        </Field>
                      </div>
                      <Row label="Easing">
                        <select className="we-sp-select" value={anim.easing} onChange={e => {
                          const anims = el.animations.map((a, j) => j === i ? { ...a, easing: e.target.value as EasingType } : a)
                          patch({ animations: anims } as any)
                        }}>
                          {['ease','ease-in','ease-out','ease-in-out','linear','spring'].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Row>
                    </div>
                  ))}
                </Section>

                <Section label="Add animation">
                  <div className="we-anim-grid">
                    {ANIM_TYPES.map(type => (
                      <button
                        key={type}
                        className="we-anim-add-btn"
                        onClick={() => {
                          const anim = { ...defaultAnimation(), type }
                          patch({ animations: [...el.animations, anim] } as any)
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section label="Trigger">
                  <div className="we-sp-btn-row">
                    {ANIM_TRIGGERS.map(t => (
                      <button
                        key={t}
                        className={`we-anim-trigger-btn ${el.animations[0]?.trigger === t ? 'active' : ''}`}
                        onClick={() => {
                          const anims = el.animations.map(a => ({ ...a, trigger: t }))
                          patch({ animations: anims } as any)
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Section>
              </>
            )}
          </div>
        )}

        {/* ── LAYERS ── */}
        {(rightPanel as any) === 'layers' && activeSlide && (
          <div className="we-sp">
            <div className="we-layers">
              {[...activeSlide.elements]
                .sort((a, b) => (b.zIndex ?? 1) - (a.zIndex ?? 1))
                .map(el => (
                  <div
                    key={el.id}
                    className={`we-layer-row ${state.selection.ids.includes(el.id) ? 'active' : ''}`}
                    onClick={() => selectElements([el.id], 'replace')}
                  >
                    <span className="we-layer-icon">{LAYER_ICONS[el.type] ?? '○'}</span>
                    <span className="we-layer-name">
                      {(el as any).text?.slice(0, 18) || (el as any).label?.slice(0, 18) || el.type}
                    </span>
                    <div className="we-layer-actions">
                      <button
                        className="we-sp-icon-btn"
                        title={el.hidden ? 'Show' : 'Hide'}
                        onClick={e => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }) }}
                      >
                        {el.hidden ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                      <button
                        className="we-sp-icon-btn"
                        title={el.locked ? 'Unlock' : 'Lock'}
                        onClick={e => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }) }}
                      >
                        {el.locked ? <Unlock size={11} /> : <Lock size={11} />}
                      </button>
                    </div>
                  </div>
                ))
              }
              {activeSlide.elements.length === 0 && (
                <div className="we-sp-empty">No elements on this slide.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="we-sp-section">
      <div className="we-sp-section-label">{label}</div>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="we-sp-row">
      <span className="we-sp-row-label">{label}</span>
      <div className="we-sp-row-control">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="we-sp-field">
      <span className="we-sp-field-label">{label}</span>
      {children}
    </div>
  )
}

function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="we-color-row">
      <label className="we-color-swatch">
        <input type="color" value={value.startsWith('#') ? value : '#ffffff'} onChange={e => onChange(e.target.value)} />
      </label>
      <input
        type="text"
        className="we-sp-input we-sp-input--flex"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function SliderRow({
  label, min, max, step = 1, value, unit, onChange,
}: {
  label: string; min: number; max: number; step?: number;
  value: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="we-sp-slider-row">
      <div className="we-sp-slider-header">
        <span>{label}</span>
        <span className="we-sp-unit">{value}{unit ?? ''}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="we-sp-range" />
    </div>
  )
}

function GradientEditor({
  gradient, angle, onChange,
}: {
  gradient: GradientStop[]; angle: number;
  onChange: (g: GradientStop[], angle: number) => void;
}) {
  function updateStop(i: number, partial: Partial<GradientStop>) {
    const next = gradient.map((s, j) => j === i ? { ...s, ...partial } : s)
    onChange(next, angle)
  }
  function addStop() {
    onChange([...gradient, { color: '#ffffff', position: 50 }], angle)
  }
  function removeStop(i: number) {
    if (gradient.length <= 2) return
    onChange(gradient.filter((_, j) => j !== i), angle)
  }

  return (
    <div>
      {gradient.map((stop, i) => (
        <div key={i} className="we-gradient-stop">
          <label className="we-color-swatch we-color-swatch--sm">
            <input type="color" value={stop.color.startsWith('#') ? stop.color : '#ffffff'} onChange={e => updateStop(i, { color: e.target.value })} />
          </label>
          <input type="range" min={0} max={100} value={stop.position} onChange={e => updateStop(i, { position: Number(e.target.value) })} className="we-sp-range" style={{ flex: 1 }} />
          <span className="we-sp-unit" style={{ minWidth: 28 }}>{stop.position}%</span>
          {gradient.length > 2 && (
            <button className="we-sp-icon-btn" onClick={() => removeStop(i)}><Trash2 size={10} /></button>
          )}
        </div>
      ))}
      <div className="we-sp-row" style={{ marginTop: 8 }}>
        <span className="we-sp-row-label">Angle</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="range" min={0} max={360} value={angle} onChange={e => onChange(gradient, Number(e.target.value))} className="we-sp-range" style={{ width: 80 }} />
          <span className="we-sp-unit">{angle}°</span>
        </div>
      </div>
      <button className="we-sp-ghost-btn" onClick={addStop} style={{ marginTop: 6 }}>
        <Plus size={11} /> Add stop
      </button>
    </div>
  )
}

// ── Layer icons ───────────────────────────────────────────────────────────────

const LAYER_ICONS: Record<string, string> = {
  heading:'H', subheading:'h', body:'¶', quote:'"', label:'—', callout:'✦', code:'</>',
  rect:'▭', ellipse:'◯', line:'─', triangle:'△',
  image:'🖼', video:'▶', gif:'🎞', icon:'★',
  card:'▭', frame:'⊞', bento:'⊟', divider:'÷',
  character:'👤', location:'📍', artifact:'🏺', lore:'📜', organization:'🏛', event:'⚡',
}