export type WorkType = 'text' | 'image' | 'video'

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
