import type { Project } from '@/features/project/types'
import api from '@/lib/api'

export interface CreateProjectReq {
  name: string
  category?: string
  tag?: string
}

export interface UpdateProjectReq {
  name?: string
  category?: string
  tag?: string
}

export const projectApi = {
  list: () => api.get<Project[]>('projects'),
  get: (id: string) => api.get<Project>(`projects/${id}`),
  create: (data: CreateProjectReq) => api.post<Project, CreateProjectReq>('projects', data),
  update: (id: string, data: UpdateProjectReq) =>
    api.put<Project, UpdateProjectReq>(`projects/${id}`, data),
  delete: (id: string) => api.delete<null>(`projects/${id}`),
}
