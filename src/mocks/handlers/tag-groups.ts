import { delay, HttpResponse, http } from 'msw'
import type { ApiResponse } from '@/lib/api'
import { env } from '@/shared/utils/env'

const API_BASE = `${env.API_BASE_URL}/`

interface Tag {
  id: number
  name: string
}

interface TagGroup {
  id: number
  name: string
  tags: Tag[]
}

const tagGroups: TagGroup[] = [
  {
    id: 1,
    name: '默认标签组',
    tags: [
      { id: 1, name: '风景' },
      { id: 2, name: '人物' },
    ],
  },
  {
    id: 2,
    name: '风格',
    tags: [
      { id: 3, name: '简约' },
      { id: 4, name: '复古' },
    ],
  },
]

let nextTagGroupId = 3
let nextTagId = 5

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

export const tagGroupHandlers = [
  http.get<never, never, ApiResponse<TagGroup[]>>(`${API_BASE}tag-groups`, async () => {
    await delay(100)
    return HttpResponse.json(success(tagGroups))
  }),

  http.post<never, { name: string }, ApiResponse<TagGroup>>(
    `${API_BASE}tag-groups`,
    async ({ request }) => {
      await delay(100)
      const body = await request.json()
      const newGroup: TagGroup = { id: nextTagGroupId++, name: body.name, tags: [] }
      tagGroups.push(newGroup)
      return HttpResponse.json(success(newGroup))
    }
  ),

  http.post<never, { name: string; groupId?: number }, ApiResponse<Tag>>(
    `${API_BASE}tags`,
    async ({ request }) => {
      await delay(100)
      const body = await request.json()
      const newTag: Tag = { id: nextTagId++, name: body.name }
      const group = tagGroups.find(g => g.id === body.groupId) ?? tagGroups[0]
      group.tags.push(newTag)
      return HttpResponse.json(success(newTag))
    }
  ),

  http.delete<{ id: string }, never, ApiResponse<null>>(
    `${API_BASE}tags/:id`,
    async ({ params }) => {
      await delay(100)
      const tagId = Number(params.id)
      for (const group of tagGroups) {
        group.tags = group.tags.filter(t => t.id !== tagId)
      }
      return HttpResponse.json(success(null))
    }
  ),

  http.post<never, never, ApiResponse<null>>(`${API_BASE}materials/tags`, async () => {
    await delay(100)
    return HttpResponse.json(success(null))
  }),
]
