import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { creationsApi } from '../api'
import type { GenerateImageReq, GeneratePosterReq, GenerateTextReq, OcrReq } from '../types'

export const creationsKeys = {
  all: ['creations'] as const,
}

export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => creationsApi.generateText(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '文案生成失败'
      toast.error(message)
    },
  })
}

export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => creationsApi.generateImage(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '图片生成失败'
      toast.error(message)
    },
  })
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => creationsApi.ocr(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '文字提取失败'
      toast.error(message)
    },
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
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '海报生成失败'
      toast.error(message)
    },
  })
}
