import { useCallback } from 'react'
import { useCanvasStore } from '../stores/canvas'
import type { CanvasItem } from '../types'

const DEFAULT_ITEM_WIDTH = 300
const DEFAULT_ITEM_HEIGHT = 400
const DEFAULT_ITEM_X = 100
const DEFAULT_ITEM_Y = 100

export function useCanvas() {
  const { items, selectedId, addItem, updateItem, removeItem, selectItem } = useCanvasStore()

  const handleAddImage = useCallback(
    (imageUrl: string, position?: { x: number; y: number }) => {
      const item: CanvasItem = {
        id: crypto.randomUUID(),
        type: 'image',
        imageUrl,
        x: position?.x ?? DEFAULT_ITEM_X,
        y: position?.y ?? DEFAULT_ITEM_Y,
        width: DEFAULT_ITEM_WIDTH,
        height: DEFAULT_ITEM_HEIGHT,
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
