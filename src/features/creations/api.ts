import api, { apiClient, unwrap } from '@/lib/api'
import type {
  GenerateImageReq,
  GenerateImageResp,
  GeneratePosterReq,
  GeneratePosterResp,
  GenerateTextReq,
  GenerateTextResp,
  OcrReq,
  OcrResp,
} from './types'

export const creationsApi = {
  generateText: (data: GenerateTextReq) => api.post<GenerateTextResp>('creations/text', data),

  generateImage: (data: GenerateImageReq) => api.post<GenerateImageResp>('creations/image', data),

  ocr: (data: OcrReq) => api.post<OcrResp>('creations/ocr', data),

  generatePoster: async (data: GeneratePosterReq, file?: File): Promise<GeneratePosterResp> => {
    const formData = new FormData()
    formData.append('prompt', data.prompt)
    formData.append('aspectRatio', data.aspectRatio)
    formData.append('colorTone', data.colorTone)
    formData.append('style', data.style)
    if (file) {
      formData.append('file', file)
    }
    const res = await apiClient.post('creations/poster', { body: formData })
    return unwrap<GeneratePosterResp>(res)
  },
}
