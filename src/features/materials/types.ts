export type MaterialType = 'image' | 'video'

export interface Material {
  id: string
  type: MaterialType
  url: string
  filename: string
  size: number
  tags: string[]
  createdAt: string
}

export interface CreateMaterialRequest {
  file: File
  tags?: string[]
}

export interface MaterialsFilter {
  tags?: string[]
  search?: string
}

export interface BatchUpdateTagsRequest {
  ids: string[]
  tags: string[]
  mode: 'add' | 'replace'
}
