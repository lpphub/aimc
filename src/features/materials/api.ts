import api from '@/lib/api'
import type {
  BatchUpdateTagsRequest,
  CreateMaterialRequest,
  Material,
  MaterialsFilter,
} from './types'

export const materialsApi = {
  list: (filter?: MaterialsFilter) => {
    const params = new URLSearchParams()
    if (filter?.tags?.length) params.set('tags', filter.tags.join(','))
    if (filter?.search) params.set('search', filter.search)
    const query = params.toString()
    return api.get<Material[]>(`materials${query ? `?${query}` : ''}`)
  },

  upload: (data: CreateMaterialRequest) => {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.tags?.length) {
      formData.append('tags', JSON.stringify(data.tags))
    }
    return api.post<Material>('materials', formData as unknown as Record<string, unknown>)
  },

  delete: (id: string) => api.delete<void>(`materials/${id}`),

  batchUpdateTags: (data: BatchUpdateTagsRequest) =>
    api.patch<Material[], BatchUpdateTagsRequest>('materials/batch-tags', data),

  getTags: () => api.get<string[]>('materials/tags'),
}
