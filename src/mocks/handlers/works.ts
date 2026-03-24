import { delay, HttpResponse, http } from 'msw'
import type { CreateWorkReq, Work } from '@/features/projects/types'
import type { ApiResponse } from '@/lib/api'
import { mockWorks } from '../db'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function error(message: string, code = 400): ApiResponse<null> {
  return { code, message, data: null as unknown as null }
}

export const worksHandlers = [
  http.get<never, never, ApiResponse<Work[]>>(`${API_BASE}/works`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const type = url.searchParams.get('type') as 'text' | 'image' | 'ocr' | null
    const search = url.searchParams.get('search')

    let works = [...mockWorks]

    if (projectId) {
      works = works.filter(w => w.projectId === projectId)
    }
    if (type) {
      works = works.filter(w => w.type === type)
    }
    if (search) {
      works = works.filter(
        w =>
          w.prompt.toLowerCase().includes(search.toLowerCase()) ||
          w.content.toLowerCase().includes(search.toLowerCase())
      )
    }

    return HttpResponse.json(success(works))
  }),

  http.post<never, CreateWorkReq, ApiResponse<Work>>(`${API_BASE}/works`, async ({ request }) => {
    await delay(300)
    const body = await request.json()
    const newWork: Work = {
      id: `w${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    mockWorks.push(newWork)
    return HttpResponse.json(success(newWork))
  }),

  http.delete<{ id: string }, never, ApiResponse<null>>(
    `${API_BASE}/works/:id`,
    async ({ params }) => {
      await delay(200)
      const index = mockWorks.findIndex(w => w.id === params.id)
      if (index === -1) {
        return HttpResponse.json(error('作品不存在', 404))
      }
      mockWorks.splice(index, 1)
      return HttpResponse.json(success(null))
    }
  ),
]
