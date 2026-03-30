import { delay, HttpResponse, http } from 'msw'
import type {
  CanvasExportResp,
  ChatMessage,
  ChatMessageResp,
  Conversation,
  ConversationDetail,
  CreateConversationResp,
} from '@/features/generator/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function notFound(message: string) {
  return HttpResponse.json<ApiResponse<null>>({ code: 404, message, data: null }, { status: 404 })
}

// In-memory storage for mock conversations
const mockConversations = new Map<string, ConversationDetail>()

// Initialize with some sample data
const now = Date.now()
mockConversations.set('conv-1', {
  id: 'conv-1',
  title: '运动鞋海报设计',
  messages: [],
  canvasItems: [],
  createdAt: now - 86400000,
  updatedAt: now - 86400000,
})

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
]

export const generatorHandlers = [
  // GET /api/conversations
  http.get(`${API_BASE}/conversations`, () => {
    const list: Conversation[] = Array.from(mockConversations.values())
      .map(c => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
    return HttpResponse.json(success(list))
  }),

  // GET /api/conversations/:id
  http.get(`${API_BASE}/conversations/:id`, ({ params }) => {
    const id = params.id as string
    const conv = mockConversations.get(id)
    if (!conv) return notFound('对话不存在')
    return HttpResponse.json(success(conv))
  }),

  // POST /api/conversations
  http.post(`${API_BASE}/conversations`, async () => {
    await delay(500)
    const id = `conv-${Date.now()}`
    const timestamp = Date.now()
    const conv: ConversationDetail = {
      id,
      title: '新对话',
      messages: [],
      canvasItems: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    mockConversations.set(id, conv)
    return HttpResponse.json(
      success({
        conversation: {
          id,
          title: conv.title,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      } as CreateConversationResp)
    )
  }),

  // DELETE /api/conversations/:id
  http.delete(`${API_BASE}/conversations/:id`, ({ params }) => {
    const id = params.id as string
    mockConversations.delete(id)
    return HttpResponse.json(success(null))
  }),

  // POST /api/canvas/chat
  http.post(`${API_BASE}/canvas/chat`, async ({ request }) => {
    await delay(2000)

    const formData = await request.formData()
    const conversationId = formData.get('conversationId') as string
    const message = formData.get('message') as string

    const conv = mockConversations.get(conversationId)
    if (!conv) return notFound('对话不存在')

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }
    conv.messages.push(userMsg)

    // Generate mock image
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    const generatedImage = {
      imageUrl: randomImage,
      suggestedPosition: { x: 400 + Math.random() * 200, y: 100 + Math.random() * 200 },
    }

    // Update title if first message
    if (conv.messages.length === 1) {
      conv.title = message.slice(0, 20) || '新对话'
    }
    conv.updatedAt = Date.now()

    // Add assistant message
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '已为您生成图片，查看画布上的效果。',
      timestamp: Date.now(),
    }
    conv.messages.push(assistantMsg)

    return HttpResponse.json(
      success({
        conversationId,
        message: assistantMsg,
        generatedImage,
      } as ChatMessageResp)
    )
  }),

  // POST /api/canvas/export
  http.post(`${API_BASE}/canvas/export`, async () => {
    await delay(3000)
    return HttpResponse.json(
      success({
        imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`,
      } as CanvasExportResp)
    )
  }),
]
