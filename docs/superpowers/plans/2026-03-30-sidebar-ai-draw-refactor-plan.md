# AIMC Sidebar & AI Draw Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构侧边栏菜单为 3 项，重命名 feature 文件夹，新增 AI 绘图首页与对话历史功能，删除未使用的工具代码。

**Architecture:** 保持 FSD 分层，新增 conversation 相关 API/hooks，AiDrawLanding 组件包含历史对话列表，GeneratorPage 支持从历史恢复画布状态。

**Tech Stack:** React, TypeScript, TanStack Query, Zustand, MSW, Tailwind CSS

---

## Task 1: Delete projects feature (sidebar 已移除项目菜单)

**Files:**
- Delete: `src/features/projects/` (整个文件夹)
- Delete: `src/pages/Projects.tsx`
- Delete: `src/mocks/handlers/projects.ts`
- Delete: `src/mocks/handlers/works.ts`
- Modify: `src/mocks/handlers/index.ts`
- Modify: `src/app/router/index.tsx`

- [ ] **Step 1: Delete projects feature folder**

```bash
rm -rf src/features/projects
```

- [ ] **Step 2: Delete Projects page**

```bash
rm src/pages/Projects.tsx
```

- [ ] **Step 3: Delete mock handlers**

```bash
rm src/mocks/handlers/projects.ts src/mocks/handlers/works.ts
```

- [ ] **Step 4: Update mocks/handlers/index.ts**

Remove imports and exports for deleted handlers:

```typescript
import { authHandlers } from './auth'
import { canvasGeneratorHandlers } from './canvas-generator'
import { creationsHandlers } from './creations'
import { materialsHandlers } from './materials'
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...creationsHandlers,
  ...canvasGeneratorHandlers,
]
```

- [ ] **Step 5: Update router - remove /projects route**

In `src/app/router/index.tsx`:
- Remove `const Projects = lazy(() => import('@/pages/Projects'))`
- Remove route `{ path: '/projects', element: <Projects /> }` from children array

- [ ] **Step 6: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: remove projects feature (sidebar menu removed)"
```

---

## Task 2: Rename canvas-generator to generator

**Files:**
- Rename: `src/features/canvas-generator/` → `src/features/generator/`
- Modify: All files importing from `@/features/canvas-generator`

- [ ] **Step 1: Rename feature folder**

```bash
mv src/features/canvas-generator src/features/generator
```

- [ ] **Step 2: Update imports in generator files**

Update `src/features/generator/api.ts` - no import changes needed (uses `@/lib/api`)

Update `src/features/generator/components/CanvasGeneratorPage.tsx`:
```typescript
// imports stay the same (relative paths within feature)
```

Update `src/features/generator/components/FloatingChat.tsx`:
```typescript
import { useCanvas } from '../hooks/useCanvas'
```
(Already relative - no change needed)

- [ ] **Step 3: Update imports in pages**

Update `src/pages/CanvasGenerator.tsx`:
```typescript
import { CanvasGeneratorPage } from '@/features/generator'
```

- [ ] **Step 4: Update imports in mocks**

Update `src/mocks/handlers/canvas-generator.ts`:
```typescript
import type { CanvasExportResp, ChatMessageResp } from '@/features/generator/types'
```

- [ ] **Step 5: Rename mock handler file**

```bash
mv src/mocks/handlers/canvas-generator.ts src/mocks/handlers/generator.ts
```

- [ ] **Step 6: Update mocks/handlers/index.ts**

```typescript
import { generatorHandlers } from './generator'
// ... other imports

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...creationsHandlers,
  ...generatorHandlers,
]
```

- [ ] **Step 7: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename canvas-generator feature to generator"
```

---

## Task 3: Rename creations to tools

**Files:**
- Rename: `src/features/creations/` → `src/features/tools/`
- Rename: `src/pages/Creations.tsx` → `src/pages/Tools.tsx`
- Modify: All files importing from `@/features/creations`
- Modify: `src/mocks/handlers/creations.ts` → `src/mocks/handlers/tools.ts`

- [ ] **Step 1: Rename feature folder**

```bash
mv src/features/creations src/features/tools
```

- [ ] **Step 2: Rename page file**

```bash
mv src/pages/Creations.tsx src/pages/Tools.tsx
```

- [ ] **Step 3: Update page content**

In `src/pages/Tools.tsx`, update import:
```typescript
import { ToolsPage } from '@/features/tools'
```

- [ ] **Step 4: Rename mock handler file**

```bash
mv src/mocks/handlers/creations.ts src/mocks/handlers/tools.ts
```

- [ ] **Step 5: Update mocks/handlers/index.ts**

```typescript
import { toolsHandlers } from './tools'
// ... other imports

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...toolsHandlers,
  ...generatorHandlers,
]
```

- [ ] **Step 6: Update mock handler imports**

In `src/mocks/handlers/tools.ts`:
```typescript
import type { GeneratePosterResp, GenerateTextResp, OcrResp } from '@/features/tools/types'
```

- [ ] **Step 7: Update router imports**

In `src/app/router/index.tsx`:
```typescript
const Tools = lazy(() => import('@/pages/Tools'))
// ...
{ path: '/tools', element: <Tools /> },
```

- [ ] **Step 8: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: rename creations feature to tools"
```

---

## Task 4: Delete PosterTool and TextTool from tools feature

**Files:**
- Delete: `src/features/tools/components/PosterTool.tsx`
- Delete: `src/features/tools/components/TextTool.tsx`
- Modify: `src/features/tools/api.ts`
- Modify: `src/features/tools/types.ts`
- Modify: `src/features/tools/hooks/index.ts`
- Modify: `src/features/tools/components/index.ts`
- Modify: `src/features/tools/index.ts`
- Modify: `src/mocks/handlers/tools.ts`

- [ ] **Step 1: Delete component files**

```bash
rm src/features/tools/components/PosterTool.tsx src/features/tools/components/TextTool.tsx
```

- [ ] **Step 2: Update types.ts - keep only OCR types**

In `src/features/tools/types.ts`:
```typescript
export type ToolType = 'ocr'

export interface OcrReq {
  imageUrl?: string
  file?: File
}

export interface OcrResp {
  text: string
  confidence: number
}
```

- [ ] **Step 3: Update api.ts - keep only OCR API**

In `src/features/tools/api.ts`:
```typescript
import api, { apiClient, unwrap } from '@/lib/api'
import type { OcrReq, OcrResp } from './types'

export const toolsApi = {
  ocr: async (data: OcrReq): Promise<OcrResp> => {
    if (!data.file && !data.imageUrl) {
      throw new Error('请上传文件或提供图片地址')
    }

    if (data.file) {
      const formData = new FormData()
      formData.append('file', data.file)
      if (data.imageUrl) formData.append('imageUrl', data.imageUrl)
      const res = await apiClient.post('tools/ocr', { body: formData })
      return unwrap<OcrResp>(res)
    }

    const res = await apiClient.post('tools/ocr', { json: { imageUrl: data.imageUrl } })
    return unwrap<OcrResp>(res)
  },
}
```

- [ ] **Step 4: Update hooks/index.ts - keep only useOcr**

In `src/features/tools/hooks/index.ts`:
```typescript
import { useMutation } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { toolsApi } from '../api'
import type { OcrReq } from '../types'

export const toolsKeys = {
  all: ['tools'] as const,
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => toolsApi.ocr(data),
    onError: createMutationErrorHandler('文字提取失败'),
  })
}
```

- [ ] **Step 5: Update components/index.ts**

In `src/features/tools/components/index.ts`:
```typescript
export { ToolGrid, ToolHeader } from './ToolGrid'
export { OcrTool } from './OcrTool'
export { ToolsPage } from './ToolsPage'
```

- [ ] **Step 6: Update feature index.ts**

In `src/features/tools/index.ts`:
```typescript
export * from './api'
export { ToolGrid, ToolHeader, OcrTool, ToolsPage } from './components'
export * from './hooks'
export * from './types'
```

- [ ] **Step 7: Update ToolGrid - keep only OCR card**

In `src/features/tools/components/ToolGrid.tsx`:
```typescript
import { ArrowRight, ScanText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolType } from '../types'

interface ToolCardDef {
  id: string
  type: ToolType
  title: string
  description: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: 'primary' | 'secondary'
}

const tools: ToolCardDef[] = [
  {
    id: 'ocr',
    type: 'ocr',
    title: '图片文字提取',
    description: '精准识别并提取素材文字',
    label: 'Data Perception',
    icon: ScanText,
    accent: 'secondary',
  },
]

// ... rest of component stays the same
```

- [ ] **Step 8: Update mock handlers - keep only OCR**

In `src/mocks/handlers/tools.ts`:
```typescript
import { delay, HttpResponse, http } from 'msw'
import type { OcrResp } from '@/features/tools/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function badRequest<T = null>(message: string) {
  return HttpResponse.json<ApiResponse<T>>({ code: 400, message, data: null as T }, { status: 400 })
}

function serverError<T = null>(message: string) {
  return HttpResponse.json<ApiResponse<T>>({ code: 500, message, data: null as T }, { status: 500 })
}

const shouldFailRandomly = () => Math.random() < 0.1

export const toolsHandlers = [
  http.post<never, { imageUrl?: string }, ApiResponse<OcrResp>>(
    `${API_BASE}/tools/ocr`,
    async ({ request }) => {
      await delay(5000)

      const contentType = request.headers.get('content-type') || ''
      let hasValidInput = false

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        hasValidInput = !!file && file.size > 0
      } else {
        const body = await request.json()
        hasValidInput = !!body.imageUrl?.trim()
      }

      if (!hasValidInput) {
        return badRequest('请上传图片或提供图片链接')
      }

      if (shouldFailRandomly()) {
        return serverError('服务暂时不可用，请重试')
      }

      return HttpResponse.json(
        success({
          text: `项目名称：极光边缘计算节点架构设计\n\n核心目标：构建可大规模部署的合成智能网络\n\n此文档包含机密数据，仅供内部审阅。`,
          confidence: 0.97,
        })
      )
    }
  ),
]
```

- [ ] **Step 9: Update ToolsPage.tsx**

Rename `src/features/tools/components/CreationsPage.tsx` to `ToolsPage.tsx`:
```bash
mv src/features/tools/components/CreationsPage.tsx src/features/tools/components/ToolsPage.tsx
```

Update content if needed to reflect only OCR tool.

- [ ] **Step 10: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "refactor: remove PosterTool and TextTool, keep only OCR"
```

---

## Task 5: Update Sidebar to 3 menu items

**Files:**
- Modify: `src/shared/components/layout/Sidebar.tsx`

- [ ] **Step 1: Update navItems array**

In `src/shared/components/layout/Sidebar.tsx`:
```typescript
import { FolderOpen, Image, LogOut, Sparkles } from 'lucide-react'
// ... other imports

const navItems = [
  {
    path: '/canvas',
    icon: Image,
    label: 'AI绘图',
  },
  {
    path: '/materials',
    icon: FolderOpen,
    label: '素材库',
  },
  {
    path: '/tools',
    icon: Sparkles,
    label: '工具箱',
  },
]
```

- [ ] **Step 2: Verify UI shows 3 items**

Run: `pnpm dev`
Check: Sidebar shows AI绘图, 素材库, 工具箱

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/layout/Sidebar.tsx
git commit -m "feat: update sidebar menu to 3 items (AI绘图, 素材库, 工具箱)"
```

---

## Task 6: Update router for new routes

**Files:**
- Modify: `src/app/router/index.tsx`
- Create: `src/pages/AiDraw.tsx`
- Rename: `src/pages/CanvasGenerator.tsx` → `src/pages/Generator.tsx`

- [ ] **Step 1: Create AiDraw page placeholder**

Create `src/pages/AiDraw.tsx`:
```typescript
import { AiDrawLanding } from '@/features/generator'

export default function AiDraw() {
  return <AiDrawLanding />
}
```

- [ ] **Step 2: Rename CanvasGenerator to Generator**

```bash
mv src/pages/CanvasGenerator.tsx src/pages/Generator.tsx
```

- [ ] **Step 3: Update Generator page**

In `src/pages/Generator.tsx`:
```typescript
import { useParams } from 'react-router-dom'
import { GeneratorPage } from '@/features/generator'

export default function Generator() {
  const { conversationId } = useParams<{ conversationId: string }>()

  return (
    <div className='h-screen w-screen overflow-hidden bg-background'>
      <GeneratorPage conversationId={conversationId} />
    </div>
  )
}
```

- [ ] **Step 4: Update router config**

In `src/app/router/index.tsx`:
```typescript
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Landing = lazy(() => import('@/pages/Landing'))
const AiDraw = lazy(() => import('@/pages/AiDraw'))
const Generator = lazy(() => import('@/pages/Generator'))
const Tools = lazy(() => import('@/pages/Tools'))
const Materials = lazy(() => import('@/pages/Materials'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/canvas',
    element: (
      <AuthGuard requireAuth>
        <AiDraw />
      </AuthGuard>
    ),
  },
  {
    path: '/canvas/:conversationId',
    element: (
      <AuthGuard requireAuth>
        <Generator />
      </AuthGuard>
    ),
  },
  {
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: '/tools', element: <Tools /> },
      { path: '/materials', element: <Materials /> },
    ],
  },
  {
    path: '/401',
    element: <Unauthorized />,
  },
  {
    path: '/500',
    element: <ServerError />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
```

- [ ] **Step 5: Verify routes work**

Run: `pnpm dev`
Check: `/canvas` loads, `/canvas/123` loads, `/tools` loads

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: update router with new AI绘图 routes"
```

---

## Task 7: Add Conversation types and API

**Files:**
- Modify: `src/features/generator/types.ts`
- Modify: `src/features/generator/api.ts`

- [ ] **Step 1: Add Conversation types**

In `src/features/generator/types.ts`, add after existing types:
```typescript
// 对话摘要
export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
}

// 对话详情（含消息和画布状态）
export interface ConversationDetail {
  id: string
  title: string
  messages: ChatMessage[]
  canvasItems: CanvasItem[]
  createdAt: number
  updatedAt: number
}

// 创建对话请求
export interface CreateConversationReq {
  title?: string
}

// 创建对话响应
export interface CreateConversationResp {
  conversation: Conversation
}
```

- [ ] **Step 2: Update ChatMessageReq to require conversationId**

In `src/features/generator/types.ts`:
```typescript
export interface ChatMessageReq {
  conversationId: string  // Now required
  message: string
  image?: File
}
```

- [ ] **Step 3: Update API with conversation methods**

In `src/features/generator/api.ts`:
```typescript
import api, { apiClient, unwrap } from '@/lib/api'
import type {
  CanvasExportReq,
  CanvasExportResp,
  ChatMessageReq,
  ChatMessageResp,
  Conversation,
  ConversationDetail,
  CreateConversationReq,
  CreateConversationResp,
} from './types'

export const generatorApi = {
  // 对话历史管理
  getConversations: () => api.get<Conversation[]>('conversations'),
  getConversation: (id: string) => api.get<ConversationDetail>(`conversations/${id}`),
  createConversation: (data: CreateConversationReq) =>
    api.post<CreateConversationResp>('conversations', data),
  deleteConversation: (id: string) => api.delete(`conversations/${id}`),

  // 发送消息
  sendMessage: async (data: ChatMessageReq): Promise<ChatMessageResp> => {
    const formData = new FormData()
    formData.append('message', data.message)
    formData.append('conversationId', data.conversationId)
    if (data.image) {
      formData.append('image', data.image)
    }
    const res = await apiClient.post('canvas/chat', { body: formData })
    return unwrap<ChatMessageResp>(res)
  },

  // 导出画布
  exportCanvas: (data: CanvasExportReq) =>
    api.post<CanvasExportResp>('canvas/export', {
      items: data.items,
      format: data.format,
    }),
}
```

- [ ] **Step 4: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/features/generator/types.ts src/features/generator/api.ts
git commit -m "feat: add Conversation types and API methods"
```

---

## Task 8: Add conversation hooks

**Files:**
- Create: `src/features/generator/hooks/useConversations.ts`
- Create: `src/features/generator/hooks/useConversation.ts`
- Create: `src/features/generator/hooks/useCreateConversation.ts`
- Create: `src/features/generator/hooks/useDeleteConversation.ts`
- Modify: `src/features/generator/hooks/index.ts`

- [ ] **Step 1: Create useConversations hook**

Create `src/features/generator/hooks/useConversations.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

export function useConversations() {
  return useQuery({
    queryKey: generatorKeys.conversations(),
    queryFn: () => generatorApi.getConversations(),
  })
}
```

- [ ] **Step 2: Create useConversation hook**

Create `src/features/generator/hooks/useConversation.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

export function useConversation(id: string) {
  return useQuery({
    queryKey: generatorKeys.conversation(id),
    queryFn: () => generatorApi.getConversation(id),
    enabled: !!id,
  })
}
```

- [ ] **Step 3: Create query keys file**

Create `src/features/generator/hooks/keys.ts`:
```typescript
export const generatorKeys = {
  all: ['generator'] as const,
  conversations: () => [...generatorKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...generatorKeys.all, 'conversation', id] as const,
}
```

- [ ] **Step 4: Create useCreateConversation hook**

Create `src/features/generator/hooks/useCreateConversation.ts`:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'
import type { CreateConversationReq } from '../types'

export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateConversationReq) => generatorApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generatorKeys.conversations() })
    },
    onError: createMutationErrorHandler('创建对话失败'),
  })
}
```

- [ ] **Step 5: Create useDeleteConversation hook**

Create `src/features/generator/hooks/useDeleteConversation.ts`:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => generatorApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generatorKeys.conversations() })
    },
    onError: createMutationErrorHandler('删除对话失败'),
  })
}
```

- [ ] **Step 6: Update hooks/index.ts**

In `src/features/generator/hooks/index.ts`:
```typescript
export * from './keys'
export * from './useCanvas'
export * from './useChat'
export * from './useConversation'
export * from './useConversations'
export * from './useCreateConversation'
export * from './useDeleteConversation'
```

- [ ] **Step 7: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add src/features/generator/hooks/
git commit -m "feat: add conversation query and mutation hooks"
```

---

## Task 9: Add setItems to canvas store

**Files:**
- Modify: `src/features/generator/stores/canvas.ts`

- [ ] **Step 1: Add setItems action**

In `src/features/generator/stores/canvas.ts`:
```typescript
import { create } from 'zustand'
import type { CanvasItem } from '../types'

interface CanvasState {
  items: CanvasItem[]
  selectedId: string | null
  isDragging: boolean

  addItem: (item: CanvasItem) => void
  setItems: (items: CanvasItem[]) => void  // NEW
  updateItem: (id: string, updates: Partial<CanvasItem>) => void
  removeItem: (id: string) => void
  selectItem: (id: string | null) => void
  clearCanvas: () => void
}

export const useCanvasStore = create<CanvasState>(set => ({
  items: [],
  selectedId: null,
  isDragging: false,

  addItem: item => set(state => ({ items: [...state.items, item] })),

  setItems: items => set({ items }),  // NEW

  updateItem: (id, updates) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, ...updates } : item)),
    })),

  removeItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectItem: id => set({ selectedId: id }),

  clearCanvas: () => set({ items: [], selectedId: null }),
}))
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/features/generator/stores/canvas.ts
git commit -m "feat: add setItems action to canvas store for restoration"
```

---

## Task 10: Create AiDrawLanding component

**Files:**
- Create: `src/features/generator/components/AiDrawLanding.tsx`
- Create: `src/features/generator/components/ConversationList.tsx`
- Modify: `src/features/generator/components/index.ts`

- [ ] **Step 1: Create ConversationList component**

Create `src/features/generator/components/ConversationList.tsx`:
```typescript
import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useConversations, useCreateConversation, useDeleteConversation } from '../hooks'

interface ConversationListProps {
  onSelectConversation?: (id: string) => void
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const navigate = useNavigate()
  const { data: conversations, isLoading } = useConversations()
  const createConversation = useCreateConversation()
  const deleteConversation = useDeleteConversation()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleCreateNew = useCallback(async () => {
    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
      onSelectConversation?.(result.conversation.id)
    } catch {
      // Error handled by hook
    }
  }, [createConversation, navigate, onSelectConversation])

  const handleSelect = useCallback(
    (id: string) => {
      navigate(`/canvas/${id}`)
      onSelectConversation?.(id)
    },
    [navigate, onSelectConversation]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (deleteConfirmId !== id) {
        setDeleteConfirmId(id)
        return
      }
      try {
        await deleteConversation.mutateAsync(id)
        setDeleteConfirmId(null)
        toast.success('对话已删除')
      } catch {
        // Error handled by hook
      }
    },
    [deleteConversation, deleteConfirmId]
  )

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-b border-border/10'>
        <Button
          onClick={handleCreateNew}
          disabled={createConversation.isPending}
          className='w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30'
        >
          <Plus className='w-4 h-4 mr-2' />
          新建对话
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='p-4 text-center text-muted-foreground text-sm'>加载中...</div>
        ) : !conversations || conversations.length === 0 ? (
          <div className='p-4 text-center text-muted-foreground text-sm'>暂无历史对话</div>
        ) : (
          <div className='space-y-1 p-2'>
            {conversations.map(conv => (
              <div
                key={conv.id}
                className='group flex items-center gap-2 p-3 rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors'
                onClick={() => handleSelect(conv.id)}
              >
                <MessageSquare className='w-4 h-4 text-muted-foreground shrink-0' />
                <div className='flex-1 min-w-0'>
                  <div className='text-sm text-foreground truncate'>{conv.title}</div>
                  <div className='text-xs text-muted-foreground'>{formatDate(conv.updatedAt)}</div>
                </div>
                <button
                  type='button'
                  onClick={e => {
                    e.stopPropagation()
                    handleDelete(conv.id)
                  }}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    deleteConfirmId === conv.id
                      ? 'bg-destructive/20 text-destructive'
                      : 'opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                  title={deleteConfirmId === conv.id ? '再次点击确认删除' : '删除'}
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create AiDrawLanding component**

Create `src/features/generator/components/AiDrawLanding.tsx`:
```typescript
import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useCreateConversation } from '../hooks'
import { ConversationList } from './ConversationList'

export function AiDrawLanding() {
  const navigate = useNavigate()
  const createConversation = useCreateConversation()

  const handleStartNew = async () => {
    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
    } catch {
      // Error handled by hook
    }
  }

  return (
    <div className='flex h-screen bg-surface'>
      {/* History Sidebar */}
      <div className='w-[280px] border-r border-border/10 bg-card/50 flex flex-col'>
        <ConversationList />
      </div>

      {/* Welcome Area */}
      <div className='flex-1 flex flex-col items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <div className='w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6'>
            <Sparkles className='w-10 h-10 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground mb-3'>AI 绘图</h1>
          <p className='text-muted-foreground mb-8'>
            描述你想要的画面，AI 将为你生成创意图片。支持上传参考图，实时在画布上编辑。
          </p>
          <Button
            onClick={handleStartNew}
            disabled={createConversation.isPending}
            size='lg'
            className='bg-primary text-primary-foreground hover:bg-primary/90 px-8'
          >
            <Sparkles className='w-5 h-5 mr-2' />
            开始新对话
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update components/index.ts**

In `src/features/generator/components/index.ts`:
```typescript
export { AiDrawLanding } from './AiDrawLanding'
export { Canvas } from './Canvas'
export { CanvasItem } from './CanvasItem'
export { CanvasToolbar } from './CanvasToolbar'
export { ConversationList } from './ConversationList'
export { FloatingChat } from './FloatingChat'
export { GeneratorPage } from './GeneratorPage'
```

- [ ] **Step 4: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/features/generator/components/
git commit -m "feat: add AiDrawLanding and ConversationList components"
```

---

## Task 11: Update GeneratorPage to load conversation

**Files:**
- Rename: `src/features/generator/components/CanvasGeneratorPage.tsx` → `src/features/generator/components/GeneratorPage.tsx`
- Modify: `src/features/generator/components/GeneratorPage.tsx`

- [ ] **Step 1: Rename file**

```bash
mv src/features/generator/components/CanvasGeneratorPage.tsx src/features/generator/components/GeneratorPage.tsx
```

- [ ] **Step 2: Update GeneratorPage to accept conversationId and load data**

In `src/features/generator/components/GeneratorPage.tsx`:
```typescript
import { useEffect, useState } from 'react'
import { useConversation } from '../hooks'
import { useCanvasStore } from '../stores/canvas'
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

interface GeneratorPageProps {
  conversationId?: string
}

export function GeneratorPage({ conversationId }: GeneratorPageProps) {
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select')
  const [isLoaded, setIsLoaded] = useState(false)

  const { data: conversation, isLoading } = useConversation(conversationId || '')
  const setItems = useCanvasStore(state => state.setItems)

  // Restore canvas items when conversation loads
  useEffect(() => {
    if (conversation && !isLoaded) {
      setItems(conversation.canvasItems)
      setIsLoaded(true)
    }
  }, [conversation, isLoaded, setItems])

  // Reset loaded state when conversationId changes
  useEffect(() => {
    setIsLoaded(false)
  }, [conversationId])

  if (!conversationId) {
    return null // Should be redirected by router
  }

  if (isLoading && !isLoaded) {
    return (
      <div className='h-full flex items-center justify-center bg-background'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    )
  }

  return (
    <div className='relative h-full'>
      <Canvas tool={activeTool} />
      <FloatingChat conversationId={conversationId} />
      <CanvasToolbar onToolChange={setActiveTool} />
    </div>
  )
}
```

- [ ] **Step 3: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/components/GeneratorPage.tsx
git commit -m "feat: update GeneratorPage to load and restore conversation"
```

---

## Task 12: Update FloatingChat with back button and conversationId

**Files:**
- Modify: `src/features/generator/components/FloatingChat.tsx`
- Modify: `src/features/generator/hooks/useChat.ts`

- [ ] **Step 1: Update useChat to accept conversationId prop**

In `src/features/generator/hooks/useChat.ts`:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'
import type { ChatMessage } from '../types'

interface UseChatOptions {
  conversationId: string
  onGenerateImage?: (imageUrl: string, position?: { x: number; y: number }) => void
}

export function useChat({ conversationId, onGenerateImage }: UseChatOptions) {
  const queryClient = useQueryClient()

  const messages = queryClient.getQueryData<ChatMessage[]>(
    generatorKeys.conversation(conversationId)
  )?.messages ?? []

  const setMessages = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      queryClient.setQueryData(generatorKeys.conversation(conversationId), (old: undefined) => {
        const current = old ?? { messages: [] }
        const next = typeof updater === 'function' ? updater(current.messages) : updater
        return { ...current, messages: next }
      })
    },
    [queryClient, conversationId]
  )

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, image }: { message: string; image?: File }) => {
      const response = await generatorApi.sendMessage({
        conversationId,
        message,
        image,
      })
      return response
    },
    onMutate: async ({ message, image }) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        imageUrl: image ? URL.createObjectURL(image) : undefined,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, userMessage])
    },
    onSuccess: data => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message.content,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.generatedImage?.imageUrl) {
        onGenerateImage?.(data.generatedImage.imageUrl, data.generatedImage.suggestedPosition)
      }
    },
    onError: () => {
      toast.error('发送消息失败')
    },
  })

  const sendMessage = useCallback(
    async (message: string, image?: File) => {
      if (!message.trim() && !image) return
      await sendMessageMutation.mutateAsync({ message, image })
    },
    [sendMessageMutation]
  )

  return {
    messages,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
  }
}
```

- [ ] **Step 2: Update FloatingChat to accept conversationId and add back button**

In `src/features/generator/components/FloatingChat.tsx`, update:
- Add `conversationId` prop
- Add back button in header
- Pass `conversationId` to `useChat`

```typescript
import { ArrowLeft, ImagePlus, MessageSquare, Minimize2, Send, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCanvas } from '../hooks/useCanvas'
import { useChat } from '../hooks/useChat'

// ... MOCK_IMAGES constant stays the same

interface FloatingChatProps {
  conversationId: string
}

export function FloatingChat({ conversationId }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [pendingImages, setPendingImages] = useState<{ url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { handleAddImage } = useCanvas()

  const { messages, isLoading, sendMessage } = useChat({
    conversationId,
    onGenerateImage: (imageUrl, position) => {
      handleAddImage(imageUrl, position)
    },
  })

  // ... rest of component stays similar, with back button in header

  // In the header section, add:
  <button
    type='button'
    onClick={() => navigate('/canvas')}
    className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
    title='返回首页'
  >
    <ArrowLeft className='w-4 h-4' />
  </button>
```

- [ ] **Step 3: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/components/FloatingChat.tsx src/features/generator/hooks/useChat.ts
git commit -m "feat: update FloatingChat with back button and conversationId prop"
```

---

## Task 13: Update mock handlers with conversation API

**Files:**
- Modify: `src/mocks/handlers/generator.ts`

- [ ] **Step 1: Update generator mock handlers**

Replace `src/mocks/handlers/generator.ts`:
```typescript
import { delay, HttpResponse, http } from 'msw'
import type {
  CanvasExportResp,
  ChatMessage,
  ChatMessageResp,
  Conversation,
  ConversationDetail,
  CreateConversationResp,
} from '@/features/generator/types'
import type { ApiResponse } from '@/lib/api'

const API_BASE = '/api'

function success<T>(data: T): ApiResponse<T> {
  return { code: 0, message: 'success', data }
}

function notFound(message: string) {
  return HttpResponse.json<ApiResponse<null>>({ code: 404, message, data: null }, { status: 404 })
}

// In-memory storage for mock conversations
const mockConversations = new Map<string, ConversationDetail>()

// Initialize with some sample data
const now = Date.now()
mockConversations.set('conv-1', {
  id: 'conv-1',
  title: '运动鞋海报设计',
  messages: [],
  canvasItems: [],
  createdAt: now - 86400000,
  updatedAt: now - 86400000,
})

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
]

export const generatorHandlers = [
  // GET /api/conversations
  http.get(`${API_BASE}/conversations`, () => {
    const list: Conversation[] = Array.from(mockConversations.values())
      .map(c => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
    return HttpResponse.json(success(list))
  }),

  // GET /api/conversations/:id
  http.get(`${API_BASE}/conversations/:id`, ({ params }) => {
    const id = params.id as string
    const conv = mockConversations.get(id)
    if (!conv) return notFound('对话不存在')
    return HttpResponse.json(success(conv))
  }),

  // POST /api/conversations
  http.post(`${API_BASE}/conversations`, async () => {
    await delay(500)
    const id = `conv-${Date.now()}`
    const timestamp = Date.now()
    const conv: ConversationDetail = {
      id,
      title: '新对话',
      messages: [],
      canvasItems: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    mockConversations.set(id, conv)
    return HttpResponse.json(
      success({
        conversation: {
          id,
          title: conv.title,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      } as CreateConversationResp)
    )
  }),

  // DELETE /api/conversations/:id
  http.delete(`${API_BASE}/conversations/:id`, ({ params }) => {
    const id = params.id as string
    mockConversations.delete(id)
    return HttpResponse.json(success(null))
  }),

  // POST /api/canvas/chat
  http.post(`${API_BASE}/canvas/chat`, async ({ request }) => {
    await delay(2000)

    const formData = await request.formData()
    const conversationId = formData.get('conversationId') as string
    const message = formData.get('message') as string

    const conv = mockConversations.get(conversationId)
    if (!conv) return notFound('对话不存在')

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }
    conv.messages.push(userMsg)

    // Generate mock image
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    const generatedImage = {
      imageUrl: randomImage,
      suggestedPosition: { x: 400 + Math.random() * 200, y: 100 + Math.random() * 200 },
    }

    // Update title if first message
    if (conv.messages.length === 1) {
      conv.title = message.slice(0, 20) || '新对话'
    }
    conv.updatedAt = Date.now()

    // Add assistant message
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '已为您生成图片，查看画布上的效果。',
      timestamp: Date.now(),
    }
    conv.messages.push(assistantMsg)

    return HttpResponse.json(
      success({
        conversationId,
        message: assistantMsg,
        generatedImage,
      } as ChatMessageResp)
    )
  }),

  // POST /api/canvas/export
  http.post(`${API_BASE}/canvas/export`, async () => {
    await delay(3000)
    return HttpResponse.json(
      success({
        imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`,
      } as CanvasExportResp)
    )
  }),
]
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers/generator.ts
git commit -m "feat: add conversation API mock handlers"
```

---

## Task 14: Final verification and cleanup

**Files:**
- Run lint and build

- [ ] **Step 1: Run lint fix**

Run: `pnpm lint:fix`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Manual testing**

Run: `pnpm dev`
Test:
1. Sidebar shows 3 items: AI绘图, 素材库, 工具箱
2. `/canvas` shows AiDrawLanding with history list
3. Click "开始新对话" navigates to `/canvas/:id`
4. Canvas page shows floating chat with back button
5. `/tools` shows only OCR card

- [ ] **Step 4: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

---

## Success Criteria

- [ ] Sidebar shows only 3 items: AI绘图, 素材库, 工具箱
- [ ] AI绘图首页 shows welcome + history list
- [ ] Clicking history or "start new" enters full-screen canvas
- [ ] Canvas page restores messages and canvas items from history
- [ ] Tools page shows only OCR card
- [ ] All builds and lint passes
- [ ] No FSD layer violations