import { create } from 'zustand'
import type { CanvasItem } from '../types'

interface CanvasState {
  items: CanvasItem[]
  selectedId: string | null
  isDragging: boolean

  addItem: (item: CanvasItem) => void
  setItems: (items: CanvasItem[]) => void
  updateItem: (id: string, updates: Partial<CanvasItem>) => void
  removeItem: (id: string) => void
  selectItem: (id: string | null) => void
  clearCanvas: () => void
}

export const useCanvasStore = create<CanvasState>(set => ({
  items: [],
  selectedId: null,
  isDragging: false,

  addItem: item => set(state => ({ items: [...state.items, item] })),

  setItems: items => set({ items }),

  updateItem: (id, updates) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, ...updates } : item)),
    })),

  removeItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectItem: id => set({ selectedId: id }),

  clearCanvas: () => set({ items: [], selectedId: null }),
}))
