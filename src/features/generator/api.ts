import api, { apiClient, unwrap } from '@/lib/api'
import type { CanvasExportReq, CanvasExportResp, ChatMessageReq, ChatMessageResp } from './types'

export const canvasGeneratorApi = {
  sendMessage: async (data: ChatMessageReq): Promise<ChatMessageResp> => {
    const formData = new FormData()
    formData.append('message', data.message)
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId)
    }
    if (data.image) {
      formData.append('image', data.image)
    }

    const res = await apiClient.post('canvas/chat', { body: formData })
    return unwrap<ChatMessageResp>(res)
  },

  exportCanvas: (data: CanvasExportReq) =>
    api.post<CanvasExportResp>('canvas/export', {
      items: data.items,
      format: data.format,
    }),
}
