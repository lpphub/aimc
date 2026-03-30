import { apiClient, unwrap } from '@/lib/api'
import type { OcrReq, OcrResp } from './types'

export const toolsApi = {
  ocr: async (data: OcrReq): Promise<OcrResp> => {
    if (!data.file && !data.imageUrl) {
      throw new Error('请上传文件或提供图片地址')
    }

    if (data.file) {
      const formData = new FormData()
      formData.append('file', data.file)
      if (data.imageUrl) formData.append('imageUrl', data.imageUrl)
      const res = await apiClient.post('tools/ocr', { body: formData })
      return unwrap<OcrResp>(res)
    }

    const res = await apiClient.post('tools/ocr', { json: { imageUrl: data.imageUrl } })
    return unwrap<OcrResp>(res)
  },
}
