// ─────────────────────────────────────────────────────────────────────────────
// src/lib/useEditorState.ts
// Central state management for the slide editor.
// Uses useReducer so every mutation is tracked and reversible.
// ─────────────────────────────────────────────────────────────────────────────

import { useReducer, useCallback, useRef } from 'react'
import {
  EditorState, Slide, SlideElement, EditorTool,
  LeftPanelTab, RightPanelTab, EditorViewport, HistoryEntry,
} from '@/types/editor'

const MAX_HISTORY = 60

// ── Action types ──────────────────────────────────────────────────────────────

type Action =
  // Slides
  | { type: 'ADD_SLIDE'; slide: Slide }
  | { type: 'DELETE_SLIDE'; index: number }
  | { type: 'DUPLICATE_SLIDE'; index: number }
  | { type: 'REORDER_SLIDES'; from: number; to: number }
  | { type: 'SELECT_SLIDE'; index: number }
  | { type: 'UPDATE_SLIDE'; index: number; patch: Partial<Slide> }
  // Elements
  | { type: 'ADD_ELEMENT'; element: SlideElement }
  | { type: 'DELETE_ELEMENTS'; ids: string[] }
  | { type: 'DUPLICATE_ELEMENTS'; ids: string[] }
  | { type: 'UPDATE_ELEMENT'; id: string; patch: Partial<SlideElement> }
  | { type: 'MOVE_ELEMENTS'; ids: string[]; dx: number; dy: number }
  | { type: 'REORDER_ELEMENT'; id: string; direction: 'forward' | 'backward' | 'front' | 'back' }
  | { type: 'ALIGN_ELEMENTS'; ids: string[]; axis: AlignAxis }
  | { type: 'GROUP_ELEMENTS'; ids: string[] }
  // Selection
  | { type: 'SELECT_ELEMENTS'; ids: string[]; mode: 'replace' | 'add' | 'toggle' }
  | { type: 'CLEAR_SELECTION' }
  // Editor
  | { type: 'SET_TOOL'; tool: EditorTool }
  | { type: 'SET_LEFT_PANEL'; panel: LeftPanelTab }
  | { type: 'SET_RIGHT_PANEL'; panel: RightPanelTab }
  | { type: 'SET_VIEWPORT'; viewport: Partial<EditorViewport> }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_RULERS' }
  | { type: 'TOGGLE_SNAP' }
  // History
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY'; label: string }
  // Save
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_DIRTY' }

export type AlignAxis =
  | 'left' | 'right' | 'top' | 'bottom'
  | 'center-h' | 'center-v'
  | 'distribute-h' | 'distribute-v'

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {

    // ── Slides ────────────────────────────────────────────────────────────────
    case 'ADD_SLIDE': {
      const slides = [...state.slides, action.slide]
      return { ...state, slides, activeSlideIndex: slides.length - 1, isDirty: true }
    }

    case 'DELETE_SLIDE': {
      if (state.slides.length <= 1) return state
      const slides = state.slides.filter((_, i) => i !== action.index)
      const activeSlideIndex = Math.min(state.activeSlideIndex, slides.length - 1)
      return { ...state, slides, activeSlideIndex, isDirty: true }
    }

    case 'DUPLICATE_SLIDE': {
      const src = state.slides[action.index]
      const copy: Slide = {
        ...JSON.parse(JSON.stringify(src)),
        id: crypto.randomUUID(),
        title: src.title + ' (copy)',
        sortOrder: state.slides.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        elements: src.elements.map(el => ({ ...el, id: crypto.randomUUID() })),
      }
      const slides = [
        ...state.slides.slice(0, action.index + 1),
        copy,
        ...state.slides.slice(action.index + 1),
      ]
      return { ...state, slides, activeSlideIndex: action.index + 1, isDirty: true }
    }

    case 'REORDER_SLIDES': {
      const slides = [...state.slides]
      const [moved] = slides.splice(action.from, 1)
      slides.splice(action.to, 0, moved)
      return { ...state, slides, activeSlideIndex: action.to, isDirty: true }
    }

    case 'SELECT_SLIDE': {
      return {
        ...state,
        activeSlideIndex: action.index,
        selection: { ids: [] },
      }
    }

    case 'UPDATE_SLIDE': {
      const slides = state.slides.map((s, i) =>
        i === action.index
          ? { ...s, ...action.patch, updatedAt: new Date().toISOString() }
          : s
      )
      return { ...state, slides, isDirty: true }
    }

    // ── Elements ──────────────────────────────────────────────────────────────
    case 'ADD_ELEMENT': {
      const slides = mutateSlide(state, s => ({
        ...s,
        elements: [...s.elements, action.element],
      }))
      return {
        ...state,
        slides,
        selection: { ids: [action.element.id] },
        isDirty: true,
      }
    }

    case 'DELETE_ELEMENTS': {
      const slides = mutateSlide(state, s => ({
        ...s,
        elements: s.elements.filter(el => !action.ids.includes(el.id)),
      }))
      return { ...state, slides, selection: { ids: [] }, isDirty: true }
    }

    case 'DUPLICATE_ELEMENTS': {
      const slide = state.slides[state.activeSlideIndex]
      const newIds: string[] = []
      const copies = action.ids
        .map(id => slide.elements.find(el => el.id === id))
        .filter(Boolean)
        .map(el => {
          const newId = crypto.randomUUID()
          newIds.push(newId)
          return { ...JSON.parse(JSON.stringify(el!)), id: newId, x: el!.x + 20, y: el!.y + 20 }
        })
      const slides = mutateSlide(state, s => ({
        ...s,
        elements: [...s.elements, ...copies],
      }))
      return { ...state, slides, selection: { ids: newIds }, isDirty: true }
    }

    case 'UPDATE_ELEMENT': {
      const slides = mutateSlide(state, s => ({
        ...s,
        elements: s.elements.map(el =>
          el.id === action.id ? ({ ...el, ...action.patch } as SlideElement) : el
        ),
      }))
      return { ...state, slides, isDirty: true }
    }

    case 'MOVE_ELEMENTS': {
      const slides = mutateSlide(state, s => ({
        ...s,
        elements: s.elements.map(el =>
          action.ids.includes(el.id)
            ? { ...el, x: Math.round(el.x + action.dx), y: Math.round(el.y + action.dy) }
            : el
        ),
      }))
      return { ...state, slides, isDirty: true }
    }

    case 'REORDER_ELEMENT': {
      const slides = mutateSlide(state, s => {
        const els = [...s.elements].sort((a, b) => a.zIndex - b.zIndex)
        const idx = els.findIndex(el => el.id === action.id)
        if (idx < 0) return s
        const max = els.length - 1
        const newIdx =
          action.direction === 'forward'  ? Math.min(max, idx + 1) :
          action.direction === 'backward' ? Math.max(0, idx - 1)   :
          action.direction === 'front'    ? max                     : 0
        const [moved] = els.splice(idx, 1)
        els.splice(newIdx, 0, moved)
        return {
          ...s,
          elements: els.map((el, i) => ({ ...el, zIndex: i + 1 })),
        }
      })
      return { ...state, slides, isDirty: true }
    }

    case 'ALIGN_ELEMENTS': {
      const slide = state.slides[state.activeSlideIndex]
      const targets = slide.elements.filter(el => action.ids.includes(el.id))
      if (!targets.length) return state

      const W = slide.width, H = slide.height
      const minX = Math.min(...targets.map(el => el.x))
      const maxX = Math.max(...targets.map(el => el.x + el.w))
      const minY = Math.min(...targets.map(el => el.y))
      const maxY = Math.max(...targets.map(el => el.y + el.h))
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2

      const slides = mutateSlide(state, s => ({
        ...s,
        elements: s.elements.map(el => {
          if (!action.ids.includes(el.id)) return el
          switch (action.axis) {
            case 'left':       return { ...el, x: 0 }
            case 'right':      return { ...el, x: W - el.w }
            case 'top':        return { ...el, y: 0 }
            case 'bottom':     return { ...el, y: H - el.h }
            case 'center-h':   return { ...el, x: (W - el.w) / 2 }
            case 'center-v':   return { ...el, y: (H - el.h) / 2 }
            default:           return el
          }
        }),
      }))
      return { ...state, slides, isDirty: true }
    }

    // ── Selection ─────────────────────────────────────────────────────────────
    case 'SELECT_ELEMENTS': {
      let ids: string[]
      if (action.mode === 'replace') {
        ids = action.ids
      } else if (action.mode === 'add') {
        ids = [...new Set([...state.selection.ids, ...action.ids])]
      } else {
        // toggle
        ids = action.ids.reduce((acc, id) => {
          return acc.includes(id) ? acc.filter(x => x !== id) : [...acc, id]
        }, state.selection.ids)
      }
      return { ...state, selection: { ids } }
    }

    case 'CLEAR_SELECTION':
      return { ...state, selection: { ids: [] } }

    // ── Editor ────────────────────────────────────────────────────────────────
    case 'SET_TOOL':
      return { ...state, tool: action.tool }

    case 'SET_LEFT_PANEL':
      return { ...state, leftPanel: action.panel }

    case 'SET_RIGHT_PANEL':
      return { ...state, rightPanel: action.panel }

    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...state.viewport, ...action.viewport } }

    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid }

    case 'TOGGLE_RULERS':
      return { ...state, showRulers: !state.showRulers }

    case 'TOGGLE_SNAP':
      return { ...state, snapToGrid: !state.snapToGrid }

    // ── History ───────────────────────────────────────────────────────────────
    case 'PUSH_HISTORY': {
      const entry: HistoryEntry = {
        slides: JSON.parse(JSON.stringify(state.slides)),
        label: action.label,
      }
      const history = [
        ...state.history.slice(0, state.historyIndex + 1).slice(-MAX_HISTORY + 1),
        entry,
      ]
      return { ...state, history, historyIndex: history.length - 1 }
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const idx = state.historyIndex - 1
      return {
        ...state,
        slides: JSON.parse(JSON.stringify(state.history[idx].slides)),
        historyIndex: idx,
        selection: { ids: [] },
        isDirty: true,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const idx = state.historyIndex + 1
      return {
        ...state,
        slides: JSON.parse(JSON.stringify(state.history[idx].slides)),
        historyIndex: idx,
        selection: { ids: [] },
        isDirty: true,
      }
    }

    case 'MARK_SAVED': return { ...state, isDirty: false, isSaving: false }
    case 'MARK_DIRTY': return { ...state, isDirty: true }

    default: return state
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mutateSlide(state: EditorState, fn: (slide: Slide) => Slide): Slide[] {
  return state.slides.map((s, i) =>
    i === state.activeSlideIndex ? fn(s) : s
  )
}

// ── Initial state factory ─────────────────────────────────────────────────────

export function createInitialState(slides: Slide[]): EditorState {
  const initial: EditorState = {
    slides,
    activeSlideIndex: 0,
    selection: { ids: [] },
    tool: 'select',
    viewport: { zoom: 0.6, offsetX: 0, offsetY: 0 },
    leftPanel: 'slides',
    rightPanel: 'properties',
    showGrid: false,
    showRulers: false,
    snapToGrid: true,
    gridSize: 8,
    history: [],
    historyIndex: -1,
    isDirty: false,
    isSaving: false,
  }
  // Push initial history entry
  return reducer(initial, { type: 'PUSH_HISTORY', label: 'Initial state' })
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useEditorState(initialSlides: Slide[]) {
  const [state, dispatch] = useReducer(reducer, initialSlides, createInitialState)

  // Auto-push history before destructive mutations
  const pushHistory = useCallback((label: string) => {
    dispatch({ type: 'PUSH_HISTORY', label })
  }, [])

  // Slide actions
  const addSlide = useCallback((slide: Slide) => {
    pushHistory('Add slide')
    dispatch({ type: 'ADD_SLIDE', slide })
  }, [pushHistory])

  const deleteSlide = useCallback((index: number) => {
    pushHistory('Delete slide')
    dispatch({ type: 'DELETE_SLIDE', index })
  }, [pushHistory])

  const duplicateSlide = useCallback((index: number) => {
    pushHistory('Duplicate slide')
    dispatch({ type: 'DUPLICATE_SLIDE', index })
  }, [pushHistory])

  const reorderSlides = useCallback((from: number, to: number) => {
    pushHistory('Reorder slides')
    dispatch({ type: 'REORDER_SLIDES', from, to })
  }, [pushHistory])

  const selectSlide = useCallback((index: number) => {
    dispatch({ type: 'SELECT_SLIDE', index })
  }, [])

  const updateSlide = useCallback((index: number, patch: Partial<Slide>) => {
    dispatch({ type: 'UPDATE_SLIDE', index, patch })
  }, [])

  // Element actions
  const addElement = useCallback((element: SlideElement) => {
    pushHistory('Add element')
    dispatch({ type: 'ADD_ELEMENT', element })
  }, [pushHistory])

  const deleteElements = useCallback((ids: string[]) => {
    pushHistory('Delete elements')
    dispatch({ type: 'DELETE_ELEMENTS', ids })
  }, [pushHistory])

  const duplicateElements = useCallback((ids: string[]) => {
    pushHistory('Duplicate elements')
    dispatch({ type: 'DUPLICATE_ELEMENTS', ids })
  }, [pushHistory])

  const updateElement = useCallback((id: string, patch: Partial<SlideElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', id, patch })
  }, [])

  const moveElements = useCallback((ids: string[], dx: number, dy: number) => {
    dispatch({ type: 'MOVE_ELEMENTS', ids, dx, dy })
  }, [])

  const reorderElement = useCallback((id: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
    pushHistory('Reorder element')
    dispatch({ type: 'REORDER_ELEMENT', id, direction })
  }, [pushHistory])

  const alignElements = useCallback((ids: string[], axis: AlignAxis) => {
    pushHistory('Align elements')
    dispatch({ type: 'ALIGN_ELEMENTS', ids, axis })
  }, [pushHistory])

  // Selection
  const selectElements = useCallback((ids: string[], mode: 'replace' | 'add' | 'toggle' = 'replace') => {
    dispatch({ type: 'SELECT_ELEMENTS', ids, mode })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  // Editor controls
  const setTool    = useCallback((tool: EditorTool) => dispatch({ type: 'SET_TOOL', tool }), [])
  const setLeftPanel  = useCallback((panel: LeftPanelTab) => dispatch({ type: 'SET_LEFT_PANEL', panel }), [])
  const setRightPanel = useCallback((panel: RightPanelTab) => dispatch({ type: 'SET_RIGHT_PANEL', panel }), [])
  const setViewport   = useCallback((v: Partial<EditorViewport>) => dispatch({ type: 'SET_VIEWPORT', viewport: v }), [])
  const toggleGrid    = useCallback(() => dispatch({ type: 'TOGGLE_GRID' }), [])
  const toggleRulers  = useCallback(() => dispatch({ type: 'TOGGLE_RULERS' }), [])
  const toggleSnap    = useCallback(() => dispatch({ type: 'TOGGLE_SNAP' }), [])

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), [])

  const canUndo = state.historyIndex > 0
  const canRedo = state.historyIndex < state.history.length - 1

  const activeSlide = state.slides[state.activeSlideIndex] ?? null
  const selectedElements = activeSlide
    ? activeSlide.elements.filter(el => state.selection.ids.includes(el.id))
    : []
  const primarySelected = selectedElements[0] ?? null

  return {
    state,
    // Computed
    activeSlide,
    selectedElements,
    primarySelected,
    canUndo,
    canRedo,
    // Slide actions
    addSlide, deleteSlide, duplicateSlide, reorderSlides, selectSlide, updateSlide,
    // Element actions
    addElement, deleteElements, duplicateElements, updateElement,
    moveElements, reorderElement, alignElements,
    // Selection
    selectElements, clearSelection,
    // Editor
    setTool, setLeftPanel, setRightPanel, setViewport,
    toggleGrid, toggleRulers, toggleSnap,
    undo, redo, markSaved,
    pushHistory,
  }
}

export type EditorController = ReturnType<typeof useEditorState>