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
  conversationId: string // Now required
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

// 对话摘要
export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

// 对话详情（含消息和画布状态）
export interface ConversationDetail {
  id: string
  title: string
  messages: ChatMessage[]
  canvasItems: CanvasItem[]
  createdAt: number
  updatedAt: number
}

// 创建对话请求
export interface CreateConversationReq {
  title?: string
}

// 创建对话响应
export interface CreateConversationResp {
  conversation: Conversation
}
