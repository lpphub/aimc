import api, { apiClient, unwrap } from '@/lib/api'
import type {
  BatchUpdateTagsRequest,
  CreateMaterialRequest,
  Material,
  MaterialsFilter,
} from './types'

export async function getMaterials(filter?: MaterialsFilter): Promise<Material[]> {
  const params = new URLSearchParams()
  if (filter?.tags?.length) {
    params.set('tags', filter.tags.join(','))
  }
  if (filter?.search) {
    params.set('search', filter.search)
  }
  const query = params.toString()
  return api.get<Material[]>(`materials${query ? `?${query}` : ''}`)
}

export async function uploadMaterial(data: CreateMaterialRequest): Promise<Material> {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.tags?.length) {
    formData.append('tags', JSON.stringify(data.tags))
  }
  const res = await apiClient.post('materials', { body: formData })
  return unwrap<Material>(res)
}

export async function deleteMaterial(id: string): Promise<void> {
  return api.delete<void>(`materials/${id}`)
}

export async function batchUpdateTags(data: BatchUpdateTagsRequest): Promise<Material[]> {
  return api.patch<Material[]>('materials/batch-tags', data)
}

export async function getMaterialTags(): Promise<string[]> {
  return api.get<string[]>('materials/tags')
}
