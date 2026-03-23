import { useMutation } from '@tanstack/react-query'
import { aiToolsApi } from '../api'
import type { GenerateImageReq, GenerateTextReq, GenerateVideoReq } from '../types'

export const aiToolsKeys = {
  all: ['ai-tools'] as const,
}

export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => aiToolsApi.generateText(data),
  })
}

export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => aiToolsApi.generateImage(data),
  })
}

export function useGenerateVideo() {
  return useMutation({
    mutationFn: (data: GenerateVideoReq) => aiToolsApi.generateVideo(data),
  })
}
