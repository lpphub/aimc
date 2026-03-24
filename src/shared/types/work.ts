export type WorkType = 'text' | 'image' | 'ocr'

export interface Project {
  id: string
  name: string
  description?: string
  tags: string[]
  presetTemplateIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Work {
  id: string
  projectId?: string
  projectName?: string
  type: WorkType
  content: string
  prompt: string
  engine?: string
  createdAt: string
}

export interface CreateWorkReq {
  projectId?: string
  type: WorkType
  content: string
  prompt: string
  engine?: string
}

export interface WorksFilter {
  projectId?: string
  type?: WorkType
  search?: string
}

export interface CreateProjectReq {
  name: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export interface Template {
  id: string
  name: string
  type: 'copy' | 'image' | 'ocr'
  content: string
}

export interface CreationRecord {
  id: string
  projectId: string
  type: 'copy' | 'image' | 'ocr'
  title: string
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}
