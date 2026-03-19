export type WorkType = 'text' | 'image' | 'video'

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

export interface CreateWorkRequest {
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
