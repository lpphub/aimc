import { delay, HttpResponse, http } from 'msw'
import type { CreationRecord, Project, Template } from '@/features/projects/types'
import type { ApiResponse } from '@/lib/api'
import { generateId, projects, records, templates } from '../db'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function error(message: string, code = 400): ApiResponse<null> {
  return { code, message, data: null as unknown as null }
}

export const projectHandlers = [
  // Projects
  http.get<never, never, ApiResponse<Project[]>>(`${API_BASE}/projects`, async () => {
    await delay(300)
    const projectList = Array.from(projects.values())
    return HttpResponse.json(success(projectList))
  }),

  http.get<{ id: string }, never, ApiResponse<Project | null>>(
    `${API_BASE}/projects/:id`,
    async ({ params }) => {
      await delay(200)
      const project = projects.get(params.id)
      if (!project) {
        return HttpResponse.json(error('项目不存在', 404))
      }
      return HttpResponse.json(success(project))
    }
  ),

  http.post<never, Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, ApiResponse<Project>>(
    `${API_BASE}/projects`,
    async ({ request }) => {
      await delay(300)
      const body = await request.json()
      const now = new Date().toISOString().split('T')[0]

      const newProject: Project = {
        id: generateId(),
        name: body.name,
        description: body.description,
        tags: body.tags || [],
        presetTemplateIds: body.presetTemplateIds || [],
        createdAt: now,
        updatedAt: now,
      }

      projects.set(newProject.id, newProject)
      return HttpResponse.json(success(newProject))
    }
  ),

  http.put<{ id: string }, Partial<Project>, ApiResponse<Project | null>>(
    `${API_BASE}/projects/:id`,
    async ({ params, request }) => {
      await delay(300)
      const project = projects.get(params.id)
      if (!project) {
        return HttpResponse.json(error('项目不存在', 404))
      }

      const body = await request.json()
      const now = new Date().toISOString().split('T')[0]

      const updatedProject: Project = {
        ...project,
        ...body,
        id: project.id,
        updatedAt: now,
      }

      projects.set(params.id, updatedProject)
      return HttpResponse.json(success(updatedProject))
    }
  ),

  http.delete<{ id: string }, never, ApiResponse<null>>(
    `${API_BASE}/projects/:id`,
    async ({ params }) => {
      await delay(200)
      const deleted = projects.delete(params.id)
      if (!deleted) {
        return HttpResponse.json(error('项目不存在', 404))
      }
      return HttpResponse.json(success(null))
    }
  ),

  // Templates
  http.get<never, never, ApiResponse<Template[]>>(`${API_BASE}/templates`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as 'copy' | 'image' | 'video' | null
    const templateList = Array.from(templates.values())
    const filtered = type ? templateList.filter(t => t.type === type) : templateList
    return HttpResponse.json(success(filtered))
  }),

  // Records
  http.get<{ projectId: string }, never, ApiResponse<CreationRecord[]>>(
    `${API_BASE}/projects/:projectId/records`,
    async ({ params }) => {
      await delay(200)
      const recordList = Array.from(records.values()).filter(r => r.projectId === params.projectId)
      return HttpResponse.json(success(recordList))
    }
  ),

  http.post<
    { projectId: string },
    Omit<CreationRecord, 'id' | 'projectId' | 'createdAt'>,
    ApiResponse<CreationRecord>
  >(`${API_BASE}/projects/:projectId/records`, async ({ params, request }) => {
    await delay(300)
    const body = await request.json()
    const now = new Date().toISOString().split('T')[0]

    const newRecord: CreationRecord = {
      id: `r${Date.now()}`,
      projectId: params.projectId,
      type: body.type,
      title: body.title,
      content: body.content,
      metadata: body.metadata,
      createdAt: now,
    }

    records.set(newRecord.id, newRecord)
    return HttpResponse.json(success(newRecord))
  }),

  http.get<{ projectId: string; id: string }, never, ApiResponse<CreationRecord | null>>(
    `${API_BASE}/projects/:projectId/records/:id`,
    async ({ params }) => {
      await delay(200)
      const record = records.get(params.id)
      if (!record || record.projectId !== params.projectId) {
        return HttpResponse.json(error('记录不存在', 404))
      }
      return HttpResponse.json(success(record))
    }
  ),

  http.put<
    { projectId: string; id: string },
    Partial<CreationRecord>,
    ApiResponse<CreationRecord | null>
  >(`${API_BASE}/projects/:projectId/records/:id`, async ({ params, request }) => {
    await delay(300)
    const record = records.get(params.id)
    if (!record || record.projectId !== params.projectId) {
      return HttpResponse.json(error('记录不存在', 404))
    }

    const body = await request.json()
    const updatedRecord: CreationRecord = {
      ...record,
      ...body,
      id: record.id,
      projectId: record.projectId,
    }

    records.set(params.id, updatedRecord)
    return HttpResponse.json(success(updatedRecord))
  }),

  http.delete<{ projectId: string; id: string }, never, ApiResponse<null>>(
    `${API_BASE}/projects/:projectId/records/:id`,
    async ({ params }) => {
      await delay(200)
      const record = records.get(params.id)
      if (!record || record.projectId !== params.projectId) {
        return HttpResponse.json(error('记录不存在', 404))
      }
      records.delete(params.id)
      return HttpResponse.json(success(null))
    }
  ),

  // Tags
  http.get<never, never, ApiResponse<string[]>>(`${API_BASE}/tags`, async () => {
    await delay(200)
    const presetTags = ['小红书', '短视频', '抖音', '品牌', '文案', '营销', '推广', '电商']
    return HttpResponse.json(success(presetTags))
  }),
]
