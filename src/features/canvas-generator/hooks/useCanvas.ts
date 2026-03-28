import { useCallback } from 'react'
import { useCanvasStore } from '../stores/canvas'
import type { CanvasItem } from '../types'

export function useCanvas() {
  const { items, selectedId, addItem, updateItem, removeItem, selectItem } = useCanvasStore()

  const handleAddImage = useCallback(
    (imageUrl: string, position?: { x: number; y: number }) => {
      const item: CanvasItem = {
        id: crypto.randomUUID(),
        type: 'image',
        imageUrl,
        x: position?.x ?? 100,
        y: position?.y ?? 100,
        width: 300,
        height: 400,
        rotation: 0,
      }
      addItem(item)
    },
    [addItem]
  )

  const handleDrag = useCallback(
    (id: string, x: number, y: number) => {
      updateItem(id, { x, y })
    },
    [updateItem]
  )

  return {
    items,
    selectedId,
    handleAddImage,
    handleDrag,
    selectItem,
    removeItem,
  }
}
