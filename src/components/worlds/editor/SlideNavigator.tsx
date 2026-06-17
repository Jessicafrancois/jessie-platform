'use client'

import type { WorldSlide } from '../../../types/worlds'

type Props = {
  slides: WorldSlide[]

  activeIndex: number

  onSelectAction: (index: number) => void
  onAddAction: () => void

  onDuplicateAction: (
    slideId: string
  ) => void

  onDeleteAction: (
    slideId: string
  ) => void

  onReorderAction: (
    sourceId: string,
    destinationId: string
  ) => void
}

export default function SlideNavigator({
  slides,
  activeIndex,
  onSelectAction,
  onAddAction,
  onDuplicateAction,
  onDeleteAction,
  onReorderAction,
}: Props) {

  function onReorder(sourceId: string, destinationId: string) {
    onReorderAction(sourceId, destinationId)
  }

  function onAdd(): void {
    onAddAction()
  }

  function onDuplicate(id: string) {
    onDuplicateAction(id)
  }

  function onDelete(id: string) {
    onDeleteAction(id)
  }

  return (
    <div className="sn-root">

      <div className="sn-header">
        <span className="sn-label">Slides</span>

        <button
          className="sn-add-btn"
          onClick={onAdd}
          aria-label="Add slide"
        >
          + Add
        </button>
      </div>

      <div className="sn-list">

        {slides.map((slide, i) => (

          <div
            key={slide.id}
            className={`sn-thumb ${
              i === activeIndex
                ? 'sn-thumb--active'
                : ''
            }`}
            onClick={() => onSelectAction(i)}
            draggable

            onDragStart={(e) =>
              e.dataTransfer.setData(
                'text/plain',
                slide.id
              )
            }

            onDragOver={(e) =>
              e.preventDefault()
            }

            onDrop={(e) => {
              e.preventDefault()

              const sourceId =
                e.dataTransfer.getData(
                  'text/plain'
                )

              const destinationId =
                slide.id

              if (
                sourceId !== destinationId
              ) {
                onReorder(
                  sourceId,
                  destinationId
                )
              }
            }}
          >

            <div className="sn-thumb-preview">

              <div className="sn-thumb-type">
                {slide.slide_type || 'slide'}
              </div>

              <div className="sn-thumb-title">
                {slide.title || 'Untitled'}
              </div>

            </div>

            <div className="sn-thumb-number">
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="sn-thumb-actions">

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(slide.id)
                }}
                title="Duplicate"
              >
                ⧉
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(slide.id)
                }}
                title="Delete"
              >
                ✕
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}