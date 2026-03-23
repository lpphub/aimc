import api, { apiClient } from '@/lib/api'
import type {
  BatchUpdateTagsRequest,
  CreateMaterialRequest,
  Material,
  MaterialsFilter,
  Tag,
  TagGroup,
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
  const json = await res.json<{ code: number; message: string; data: Material }>()
  if (json.code !== 0) throw new Error(json.message)
  return json.data
}

export async function deleteMaterial(id: string): Promise<void> {
  await api.delete(`materials/${id}`)
}

export async function batchUpdateTags(data: BatchUpdateTagsRequest): Promise<Material[]> {
  return api.patch<Material[]>('materials/batch-tags', data)
}

export async function getMaterialTags(): Promise<string[]> {
  return api.get<string[]>('materials/tags')
}

export async function getTagGroups(): Promise<TagGroup[]> {
  return api.get<TagGroup[]>('tag-groups')
}

export async function createTagGroup(name: string): Promise<TagGroup> {
  return api.post<TagGroup, { name: string }>('tag-groups', { name })
}

export async function updateTagGroup(groupId: number, name: string): Promise<TagGroup> {
  return api.patch<TagGroup, { name: string }>(`tag-groups/${groupId}`, { name })
}

export async function deleteTagGroup(groupId: number): Promise<void> {
  return api.delete(`tag-groups/${groupId}`)
}

export async function createTag(name: string, groupId?: number): Promise<Tag> {
  return api.post<Tag, { name: string; groupId?: number }>('tags', { name, groupId })
}

export async function updateTag(tagId: number, name: string): Promise<Tag> {
  return api.patch<Tag, { name: string }>(`tags/${tagId}`, { name })
}

export async function deleteTag(tagId: number): Promise<void> {
  await api.delete(`tags/${tagId}`)
}

export async function addTagsToMaterials(params: {
  materialIds: string[]
  tagIds: number[]
}): Promise<void> {
  return api.post<void, typeof params>('materials/tags', params)
}
