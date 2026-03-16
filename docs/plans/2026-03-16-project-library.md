# 项目库重构实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构项目功能，将项目从漫画/章节模型转换为通用创作空间，支持预设素材模板和创作记录管理。

**Architecture:** 采用单表聚合模型，Project 独立管理项目和模板关联，CreationRecord 独立管理创作记录。前端使用 TanStack Query 进行数据管理，Zustand 管理客户端状态。

**Tech Stack:** React 19, TypeScript, TanStack Query, Zustand, shadcn/ui, MSW

---

## Task 1: 更新类型定义

**Files:**
- Modify: `src/features/project/types.ts`

**Step 1: 更新 Project 类型并新增 Template、CreationRecord 类型**

```typescript
export interface Project {
  id: string
  name: string
  description?: string
  tags: string[]
  presetTemplateIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  type: 'copy' | 'image' | 'video'
  content: string
}

export interface CreationRecord {
  id: string
  projectId: string
  type: 'copy' | 'image' | 'video' | 'mixed'
  title?: string
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}
```

**Step 2: Commit**

```bash
git add src/features/project/types.ts
git commit -m "feat: update Project type and add Template, CreationRecord types"
```

---

## Task 2: 更新 API 层

**Files:**
- Modify: `src/features/project/api.ts`

**Step 1: 更新 projectApi 请求类型并新增 templateApi、recordApi**

```typescript
import type { CreationRecord, Project, Template } from '@/features/project/types'
import api from '@/lib/api'

export interface CreateProjectReq {
  name: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export interface UpdateProjectReq {
  name?: string
  description?: string
  tags?: string[]
  presetTemplateIds?: string[]
}

export interface CreateRecordReq {
  type: 'copy' | 'image' | 'video' | 'mixed'
  title?: string
  content: string
  metadata?: Record<string, unknown>
}

export interface UpdateRecordReq {
  title?: string
  content?: string
  metadata?: Record<string, unknown>
}

export const projectApi = {
  list: () => api.get<Project[]>('projects'),
  get: (id: string) => api.get<Project>(`projects/${id}`),
  create: (data: CreateProjectReq) => api.post<Project, CreateProjectReq>('projects', data),
  update: (id: string, data: UpdateProjectReq) =>
    api.put<Project, UpdateProjectReq>(`projects/${id}`, data),
  delete: (id: string) => api.delete<null>(`projects/${id}`),
}

export const templateApi = {
  list: (type?: 'copy' | 'image' | 'video') => {
    const params = type ? { type } : undefined
    return api.get<Template[]>('templates', params)
  },
}

export const recordApi = {
  list: (projectId: string) => api.get<CreationRecord[]>(`projects/${projectId}/records`),
  create: (projectId: string, data: CreateRecordReq) =>
    api.post<CreationRecord, CreateRecordReq>(`projects/${projectId}/records`, data),
  get: (projectId: string, id: string) =>
    api.get<CreationRecord>(`projects/${projectId}/records/${id}`),
  update: (projectId: string, id: string, data: UpdateRecordReq) =>
    api.put<CreationRecord, UpdateRecordReq>(`projects/${projectId}/records/${id}`, data),
  delete: (projectId: string, id: string) =>
    api.delete<null>(`projects/${projectId}/records/${id}`),
}
```

**Step 2: Commit**

```bash
git add src/features/project/api.ts
git commit -m "feat: update projectApi and add templateApi, recordApi"
```

---

## Task 3: 更新 Hooks

**Files:**
- Modify: `src/features/project/hooks.ts`

**Step 1: 更新 query keys 并新增模板、记录相关 hooks**

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type CreateProjectReq,
  type CreateRecordReq,
  type UpdateProjectReq,
  type UpdateRecordReq,
  projectApi,
  recordApi,
  templateApi,
} from './api'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}

export const templateKeys = {
  all: ['templates'] as const,
  list: (type?: 'copy' | 'image' | 'video') => [...templateKeys.all, 'list', type] as const,
}

export const recordKeys = {
  all: ['records'] as const,
  list: (projectId: string) => [...recordKeys.all, 'list', projectId] as const,
  detail: (projectId: string, id: string) => [...recordKeys.all, 'detail', projectId, id] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.list(),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.get(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectReq) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProjectReq) => projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useTemplates(type?: 'copy' | 'image' | 'video') {
  return useQuery({
    queryKey: templateKeys.list(type),
    queryFn: () => templateApi.list(type),
  })
}

export function useRecords(projectId: string) {
  return useQuery({
    queryKey: recordKeys.list(projectId),
    queryFn: () => recordApi.list(projectId),
    enabled: !!projectId,
  })
}

export function useCreateRecord(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRecordReq) => recordApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
    },
  })
}

export function useUpdateRecord(projectId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRecordReq) => recordApi.update(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
      queryClient.invalidateQueries({ queryKey: recordKeys.detail(projectId, id) })
    },
  })
}

export function useDeleteRecord(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recordApi.delete(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
    },
  })
}
```

**Step 2: Commit**

```bash
git add src/features/project/hooks.ts
git commit -m "feat: update project hooks and add template, record hooks"
```

---

## Task 4: 新增 MSW Handlers

**Files:**
- Create: `src/mocks/handlers/project.ts`

**Step 1: 创建 project handlers**

```typescript
import { http, HttpResponse } from 'msw'

const mockTemplates = [
  { id: 't1', name: '文案模板A', type: 'copy' as const, content: '模板内容A...' },
  { id: 't2', name: '文案模板B', type: 'copy' as const, content: '模板内容B...' },
  { id: 't3', name: '图片模板A', type: 'image' as const, content: '图片描述...' },
  { id: 't4', name: '视频模板A', type: 'video' as const, content: '视频脚本...' },
]

const mockProjects = [
  {
    id: 'p1',
    name: '夏季新品推广',
    description: '为小红书和抖音生成营销素材',
    tags: ['小红书', '短视频'],
    presetTemplateIds: ['t1', 't3'],
    createdAt: '2026-03-16',
    updatedAt: '2026-03-16',
  },
  {
    id: 'p2',
    name: '品牌宣传',
    description: '品牌形象宣传素材',
    tags: ['品牌', '宣传'],
    presetTemplateIds: ['t2'],
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
  },
]

const mockRecords = [
  {
    id: 'r1',
    projectId: 'p1',
    type: 'copy' as const,
    title: '夏季新品文案',
    content: '炎炎夏日，新品上市...',
    createdAt: '2026-03-16',
  },
  {
    id: 'r2',
    projectId: 'p1',
    type: 'image' as const,
    title: '产品主图',
    content: 'https://example.com/image.jpg',
    createdAt: '2026-03-16',
  },
]

export const projectHandlers = [
  // Projects
  http.get('/api/projects', () => {
    return HttpResponse.json({ data: mockProjects })
  }),

  http.get('/api/projects/:id', ({ params }) => {
    const { id } = params
    const project = mockProjects.find(p => p.id === id)
    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ data: project })
  }),

  http.post('/api/projects', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newProject = {
      id: `p${Date.now()}`,
      name: body.name as string,
      description: body.description as string | undefined,
      tags: (body.tags as string[]) || [],
      presetTemplateIds: (body.presetTemplateIds as string[]) || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    mockProjects.push(newProject)
    return HttpResponse.json({ data: newProject }, { status: 201 })
  }),

  http.put('/api/projects/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Record<string, unknown>
    const index = mockProjects.findIndex(p => p.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockProjects[index] = { ...mockProjects[index], ...body, updatedAt: new Date().toISOString().split('T')[0] }
    return HttpResponse.json({ data: mockProjects[index] })
  }),

  http.delete('/api/projects/:id', ({ params }) => {
    const { id } = params
    const index = mockProjects.findIndex(p => p.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockProjects.splice(index, 1)
    return HttpResponse.json({ data: null })
  }),

  // Templates
  http.get('/api/templates', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as 'copy' | 'image' | 'video' | null
    const filtered = type ? mockTemplates.filter(t => t.type === type) : mockTemplates
    return HttpResponse.json({ data: filtered })
  }),

  // Records
  http.get('/api/projects/:projectId/records', ({ params }) => {
    const { projectId } = params
    const records = mockRecords.filter(r => r.projectId === projectId)
    return HttpResponse.json({ data: records })
  }),

  http.post('/api/projects/:projectId/records', async ({ params, request }) => {
    const { projectId } = params
    const body = (await request.json()) as Record<string, unknown>
    const newRecord = {
      id: `r${Date.now()}`,
      projectId: projectId as string,
      type: body.type as 'copy' | 'image' | 'video' | 'mixed',
      title: body.title as string | undefined,
      content: body.content as string,
      metadata: body.metadata as Record<string, unknown> | undefined,
      createdAt: new Date().toISOString().split('T')[0],
    }
    mockRecords.push(newRecord)
    return HttpResponse.json({ data: newRecord }, { status: 201 })
  }),

  http.get('/api/projects/:projectId/records/:id', ({ params }) => {
    const { projectId, id } = params
    const record = mockRecords.find(r => r.projectId === projectId && r.id === id)
    if (!record) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({ data: record })
  }),

  http.put('/api/projects/:projectId/records/:id', async ({ params, request }) => {
    const { projectId, id } = params
    const body = (await request.json()) as Record<string, unknown>
    const index = mockRecords.findIndex(r => r.projectId === projectId && r.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockRecords[index] = { ...mockRecords[index], ...body }
    return HttpResponse.json({ data: mockRecords[index] })
  }),

  http.delete('/api/projects/:projectId/records/:id', ({ params }) => {
    const { projectId, id } = params
    const index = mockRecords.findIndex(r => r.projectId === projectId && r.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockRecords.splice(index, 1)
    return HttpResponse.json({ data: null })
  }),
]
```

**Step 2: Commit**

```bash
git add src/mocks/handlers/project.ts
git commit -m "feat: add MSW handlers for project, template, and record APIs"
```

---

## Task 5: 注册 MSW Handlers

**Files:**
- Modify: `src/mocks/handlers/index.ts`

**Step 1: 导入并注册 project handlers**

```typescript
import { authHandlers } from './auth'
import { projectHandlers } from './project'

export const handlers = [...authHandlers, ...projectHandlers]
```

**Step 2: Commit**

```bash
git add src/mocks/handlers/index.ts
git commit -m "feat: register project handlers in MSW"
```

---

## Task 6: 更新 ProjectCard 组件

**Files:**
- Modify: `src/features/project/components/ProjectCard.tsx`

**Step 1: 更新 ProjectCard 展示名称、描述、标签**

```typescript
import { BookOpen, Calendar } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className='group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10'
      onClick={onClick}
    >
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
          <BookOpen className='h-8 w-8 text-purple-400' />
        </div>

        <h3 className='mb-2 text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors'>
          {project.name}
        </h3>

        {project.description && (
          <p className='mb-3 text-sm text-gray-400 line-clamp-2'>{project.description}</p>
        )}

        <div className='mb-4 flex flex-wrap gap-2'>
          {project.tags?.map(tag => (
            <Badge key={tag} className='bg-cyan-500/20 text-cyan-400 border-cyan-500/30'>
              #{tag}
            </Badge>
          ))}
        </div>

        <div className='mt-6 flex items-center text-sm text-gray-500'>
          <Calendar className='h-4 w-4 mr-1' />
          <span>{project.updatedAt}</span>
        </div>
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/project/components/ProjectCard.tsx
git commit -m "feat: update ProjectCard to display description and multiple tags"
```

---

## Task 7: 创建 PresetMaterials 组件

**Files:**
- Create: `src/features/project/components/PresetMaterials.tsx`

**Step 1: 创建 PresetMaterials 组件**

```typescript
import { FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import type { Template } from '../types'

interface PresetMaterialsProps {
  templates: Template[]
}

const typeIcons = {
  copy: FileText,
  image: ImageIcon,
  video: Video,
}

const typeLabels = {
  copy: '文案',
  image: '图片',
  video: '视频',
}

export function PresetMaterials({ templates }: PresetMaterialsProps) {
  if (templates.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full py-8'>
        <div className='w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mb-3'>
          <FileText className='w-6 h-6 text-gray-600' />
        </div>
        <p className='text-gray-500 text-sm'>暂无预设素材</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {templates.map(template => {
        const Icon = typeIcons[template.type]
        return (
          <Card
            key={template.id}
            className='p-4 bg-gray-800/30 border-gray-700/30 hover:border-cyan-500/30 transition-colors cursor-pointer'
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center'>
                <Icon className='w-5 h-5 text-cyan-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-white font-medium truncate'>{template.name}</h4>
                <Badge variant='outline' className='mt-1 text-xs text-gray-400 border-gray-700'>
                  {typeLabels[template.type]}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/project/components/PresetMaterials.tsx
git commit -m "feat: add PresetMaterials component"
```

---

## Task 8: 创建 CreationRecords 组件

**Files:**
- Create: `src/features/project/components/CreationRecords.tsx`

**Step 1: 创建 CreationRecords 组件**

```typescript
import { Calendar, Download, Eye, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import type { CreationRecord } from '../types'

interface CreationRecordsProps {
  records: CreationRecord[]
}

const typeIcons = {
  copy: FileText,
  image: ImageIcon,
  video: Video,
  mixed: FileText,
}

const typeLabels = {
  copy: '文案',
  image: '图片',
  video: '视频',
  mixed: '图文',
}

export function CreationRecords({ records }: CreationRecordsProps) {
  if (records.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full py-8'>
        <div className='w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mb-3'>
          <FileText className='w-6 h-6 text-gray-600' />
        </div>
        <p className='text-gray-500 text-sm'>暂无创作记录</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {records.map(record => {
        const Icon = typeIcons[record.type]
        return (
          <Card
            key={record.id}
            className='p-4 bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-colors'
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center'>
                <Icon className='w-5 h-5 text-purple-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-white font-medium truncate'>
                  {record.title || '未命名'}
                </h4>
                <div className='flex items-center gap-2 mt-1'>
                  <Badge variant='outline' className='text-xs text-gray-400 border-gray-700'>
                    {typeLabels[record.type]}
                  </Badge>
                  <span className='text-xs text-gray-500 flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    {record.createdAt}
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                  <Eye className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-400 hover:text-white'>
                  <Download className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/project/components/CreationRecords.tsx
git commit -m "feat: add CreationRecords component"
```

---

## Task 9: 更新组件导出

**Files:**
- Modify: `src/features/project/components/index.ts`

**Step 1: 导出新组件**

```typescript
export { CreationRecords } from './CreationRecords'
export { PresetMaterials } from './PresetMaterials'
export { ProjectCard } from './ProjectCard'
export { default as ProjectDetail } from './ProjectDetail'
```

**Step 2: Commit**

```bash
git add src/features/project/components/index.ts
git commit -m "feat: export PresetMaterials and CreationRecords components"
```

---

## Task 10: 重构 ProjectDetail 组件

**Files:**
- Modify: `src/features/project/components/ProjectDetail.tsx`

**Step 1: 重构 ProjectDetail 组件**

```typescript
import { BookOpen, ChevronRight, Plus, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreationRecords, PresetMaterials } from '@/features/project/components'
import { useProject, useRecords, useTemplates } from '@/features/project/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id!)
  const { data: allTemplates = [] } = useTemplates()
  const { data: records = [], isLoading: recordsLoading } = useRecords(id!)

  const handleStartCreation = () => {
    navigate('/creation')
  }

  const handleUploadMaterial = () => {
    console.log('Upload material')
  }

  if (projectLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0a0a0a]'>
        <div className='text-gray-500'>加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0a0a0a]'>
        <div className='text-gray-500'>项目不存在</div>
      </div>
    )
  }

  const presetTemplates = allTemplates.filter(t => 
    project.presetTemplateIds?.includes(t.id)
  )

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-6'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-start gap-6'>
              <div className='flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'>
                <BookOpen className='h-10 w-10 text-purple-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
                  {project.name}
                </h1>
                {project.description && (
                  <p className='text-gray-400 mb-3'>{project.description}</p>
                )}
                <div className='flex items-center gap-2 flex-wrap'>
                  {project.tags?.map(tag => (
                    <Badge key={tag} className='bg-cyan-500/20 text-cyan-400 border-cyan-500/30'>
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={handleStartCreation}
                className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
              >
                <Plus className='mr-2 h-4 w-4' />
                开始AI创作
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        <div className='flex gap-6 min-h-[calc(100vh-300px)]'>
          <div className='w-80 flex-shrink-0'>
            <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-gray-700/30'>
                <h2 className='text-lg font-semibold text-white'>预设素材</h2>
              </div>
              <div className='flex-1 p-4 overflow-auto'>
                <PresetMaterials templates={presetTemplates} />
              </div>
            </Card>
          </div>

          <Separator orientation='vertical' className='h-auto bg-gray-700/20' />

          <div className='flex-1 flex flex-col'>
            <Card className='flex-1 bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-gray-700/30 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-white'>创作记录</h2>
                <span className='text-sm text-gray-500'>{records.length} 条记录</span>
              </div>
              <div className='flex-1 p-4 overflow-auto'>
                {recordsLoading ? (
                  <div className='flex items-center justify-center h-full'>
                    <div className='text-gray-500'>加载中...</div>
                  </div>
                ) : (
                  <CreationRecords records={records} />
                )}
              </div>
            </Card>

            <div className='mt-4 flex gap-3'>
              <Button
                onClick={handleUploadMaterial}
                variant='outline'
                className='bg-gray-900/50 border-gray-700/30 text-white hover:bg-gray-800/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300'
              >
                <Upload className='mr-2 h-4 w-4' />
                上传素材
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/project/components/ProjectDetail.tsx
git commit -m "feat: refactor ProjectDetail with PresetMaterials and CreationRecords"
```

---

## Task 11: 更新 feature 导出

**Files:**
- Modify: `src/features/project/index.ts`

**Step 1: 更新导出**

```typescript
export * from './api'
export * from './components'
export * from './hooks'
export * from './types'
```

**Step 2: Commit**

```bash
git add src/features/project/index.ts
git commit -m "feat: update project feature exports"
```

---

## Task 12: 更新 Home 页创建项目表单

**Files:**
- Modify: `src/pages/Home.tsx`

**Step 1: 更新创建项目对话框，支持描述和标签**

在 `HomePage` 组件中更新创建项目逻辑：

```typescript
// 添加状态
const [newProjectDescription, setNewProjectDescription] = useState('')
const [newProjectTags, setNewProjectTags] = useState('')

// 更新 handleCreateProject
const handleCreateProject = () => {
  if (!newProjectName.trim()) return
  const tags = newProjectTags
    .split(/[,，\s]+/)
    .map(t => t.trim())
    .filter(t => t && !t.startsWith('#'))
  const hashTags = newProjectTags
    .split(/[,，\s]+/)
    .map(t => t.trim())
    .filter(t => t.startsWith('#'))
    .map(t => t.slice(1))
  
  createProject.mutate(
    {
      name: newProjectName,
      description: newProjectDescription || undefined,
      tags: [...tags, ...hashTags].filter(Boolean),
    },
    {
      onSuccess: () => {
        setNewProjectName('')
        setNewProjectDescription('')
        setNewProjectTags('')
        setIsDialogOpen(false)
      },
    }
  )
}
```

更新 DialogContent 添加描述和标签输入：

```typescript
<DialogContent className='bg-gray-900 border-gray-800'>
  <DialogHeader>
    <DialogTitle className='text-white'>创建新项目</DialogTitle>
    <DialogDescription className='text-gray-500'>
      输入项目信息以创建一个新的创作项目
    </DialogDescription>
  </DialogHeader>
  <div className='py-4 space-y-4'>
    <div>
      <Label className='text-gray-400 text-sm mb-2 block'>项目名称 *</Label>
      <Input
        placeholder='输入项目名称...'
        value={newProjectName}
        onChange={e => setNewProjectName(e.target.value)}
        className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50'
      />
    </div>
    <div>
      <Label className='text-gray-400 text-sm mb-2 block'>项目描述</Label>
      <Input
        placeholder='输入项目描述（可选）...'
        value={newProjectDescription}
        onChange={e => setNewProjectDescription(e.target.value)}
        className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50'
      />
    </div>
    <div>
      <Label className='text-gray-400 text-sm mb-2 block'>标签</Label>
      <Input
        placeholder='输入标签，如 #小红书 #短视频...'
        value={newProjectTags}
        onChange={e => setNewProjectTags(e.target.value)}
        className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50'
      />
      <p className='text-xs text-gray-500 mt-1'>多个标签用空格或逗号分隔</p>
    </div>
  </div>
  <div className='flex justify-end gap-2'>
    <Button
      variant='outline'
      onClick={() => setIsDialogOpen(false)}
      className='bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
    >
      取消
    </Button>
    <Button
      variant='ghost'
      onClick={handleCreateProject}
      disabled={!newProjectName.trim() || createProject.isPending}
      className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:text-white hover:from-cyan-600 hover:to-teal-600 hover:bg-transparent'
    >
      {createProject.isPending ? '创建中...' : '创建'}
    </Button>
  </div>
</DialogContent>
```

**Step 2: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: update create project dialog with description and tags"
```

---

## Task 13: 验证功能

**Step 1: 启动开发服务器**

Run: `pnpm dev`

**Step 2: 手动测试流程**

1. 访问 http://localhost:5000
2. 点击"创建新项目"，填写名称、描述、标签
3. 点击项目卡片进入详情页
4. 查看预设素材和创作记录显示
5. 点击"开始AI创作"跳转到创作页面

**Step 3: 运行 lint 检查**

Run: `pnpm lint`

Expected: No errors

---

## 完成检查清单

- [ ] 类型定义更新完成
- [ ] API 层更新完成
- [ ] Hooks 更新完成
- [ ] MSW handlers 添加完成
- [ ] ProjectCard 更新完成
- [ ] PresetMaterials 组件创建完成
- [ ] CreationRecords 组件创建完成
- [ ] ProjectDetail 重构完成
- [ ] 创建项目表单更新完成
- [ ] Lint 检查通过
- [ ] 功能手动测试通过