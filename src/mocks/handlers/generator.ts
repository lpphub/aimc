import { delay, HttpResponse, http } from 'msw'
import type { CanvasExportResp, ChatMessageResp } from '@/features/generator/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

export const generatorHandlers = [
  http.post<never, never, ApiResponse<ChatMessageResp>>(
    `${API_BASE}/canvas/chat`,
    async ({ request }) => {
      await delay(2000)

      const contentType = request.headers.get('content-type') || ''
      let message = ''
      let hasImage = false

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        message = (formData.get('message') as string) || ''
        hasImage = !!formData.get('image')
      } else {
        const body = (await request.json()) as { message?: string }
        message = body.message || ''
      }

      const conversationId = `conv_${Date.now()}`
      let responseContent = ''
      let generatedImage:
        | { imageUrl: string; suggestedPosition: { x: number; y: number } }
        | undefined

      if (hasImage && message) {
        responseContent = `我注意到您上传的图片。根据您的需求"${message}"，我可以帮您：\n\n• 生成场景展示图\n• 制作卖点营销图\n• 生成白底商品图\n• 调整图片风格和色调\n\n请问您希望生成哪种类型的图片？`
      } else if (hasImage) {
        responseContent = `我注意到您上传的图片。\n\n商品套图制作需要基于商品本身的图片来生成各种展示图（如场景图、卖点图、A+图等）。\n\n请问您：\n• 是否需要重新上传商品图片？\n• 还是您希望我基于文字描述直接生成图片？`
      } else if (message.includes('场景')) {
        responseContent =
          '好的，我将为您生成场景展示图。这是一个展示商品在实际使用场景中的图片，有助于提升转化率。'
        generatedImage = {
          imageUrl: `https://picsum.photos/400/600?random=${Date.now()}`,
          suggestedPosition: { x: 400, y: 100 },
        }
      } else if (message.includes('卖点')) {
        responseContent = '正在为您生成卖点营销图，突出商品的核心优势。'
        generatedImage = {
          imageUrl: `https://picsum.photos/400/600?random=${Date.now() + 1}`,
          suggestedPosition: { x: 420, y: 120 },
        }
      } else if (message.includes('白底')) {
        responseContent = '好的，我将为您生成专业的白底商品图，适合电商平台使用。'
        generatedImage = {
          imageUrl: `https://picsum.photos/400/600?random=${Date.now() + 2}`,
          suggestedPosition: { x: 440, y: 140 },
        }
      } else {
        responseContent = `收到您的需求："${message}"\n\n我可以帮您：\n• 基于上传的商品图生成场景图\n• 制作卖点营销图\n• 生成白底图、A+图等多种类型\n\n请上传商品图片或告诉我您需要的具体效果。`
      }

      return HttpResponse.json(
        success({
          conversationId,
          message: {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: responseContent,
            timestamp: Date.now(),
          },
          generatedImage,
        })
      )
    }
  ),

  http.post<never, never, ApiResponse<CanvasExportResp>>(`${API_BASE}/canvas/export`, async () => {
    await delay(3000)

    return HttpResponse.json(
      success({
        imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`,
      })
    )
  }),
]
