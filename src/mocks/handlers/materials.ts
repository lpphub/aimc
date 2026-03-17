import { HttpResponse, http } from 'msw'
import type { Material } from '@/features/materials/types'
import type { ApiResponse } from '@/lib/api'
import { generateId, materials } from '../db'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

export const materialsHandlers = [
  http.get<never, never, ApiResponse<Material[]>>(`${API_BASE}/materials`, ({ request }) => {
    const url = new URL(request.url)
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean)
    const search = url.searchParams.get('search')

    let result = [...materials]

    if (tags?.length) {
      result = result.filter(m => tags.some(tag => m.tags.includes(tag)))
    }
    if (search) {
      result = result.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()))
    }

    return HttpResponse.json(success(result))
  }),

  http.post<never, never, ApiResponse<Material>>(`${API_BASE}/materials`, async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tagsStr = formData.get('tags') as string | null
    const tags = tagsStr ? JSON.parse(tagsStr) : []

    const material: Material = {
      id: generateId(),
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
      tags,
      createdAt: new Date().toISOString(),
    }
    materials.push(material)
    return HttpResponse.json(success(material))
  }),

  http.delete<{ id: string }, never, ApiResponse<null>>(
    `${API_BASE}/materials/:id`,
    ({ params }) => {
      const index = materials.findIndex(m => m.id === params.id)
      if (index !== -1) {
        materials.splice(index, 1)
      }
      return HttpResponse.json(success(null))
    }
  ),

  http.patch<
    never,
    { ids: string[]; tags: string[]; mode: 'add' | 'replace' },
    ApiResponse<Material[]>
  >(`${API_BASE}/materials/batch-tags`, async ({ request }) => {
    const { ids, tags, mode } = await request.json()
    const updated: Material[] = []

    for (const id of ids) {
      const material = materials.find(m => m.id === id)
      if (material) {
        if (mode === 'replace') {
          material.tags = tags
        } else {
          material.tags = [...new Set([...material.tags, ...tags])]
        }
        updated.push(material)
      }
    }

    return HttpResponse.json(success(updated))
  }),

  http.get<never, never, ApiResponse<string[]>>(`${API_BASE}/materials/tags`, () => {
    const allTags = new Set<string>()
    materials.forEach(m => {
      m.tags.forEach(t => {
        allTags.add(t)
      })
    })
    return HttpResponse.json(success([...allTags]))
  }),
]
