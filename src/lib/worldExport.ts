/**
 * worldExport.ts
 * PNG / PDF / video export utilities for World Builder slides.
 *
 * PNG  — html2canvas screenshot of the SlideCanvas DOM node
 * PDF  — jsPDF doc with one html2canvas page per slide
 * Video — MediaRecorder + html2canvas frame loop at 24 fps
 */

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/* ── PNG ──────────────────────────────────────────────────── */

export async function exportSlidePNG(
  stageEl: HTMLElement,
  filename = 'slide.png',
): Promise<void> {
  const canvas = await html2canvas(stageEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#000',
    logging: false,
  })
  const url = canvas.toDataURL('image/png')
  download(url, filename)
}

/* ── PDF ──────────────────────────────────────────────────── */

export async function exportWorldPDF(
  stageEls: HTMLElement[],
  worldTitle = 'world',
): Promise<void> {
  if (stageEls.length === 0) return

  const first = await html2canvas(stageEls[0], {
    scale: 1.5,
    useCORS: true,
    backgroundColor: '#000',
    logging: false,
  })

  const W = first.width
  const H = first.height
  const orientation = W > H ? 'landscape' : 'portrait'

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [W, H],
    compress: true,
  })

  for (let i = 0; i < stageEls.length; i++) {
    const canvas = i === 0
      ? first
      : await html2canvas(stageEls[i], {
          scale: 1.5,
          useCORS: true,
          backgroundColor: '#000',
          logging: false,
        })

    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    if (i > 0) pdf.addPage([W, H], orientation)
    pdf.addImage(imgData, 'JPEG', 0, 0, W, H)
  }

  pdf.save(`${slugify(worldTitle)}.pdf`)
}

/* ── Video ────────────────────────────────────────────────── */

export async function exportWorldVideo(
  stageEl: HTMLElement,
  durationMs = 3000,
  onProgress?: (pct: number) => void,
): Promise<void> {
  const FPS = 24
  const frameMs = 1000 / FPS
  const totalFrames = Math.ceil((durationMs / 1000) * FPS)

  const firstFrame = await html2canvas(stageEl, {
    scale: 1,
    useCORS: true,
    backgroundColor: '#000',
    logging: false,
  })

  const { width: W, height: H } = firstFrame
  const offscreen = document.createElement('canvas')
  offscreen.width = W
  offscreen.height = H
  const ctx = offscreen.getContext('2d')!

  const stream = offscreen.captureStream(FPS)
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 8_000_000,
  })

  const chunks: BlobPart[] = []
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

  const done = new Promise<void>(resolve => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      download(url, 'world-export.webm')
      URL.revokeObjectURL(url)
      resolve()
    }
  })

  recorder.start()

  for (let f = 0; f < totalFrames; f++) {
    const frame = await html2canvas(stageEl, {
      scale: 1,
      useCORS: true,
      backgroundColor: '#000',
      logging: false,
    })
    ctx.drawImage(frame, 0, 0)
    onProgress?.(Math.round((f / totalFrames) * 100))
    await sleep(frameMs)
  }

  recorder.stop()
  await done
}

/* ── Helpers ──────────────────────────────────────────────── */

function download(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}