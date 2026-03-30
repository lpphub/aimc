import { useMutation } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { toolsApi } from '../api'
import type { OcrReq } from '../types'

export const toolsKeys = {
  all: ['tools'] as const,
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => toolsApi.ocr(data),
    onError: createMutationErrorHandler('文字提取失败'),
  })
}
