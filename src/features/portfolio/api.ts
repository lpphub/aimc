import api from '@/lib/api'
import type { CreateWorkRequest, Project, Work, WorksFilter } from './types'

export interface CreateProjectReq {
  name: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export const portfolioApi = {
  list: (filter?: WorksFilter) => {
    const params = new URLSearchParams()
    if (filter?.projectId) params.set('projectId', filter.projectId)
    if (filter?.type) params.set('type', filter.type)
    if (filter?.search) params.set('search', filter.search)
    const query = params.toString()
    return api.get<Work[]>(`works${query ? `?${query}` : ''}`)
  },

  create: (data: CreateWorkRequest) => api.post<Work, CreateWorkRequest>('works', data),

  delete: (id: string) => api.delete<void>(`works/${id}`),
}

export const projectApi = {
  list: () => api.get<Project[]>('projects'),
}
