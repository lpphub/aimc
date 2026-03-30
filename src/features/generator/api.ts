import api, { apiClient, unwrap } from '@/lib/api'
import type {
  CanvasExportReq,
  CanvasExportResp,
  ChatMessageReq,
  ChatMessageResp,
  Conversation,
  ConversationDetail,
  CreateConversationReq,
  CreateConversationResp,
} from './types'

export const generatorApi = {
  // 对话历史管理
  getConversations: () => api.get<Conversation[]>('conversations'),
  getConversation: (id: string) => api.get<ConversationDetail>(`conversations/${id}`),
  createConversation: (data: CreateConversationReq) =>
    api.post<CreateConversationResp>('conversations', data),
  deleteConversation: (id: string) => api.delete(`conversations/${id}`),

  // 发送消息
  sendMessage: async (data: ChatMessageReq): Promise<ChatMessageResp> => {
    const formData = new FormData()
    formData.append('message', data.message)
    formData.append('conversationId', data.conversationId)
    data.images?.forEach((file, index) => {
      formData.append(`images[${index}]`, file)
    })
    const res = await apiClient.post('canvas/chat', { body: formData })
    return unwrap<ChatMessageResp>(res)
  },

  // 导出画布
  exportCanvas: (data: CanvasExportReq) =>
    api.post<CanvasExportResp>('canvas/export', {
      items: data.items,
      format: data.format,
    }),
}
