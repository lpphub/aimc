import { HttpResponse, http } from 'msw'
import type { CreateWorkRequest, Work } from '@/features/portfolio/types'
import { mockWorks } from '../db'

export const portfolioHandlers = [
  http.get('/api/works', ({ request }) => {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const type = url.searchParams.get('type')
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

    return HttpResponse.json({ data: works })
  }),

  http.post('/api/works', async ({ request }) => {
    const body = (await request.json()) as CreateWorkRequest
    const newWork: Work = {
      id: String(mockWorks.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
    }
    mockWorks.push(newWork)
    return HttpResponse.json({ data: newWork })
  }),

  http.delete('/api/works/:id', ({ params }) => {
    const index = mockWorks.findIndex(w => w.id === params.id)
    if (index > -1) {
      mockWorks.splice(index, 1)
    }
    return HttpResponse.json({ data: null })
  }),
]
