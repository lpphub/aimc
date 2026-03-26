import api, { apiClient, unwrap } from '@/lib/api'
import type {
  GeneratePosterReq,
  GeneratePosterResp,
  GenerateTextReq,
  GenerateTextResp,
  OcrReq,
  OcrResp,
} from './types'

export const creationsApi = {
  generateText: (data: GenerateTextReq) => api.post<GenerateTextResp>('creations/text', data),

  ocr: async (data: OcrReq): Promise<OcrResp> => {
    if (!data.file && !data.imageUrl) {
      throw new Error('请上传文件或提供图片地址')
    }

    if (data.file) {
      const formData = new FormData()
      formData.append('file', data.file)
      if (data.imageUrl) formData.append('imageUrl', data.imageUrl)
      const res = await apiClient.post('creations/ocr', { body: formData })
      return unwrap<OcrResp>(res)
    }

    const res = await apiClient.post('creations/ocr', { json: { imageUrl: data.imageUrl } })
    return unwrap<OcrResp>(res)
  },

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
