export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: number
}

export interface CanvasItem {
  id: string
  type: 'image'
  imageUrl: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface ChatMessageReq {
  conversationId?: string
  message: string
  image?: File
}

export interface ChatMessageResp {
  conversationId: string
  message: ChatMessage
  generatedImage?: {
    imageUrl: string
    suggestedPosition?: { x: number; y: number }
  }
}

export interface CanvasExportReq {
  items: CanvasItem[]
  format: 'png' | 'jpeg'
}

export interface CanvasExportResp {
  imageUrl: string
}
