export type ToolType = 'text' | 'image' | 'ocr'

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

export interface OcrReq {
  imageUrl?: string
  file?: File
}

export interface OcrResp {
  text: string
  confidence: number
}

export interface GeneratePosterReq {
  prompt: string
  aspectRatio: string
  colorTone: string
  style: string
}

export interface GeneratePosterResp {
  imageUrl: string
}
