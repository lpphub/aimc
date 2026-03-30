import { create } from 'zustand'

export interface PendingImage {
  url: string
  file: File
}

interface PendingMessage {
  text: string
  images: PendingImage[]
}

interface ChatState {
  pendingMessage: PendingMessage | null
  setPendingMessage: (message: PendingMessage) => void
  clearPendingMessage: () => void
}

export const useChatStore = create<ChatState>(set => ({
  pendingMessage: null,
  setPendingMessage: message => set({ pendingMessage: message }),
  clearPendingMessage: () =>
    set(state => {
      state.pendingMessage?.images.forEach(img => {
        URL.revokeObjectURL(img.url)
      })
      return { pendingMessage: null }
    }),
}))
