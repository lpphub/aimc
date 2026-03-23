import api from '@/lib/api'
import type {
  GenerateImageReq,
  GenerateImageResp,
  GenerateTextReq,
  GenerateTextResp,
  GenerateVideoReq,
  GenerateVideoResp,
} from './types'

export const aiToolsApi = {
  generateText: (data: GenerateTextReq) => api.post<GenerateTextResp>('ai-tools/text', data),

  generateImage: (data: GenerateImageReq) => api.post<GenerateImageResp>('ai-tools/image', data),

  generateVideo: (data: GenerateVideoReq) => api.post<GenerateVideoResp>('ai-tools/video', data),
}
