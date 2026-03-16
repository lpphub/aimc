import { delay, HttpResponse, http } from 'msw'
import type { Project } from '@/features/project/types'
import type { ApiResponse } from '@/lib/api'
import { generateId, projects } from '../db'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function error(message: string, code = 400): ApiResponse<null> {
  return { code, message, data: null as unknown as null }
}

export const projectHandlers = [
  // 获取项目列表
  http.get<never, never, ApiResponse<Project[]>>(`${API_BASE}/projects`, async () => {
    await delay(300)
    const projectList = Array.from(projects.values())
    return HttpResponse.json(success(projectList))
  }),

  // 获取单个项目
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

  // 创建项目
  http.post<never, { name: string; category?: string; tag?: string }, ApiResponse<Project>>(
    `${API_BASE}/projects`,
    async ({ request }) => {
      await delay(300)
      const body = await request.json()
      const { name, category = '未分类', tag = 'AI 漫画' } = body

      const now = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

      const newProject: Project = {
        id: generateId(),
        name,
        category,
        tag,
        createdAt: now,
        updatedAt: now,
      }

      projects.set(newProject.id, newProject)
      return HttpResponse.json(success(newProject))
    }
  ),

  // 更新项目
  http.put<{ id: string }, Partial<Project>, ApiResponse<Project | null>>(
    `${API_BASE}/projects/:id`,
    async ({ params, request }) => {
      await delay(300)
      const project = projects.get(params.id)
      if (!project) {
        return HttpResponse.json(error('项目不存在', 404))
      }

      const body = await request.json()
      const now = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })

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

  // 删除项目
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
]
