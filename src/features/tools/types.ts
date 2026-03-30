export type ToolType = 'ocr'

export interface OcrReq {
  imageUrl?: string
  file?: File
}

export interface OcrResp {
  text: string
  confidence: number
}
