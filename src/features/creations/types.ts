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
  imageUrl: string
}

export interface OcrResp {
  text: string
  confidence: number
}
