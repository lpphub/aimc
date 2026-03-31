import { useCallback, useState } from 'react'

interface UseCanvasZoomOptions {
  minZoom?: number
  maxZoom?: number
  step?: number
}

interface CanvasZoomResult {
  zoom: number
  offset: { x: number; y: number }
}

const DEFAULT_MIN_ZOOM = 0.25
const DEFAULT_MAX_ZOOM = 2.0
const DEFAULT_STEP = 0.1

export function useCanvasZoom(options?: UseCanvasZoomOptions) {
  const minZoom = options?.minZoom ?? DEFAULT_MIN_ZOOM
  const maxZoom = options?.maxZoom ?? DEFAULT_MAX_ZOOM
  const step = options?.step ?? DEFAULT_STEP

  const [zoom, setZoom] = useState(1)

  const handleWheel = useCallback(
    (e: React.WheelEvent, currentOffset: { x: number; y: number }): CanvasZoomResult => {
      const delta = e.deltaY > 0 ? -step : step
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta))

      // Skip if zoom unchanged (at boundary)
      if (newZoom === zoom) {
        return { zoom, offset: currentOffset }
      }

      // Cursor position relative to content (before zoom)
      const mouseXOnContent = (e.clientX - currentOffset.x) / zoom
      const mouseYOnContent = (e.clientY - currentOffset.y) / zoom

      // New offset to keep cursor at same content position
      const newOffset = {
        x: e.clientX - mouseXOnContent * newZoom,
        y: e.clientY - mouseYOnContent * newZoom,
      }

      return { zoom: newZoom, offset: newOffset }
    },
    [zoom, minZoom, maxZoom, step]
  )

  const resetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  return {
    zoom,
    setZoom,
    handleWheel,
    resetZoom,
  }
}
