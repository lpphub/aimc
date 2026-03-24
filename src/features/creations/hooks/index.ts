import { useMutation } from '@tanstack/react-query'
import { creationsApi } from '../api'
import type { GenerateImageReq, GenerateTextReq, OcrReq } from '../types'

export const creationsKeys = {
  all: ['creations'] as const,
}

export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => creationsApi.generateText(data),
  })
}

export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => creationsApi.generateImage(data),
  })
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => creationsApi.ocr(data),
  })
}
