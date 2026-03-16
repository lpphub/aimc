import type { CreationRecord, Project, Template } from '@/features/project/types'
import api from '@/lib/api'

export interface CreateProjectReq {
  name: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export interface UpdateProjectReq {
  name?: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export interface CreateRecordReq {
  type: 'copy' | 'image' | 'video' | 'mixed'
  title?: string
  content: string
  metadata?: Record<string, unknown>
}

export interface UpdateRecordReq {
  title?: string
  content?: string
  metadata?: Record<string, unknown>
}

export const projectApi = {
  list: () => api.get<Project[]>('projects'),
  get: (id: string) => api.get<Project>(`projects/${id}`),
  create: (data: CreateProjectReq) => api.post<Project, CreateProjectReq>('projects', data),
  update: (id: string, data: UpdateProjectReq) =>
    api.put<Project, UpdateProjectReq>(`projects/${id}`, data),
  delete: (id: string) => api.delete<null>(`projects/${id}`),
}

export const templateApi = {
  list: (type?: 'copy' | 'image' | 'video') => {
    const params = type ? { type } : undefined
    return api.get<Template[]>('templates', params)
  },
}

export const recordApi = {
  list: (projectId: string) => api.get<CreationRecord[]>(`projects/${projectId}/records`),
  create: (projectId: string, data: CreateRecordReq) =>
    api.post<CreationRecord, CreateRecordReq>(`projects/${projectId}/records`, data),
  get: (projectId: string, id: string) =>
    api.get<CreationRecord>(`projects/${projectId}/records/${id}`),
  update: (projectId: string, id: string, data: UpdateRecordReq) =>
    api.put<CreationRecord, UpdateRecordReq>(`projects/${projectId}/records/${id}`, data),
  delete: (projectId: string, id: string) =>
    api.delete<null>(`projects/${projectId}/records/${id}`),
}
