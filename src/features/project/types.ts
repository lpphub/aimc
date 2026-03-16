export interface Project {
  id: string
  name: string
  description?: string
  tags: string[]
  presetTemplateIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  type: 'copy' | 'image' | 'video'
  content: string
}

export interface CreationRecord {
  id: string
  projectId: string
  type: 'copy' | 'image' | 'video' | 'mixed'
  title?: string
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}
