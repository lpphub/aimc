import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { creationsApi } from '../api'
import type { GeneratePosterReq, GenerateTextReq, OcrReq } from '../types'

export const creationsKeys = {
  all: ['creations'] as const,
}

export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => creationsApi.generateText(data),
    onError: createMutationErrorHandler('文案生成失败'),
  })
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => creationsApi.ocr(data),
    onError: createMutationErrorHandler('文字提取失败'),
  })
}

export function useGeneratePoster() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, file }: { data: GeneratePosterReq; file?: File }) =>
      creationsApi.generatePoster(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creationsKeys.all })
    },
    onError: createMutationErrorHandler('海报生成失败'),
  })
}
