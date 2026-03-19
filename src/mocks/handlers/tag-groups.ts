import { delay, HttpResponse, http } from 'msw'
import type { Tag, TagGroup } from '@/features/materials/types'
import type { ApiResponse } from '@/lib/api'
import { getNextTagGroupId, getNextTagId, tagGroups } from '../db'

const API_BASE = '/api/'

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
      const newGroup: TagGroup = { id: getNextTagGroupId(), name: body.name, tags: [] }
      tagGroups.push(newGroup)
      return HttpResponse.json(success(newGroup))
    }
  ),

  http.delete<{ id: string }, never, ApiResponse<null>>(
    `${API_BASE}tag-groups/:id`,
    async ({ params }) => {
      await delay(100)
      const groupId = Number(params.id)
      const index = tagGroups.findIndex(g => g.id === groupId)
      if (index !== -1 && index > 0) {
        const [deletedGroup] = tagGroups.splice(index, 1)
        tagGroups[0].tags.push(...deletedGroup.tags)
      }
      return HttpResponse.json(success(null))
    }
  ),

  http.patch<{ id: string }, { name: string }, ApiResponse<TagGroup>>(
    `${API_BASE}tag-groups/:id`,
    async ({ params, request }) => {
      await delay(100)
      const groupId = Number(params.id)
      const body = await request.json()
      const group = tagGroups.find(g => g.id === groupId)
      if (group) {
        group.name = body.name
      }
      return HttpResponse.json(success(group!))
    }
  ),

  http.post<never, { name: string; groupId?: number }, ApiResponse<Tag>>(
    `${API_BASE}tags`,
    async ({ request }) => {
      await delay(100)
      const body = await request.json()
      const newTag: Tag = { id: getNextTagId(), name: body.name }
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
        const index = group.tags.findIndex(t => t.id === tagId)
        if (index !== -1) {
          group.tags.splice(index, 1)
        }
      }
      return HttpResponse.json(success(null))
    }
  ),

  http.patch<{ id: string }, { name: string }, ApiResponse<Tag>>(
    `${API_BASE}tags/:id`,
    async ({ params, request }) => {
      await delay(100)
      const tagId = Number(params.id)
      const body = await request.json()
      let updatedTag: Tag | null = null
      for (const group of tagGroups) {
        const tag = group.tags.find(t => t.id === tagId)
        if (tag) {
          tag.name = body.name
          updatedTag = tag
          break
        }
      }
      return HttpResponse.json(success(updatedTag!))
    }
  ),
]
