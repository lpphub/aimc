import type { WorkType } from '@/shared/types'

export type ToolType = WorkType

export interface GenerateTextReq {
  prompt: string
}

export interface GenerateTextResp {
  content: string
}

export interface GenerateImageReq {
  prompt: string
  aspectRatio: string
  engine?: string
}

export interface GenerateImageResp {
  imageUrl: string
}

export interface GenerateVideoReq {
  prompt: string
  engine?: string
}

export interface GenerateVideoResp {
  videoUrl: string
}
