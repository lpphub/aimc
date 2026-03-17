import { apiClient } from '@/lib/api'
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
  const res = await apiClient.get(`materials${query ? `?${query}` : ''}`)
  return res.json<{ data: Material[] }>().then(r => r.data)
}

export async function uploadMaterial(data: CreateMaterialRequest): Promise<Material> {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.tags?.length) {
    formData.append('tags', JSON.stringify(data.tags))
  }
  const res = await apiClient.post('materials', { body: formData })
  return res.json<{ data: Material }>().then(r => r.data)
}

export async function deleteMaterial(id: string): Promise<void> {
  await apiClient.delete(`materials/${id}`)
}

export async function batchUpdateTags(data: BatchUpdateTagsRequest): Promise<Material[]> {
  const res = await apiClient.patch('materials/batch-tags', { json: data })
  return res.json<{ data: Material[] }>().then(r => r.data)
}

export async function getMaterialTags(): Promise<string[]> {
  const res = await apiClient.get('materials/tags')
  return res.json<{ data: string[] }>().then(r => r.data)
}
