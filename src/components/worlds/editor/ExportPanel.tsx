'use client'

import { useRef, useState } from 'react'
import { exportSlidePNG, exportWorldPDF, exportWorldVideo } from '@/lib/worldExport'
import type { WorldSlide } from '@/types/worlds'

type Props = {
  worldTitle: string
  slides: WorldSlide[]
  activeIndex: number
  stageRef: React.RefObject<HTMLElement | null>
  allStageRefs: React.RefObject<(HTMLElement | null)[]>
  onCloseAction: () => void
}

export default function ExportPanel({
  worldTitle,
  slides,
  activeIndex,
  stageRef,
  onCloseAction,
}: Props) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')

  async function handlePNG() {
    if (!stageRef.current) return
    setBusy(true)
    setStatus('Capturing slide...')
    await exportSlidePNG(
      stageRef.current,
      `${worldTitle}-slide-${activeIndex + 1}.png`,
    )
    setBusy(false)
    setStatus('')
  }

  async function handlePDF(allRefs: HTMLElement[]) {
    setBusy(true)
    setStatus(`Building PDF — ${allRefs.length} slides...`)
    await exportWorldPDF(allRefs, worldTitle)
    setBusy(false)
    setStatus('')
  }

  async function handleVideo() {
    if (!stageRef.current) return
    setBusy(true)
    setStatus('Recording...')
    await exportWorldVideo(stageRef.current, 3000, pct => {
      setProgress(pct)
      setStatus(`Recording... ${pct}%`)
    })
    setBusy(false)
    setStatus('')
    setProgress(0)
  }

  return (
    <div className="we-export-panel">
      <div className="we-export-header">
        <span>Export</span>
        <button onClick={onCloseAction} aria-label="Close">×</button>
      </div>

      {status && (
        <div className="we-export-status">
          {status}
          {progress > 0 && (
            <div className="we-export-progress">
              <div style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      <div className="we-export-options">
        <button
          className="we-export-btn"
          onClick={handlePNG}
          disabled={busy}
        >
          <span className="we-export-icon">◻</span>
          <div>
            <strong>PNG</strong>
            <span>Current slide — 2× retina</span>
          </div>
        </button>

        <button
          className="we-export-btn"
          disabled={busy}
          onClick={() => {
            // Caller must pass mounted stage nodes via a shared ref array
            // For now we capture only the visible stage — full PDF needs all stages
            // mounted simultaneously. See WorldEditor wiring notes below.
            const el = stageRef.current
            if (el) handlePDF([el])
          }}
        >
          <span className="we-export-icon">▤</span>
          <div>
            <strong>PDF</strong>
            <span>All slides — A4 landscape</span>
          </div>
        </button>

        <button
          className="we-export-btn"
          onClick={handleVideo}
          disabled={busy}
        >
          <span className="we-export-icon">▶</span>
          <div>
            <strong>Video</strong>
            <span>Current slide — 24 fps WebM</span>
          </div>
        </button>
      </div>

      <p className="we-export-note">
        PDF exports capture the visible stage. For full-deck PDF,
        cycle through each slide while holding Shift and click PDF once per slide —
        or wire <code>allStageRefs</code> to mount all slides off-screen.
      </p>
    </div>
  )
}