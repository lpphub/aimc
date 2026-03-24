import api from '@/lib/api'
import type {
  GenerateImageReq,
  GenerateImageResp,
  GenerateTextReq,
  GenerateTextResp,
  OcrReq,
  OcrResp,
} from './types'

export const creationsApi = {
  generateText: (data: GenerateTextReq) => api.post<GenerateTextResp>('creations/text', data),

  generateImage: (data: GenerateImageReq) => api.post<GenerateImageResp>('creations/image', data),

  ocr: (data: OcrReq) => api.post<OcrResp>('creations/ocr', data),
}
