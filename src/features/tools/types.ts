export type ToolType = 'text' | 'image' | 'ocr'

export type BrandTone = '专业严谨' | '风趣幽默' | '极简主义' | '煽动性强'

export type AspectRatio = '9:16' | '3:4' | '1:1'

export type PosterStyle = 'cyberpunk' | 'minimalist' | 'hyperreal'

export interface GenerateTextReq {
  prompt: string
  productDesc?: string
  targetAudience?: string
  tone?: BrandTone
}

export interface GenerateTextResp {
  content: string
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
  aspectRatio: AspectRatio
  colorTone: string
  style: PosterStyle
}

export interface GeneratePosterResp {
  imageUrl: string
}
