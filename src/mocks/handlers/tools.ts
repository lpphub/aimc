import { delay, HttpResponse, http } from 'msw'
import type { OcrResp } from '@/features/tools/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function badRequest<T = null>(message: string) {
  return HttpResponse.json<ApiResponse<T>>({ code: 400, message, data: null as T }, { status: 400 })
}

function serverError<T = null>(message: string) {
  return HttpResponse.json<ApiResponse<T>>({ code: 500, message, data: null as T }, { status: 500 })
}

const shouldFailRandomly = () => Math.random() < 0.1

export const toolsHandlers = [
  http.post<never, { imageUrl?: string }, ApiResponse<OcrResp>>(
    `${API_BASE}/tools/ocr`,
    async ({ request }) => {
      await delay(5000)

      const contentType = request.headers.get('content-type') || ''
      let hasValidInput = false

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        hasValidInput = !!file && file.size > 0
      } else {
        const body = await request.json()
        hasValidInput = !!body.imageUrl?.trim()
      }

      if (!hasValidInput) {
        return badRequest('请上传图片或提供图片链接')
      }

      if (shouldFailRandomly()) {
        return serverError('服务暂时不可用，请重试')
      }

      return HttpResponse.json(
        success({
          text: `项目名称：极光边缘计算节点架构设计

核心目标：构建可大规模部署的合成智能网络

此文档包含机密数据，仅供内部审阅。`,
          confidence: 0.97,
        })
      )
    }
  ),
]