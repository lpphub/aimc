import { delay, HttpResponse, http } from 'msw'
import type { GeneratePosterResp, GenerateTextResp, OcrResp } from '@/features/tools/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function errorResponse<T = null>(code: number, message: string, status: number) {
  return HttpResponse.json<ApiResponse<T>>({ code, message, data: null as T }, { status })
}

function badRequest<T = null>(message: string) {
  return errorResponse<T>(400, message, 400)
}

function serverError<T = null>(message: string) {
  return errorResponse<T>(500, message, 500)
}

const shouldFailRandomly = () => Math.random() < 0.1

export const toolsHandlers = [
  http.post<never, { prompt: string }, ApiResponse<GenerateTextResp>>(
    `${API_BASE}/creations/text`,
    async ({ request }) => {
      await delay(3000)
      const { prompt } = await request.json()

      if (!prompt?.trim()) {
        return badRequest('请输入提示词')
      }

      if (shouldFailRandomly()) {
        return serverError('服务暂时不可用，请重试')
      }

      return HttpResponse.json(
        success({
          content: `【产品核心文案】\n\n基于您的输入: "${prompt}"\n\n在瞬息万变的数字时代，我们重新定义了智能交互的边界。这不仅仅是一款产品，更是一次对未来生活方式的大胆预演。\n\n【核心卖点】\n• 零延迟响应，毫秒级处理能力\n• 跨平台无缝同步，随时随地保持连接\n• AI 驱动的个性化推荐引擎\n\n【行动号召】\n立即体验未来科技，开启您的智能生活新篇章。限量首发，尊享早鸟优惠。`,
        })
      )
    }
  ),

  http.post<never, { imageUrl?: string }, ApiResponse<OcrResp>>(
    `${API_BASE}/creations/ocr`,
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
          text: `项目名称：极光边缘计算节点架构设计 (Project Aurora-Edge)\n\n核心目标：构建可大规模部署的合成智能网络，实现低延迟数据提取与自动标注。\n\n硬件需求：\n  - Lumina NPU 系列核心处理器 x4\n  - 高带宽内存存储系统 (64GB HBM3)\n  - 超导液冷散热阵列\n\n合规性：符合 ISO/IEC 42001 人工智能管理体系标准。\n\n此文档包含机密数据，仅供内部架构委员会审阅。未经授权禁止分发或进行逆向工程分析。`,
          confidence: 0.97,
        })
      )
    }
  ),

  http.post<never, never, ApiResponse<GeneratePosterResp>>(
    `${API_BASE}/creations/poster`,
    async ({ request }) => {
      await delay(6000)
      const formData = await request.formData()
      const prompt = formData.get('prompt') as string
      const aspectRatio = formData.get('aspectRatio') as string
      const colorTone = formData.get('colorTone') as string
      const style = formData.get('style') as string
      const file = formData.get('file') as File | null

      if (!prompt?.trim()) {
        return badRequest('请输入提示词')
      }

      if (shouldFailRandomly()) {
        return serverError('服务暂时不可用，请重试')
      }

      console.log('[Mock] Poster generation:', {
        prompt,
        aspectRatio,
        colorTone,
        style,
        hasFile: !!file,
      })

      const [w, h] = aspectRatio.split(':').map(Number)
      const width = 400
      const height = Math.round((width * h) / w)

      return HttpResponse.json(
        success({
          imageUrl: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
        })
      )
    }
  ),
]
