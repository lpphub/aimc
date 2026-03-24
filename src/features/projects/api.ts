import api from '@/lib/api'
import type { CreateProjectReq, CreateWorkReq, Project, Work, WorksFilter } from './types'

export const worksApi = {
  list: (filter?: WorksFilter) => {
    const params = new URLSearchParams()
    if (filter?.projectId) params.set('projectId', filter.projectId)
    if (filter?.type) params.set('type', filter.type)
    if (filter?.search) params.set('search', filter.search)
    const query = params.toString()
    return api.get<Work[]>(`works${query ? `?${query}` : ''}`)
  },

  create: (data: CreateWorkReq) => api.post<Work, CreateWorkReq>('works', data),

  delete: (id: string) => api.delete<void>(`works/${id}`),
}

export const projectsApi = {
  list: () => api.get<Project[]>('projects'),
  create: (data: CreateProjectReq) => api.post<Project, CreateProjectReq>('projects', data),
}
