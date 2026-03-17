# 菜单重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构应用菜单结构，移除创作中心，新增作品集功能，保持科技感UI风格。

**Architecture:** 扁平路由结构，三个顶级菜单（项目库、工具箱、作品集），项目详情使用Tab切换素材库和作品集。

**Tech Stack:** React 19, TypeScript, TanStack Query, Zustand, shadcn/ui, Tailwind CSS 4

---

## Task 1: 移除创作中心模块

**Files:**
- Delete: `src/features/creation/` (整个目录)
- Modify: `src/app/router/index.tsx`

**Step 1: 删除创作中心目录**

```bash
rm -rf src/features/creation
```

**Step 2: 更新路由配置，移除创作中心路由**

修改 `src/app/router/index.tsx`:

```typescript
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Home = lazy(() => import('@/pages/Home'))
const AiTools = lazy(() => import('@/features/ai-tools').then(m => ({ default: m.AiTools })))
const ProjectDetail = lazy(() =>
  import('@/features/project').then(m => ({ default: m.ProjectDetail }))
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tools',
        element: <AiTools />,
      },
      {
        path: 'project/:id',
        element: <ProjectDetail />,
      },
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

**Step 3: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 4: 提交**

```bash
git add -A && git commit -m "refactor: remove creation center module"
```

---

## Task 2: 更新侧边栏导航

**Files:**
- Modify: `src/shared/components/layout/Sidebar.tsx`

**Step 1: 更新导航项配置**

修改 `src/shared/components/layout/Sidebar.tsx`:

```typescript
import { FolderOpen, Layers, LogOut, Sparkles } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const navItems = [
    {
      path: '/',
      icon: Layers,
      label: '项目库',
      description: '项目概览',
    },
    {
      path: '/tools',
      icon: Sparkles,
      label: '工具箱',
      description: 'AI工具',
    },
    {
      path: '/portfolio',
      icon: FolderOpen,
      label: '作品集',
      description: '全部作品',
    },
  ]

  const handleLogout = () => {
    logoutMutation.mutate()
    navigate('/login', { replace: true })
  }

  return (
    <aside className='fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-gray-800 flex flex-col'>
      {/* Logo Section */}
      <div className='p-6 border-b border-gray-800'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex-shrink-0'>
            <Layers className='w-5 h-5 text-cyan-400' />
          </div>
          <div className='overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
            <h1 className='text-lg font-bold text-white'>智绘工坊</h1>
            <p className='text-xs text-gray-500'>AI 创作平台</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800/50 border border-transparent'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'scale-110')} />
              <div className='flex-1 overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
                <div className='text-sm font-medium'>{item.label}</div>
                <div className='text-xs text-gray-600'>{item.description}</div>
              </div>
              {isActive && (
                <div className='absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse' />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer - Logout */}
      <div className='p-3 space-y-1'>
        <button
          type='button'
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300',
            'text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30'
          )}
          title='退出登录'
        >
          <LogOut className='w-5 h-5 flex-shrink-0' />
          <span className='text-sm font-medium flex-1 text-left overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
            退出登录
          </span>
        </button>
      </div>
    </aside>
  )
}
```

**Step 2: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 3: 提交**

```bash
git add src/shared/components/layout/Sidebar.tsx && git commit -m "refactor: update sidebar navigation items"
```

---

## Task 3: 创建作品集模块基础结构

**Files:**
- Create: `src/features/portfolio/types.ts`
- Create: `src/features/portfolio/api.ts`
- Create: `src/features/portfolio/hooks.ts`
- Create: `src/features/portfolio/index.ts`

**Step 1: 创建类型定义**

创建 `src/features/portfolio/types.ts`:

```typescript
export type WorkType = 'text' | 'image' | 'video'

export interface Work {
  id: string
  projectId?: string
  projectName?: string
  type: WorkType
  content: string
  prompt: string
  engine?: string
  createdAt: string
}

export interface CreateWorkRequest {
  projectId?: string
  type: WorkType
  content: string
  prompt: string
  engine?: string
}

export interface WorksFilter {
  projectId?: string
  type?: WorkType
  search?: string
}
```

**Step 2: 创建 API 层**

创建 `src/features/portfolio/api.ts`:

```typescript
import type { CreateWorkRequest, Work, WorksFilter } from './types'
import { api } from '@/lib/api'

export const portfolioApi = {
  list: (filter?: WorksFilter) => {
    const params = new URLSearchParams()
    if (filter?.projectId) params.set('projectId', filter.projectId)
    if (filter?.type) params.set('type', filter.type)
    if (filter?.search) params.set('search', filter.search)
    const query = params.toString()
    return api.get<Work[]>(`/works${query ? `?${query}` : ''}`)
  },

  create: (data: CreateWorkRequest) => api.post<Work, CreateWorkRequest>('/works', data),

  delete: (id: string) => api.delete<void>(`/works/${id}`),
}
```

**Step 3: 创建 Query Keys 和 Hooks**

创建 `src/features/portfolio/hooks.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateWorkRequest, WorksFilter } from './types'
import { portfolioApi } from './api'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  list: (filter?: WorksFilter) => [...portfolioKeys.all, 'list', filter] as const,
}

export function useWorks(filter?: WorksFilter) {
  return useQuery({
    queryKey: portfolioKeys.list(filter),
    queryFn: () => portfolioApi.list(filter),
  })
}

export function useCreateWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkRequest) => portfolioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}

export function useDeleteWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
```

**Step 4: 创建模块导出**

创建 `src/features/portfolio/index.ts`:

```typescript
export * from './types'
export * from './api'
export * from './hooks'
```

**Step 5: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 6: 提交**

```bash
git add src/features/portfolio && git commit -m "feat: add portfolio feature module"
```

---

## Task 4: 创建作品集页面

**Files:**
- Create: `src/features/portfolio/components/Portfolio.tsx`
- Create: `src/features/portfolio/components/WorkCard.tsx`
- Create: `src/features/portfolio/components/CollectDialog.tsx`
- Create: `src/features/portfolio/components/index.ts`
- Modify: `src/features/portfolio/index.ts`
- Modify: `src/app/router/index.tsx`
- Create: `src/pages/Portfolio.tsx`

**Step 1: 创建作品卡片组件**

创建 `src/features/portfolio/components/WorkCard.tsx`:

```typescript
import { FileText, Film, Image, Trash2 } from 'lucide-react'
import type { Work } from '../types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

interface WorkCardProps {
  work: Work
  onDelete?: (id: string) => void
}

const typeConfig = {
  text: { icon: FileText, label: '文本', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  image: { icon: Image, label: '图片', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  video: { icon: Film, label: '视频', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
}

export function WorkCard({ work, onDelete }: WorkCardProps) {
  const config = typeConfig[work.type]
  const Icon = config.icon

  return (
    <Card className='group relative bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-gray-600/50 hover:shadow-lg hover:shadow-cyan-500/5'>
      <div className='aspect-square relative'>
        {work.type === 'image' && work.content ? (
          <img src={work.content} alt={work.prompt} className='w-full h-full object-cover' />
        ) : work.type === 'video' && work.content ? (
          <video src={work.content} className='w-full h-full object-cover' muted />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gray-800/50'>
            <Icon className='w-12 h-12 text-gray-600' />
          </div>
        )}

        <div className='absolute top-2 left-2'>
          <Badge className={`${config.color} border`}>
            <Icon className='w-3 h-3 mr-1' />
            {config.label}
          </Badge>
        </div>

        <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onDelete?.(work.id)}
            className='text-red-400 hover:text-red-300 hover:bg-red-500/20'
          >
            <Trash2 className='w-5 h-5' />
          </Button>
        </div>
      </div>

      <div className='p-3'>
        {work.projectName && (
          <p className='text-xs text-gray-500 mb-1'>来自: {work.projectName}</p>
        )}
        <p className='text-sm text-gray-400 line-clamp-2'>{work.prompt}</p>
        <p className='text-xs text-gray-600 mt-2'>
          {new Date(work.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Card>
  )
}
```

**Step 2: 创建收藏弹窗组件**

创建 `src/features/portfolio/components/CollectDialog.tsx`:

```typescript
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { WorkType } from '../types'
import { useCreateWork } from '../hooks'
import { useProjects } from '@/features/project/hooks'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'

interface CollectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: WorkType
  content: string
  prompt: string
  engine?: string
  onSuccess?: () => void
}

export function CollectDialog({
  open,
  onOpenChange,
  type,
  content,
  prompt,
  engine,
  onSuccess,
}: CollectDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined)
  const { data: projects = [] } = useProjects()
  const createWork = useCreateWork()

  const handleCollect = () => {
    createWork.mutate(
      {
        projectId: selectedProject,
        type,
        content,
        prompt,
        engine,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-gray-900 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-white flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-cyan-400' />
            收藏到作品集
          </DialogTitle>
          <DialogDescription className='text-gray-500'>
            选择将作品收藏到项目或全局作品集
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-2'>
          <button
            type='button'
            onClick={() => setSelectedProject(undefined)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              selectedProject === undefined
                ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center'>
              {selectedProject === undefined && <Check className='w-4 h-4' />}
            </div>
            <span className='text-sm font-medium'>全局作品集</span>
          </button>

          {projects.map(project => (
            <button
              key={project.id}
              type='button'
              onClick={() => setSelectedProject(project.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedProject === project.id
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                  : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center'>
                {selectedProject === project.id && <Check className='w-4 h-4' />}
              </div>
              <span className='text-sm font-medium'>{project.name}</span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
          >
            取消
          </Button>
          <Button
            onClick={handleCollect}
            disabled={createWork.isPending}
            className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
          >
            {createWork.isPending ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                收藏中...
              </>
            ) : (
              '确认收藏'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 3: 创建作品集页面组件**

创建 `src/features/portfolio/components/Portfolio.tsx`:

```typescript
import { FolderOpen, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { WorkType } from '../types'
import { useDeleteWork, useWorks } from '../hooks'
import { useProjects } from '@/features/project/hooks'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { toast } from 'sonner'
import { WorkCard } from './WorkCard'

export function Portfolio() {
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: projects = [] } = useProjects()
  const { data: works = [], isLoading } = useWorks({
    projectId: projectFilter !== 'all' ? projectFilter : undefined,
    type: typeFilter !== 'all' ? (typeFilter as WorkType) : undefined,
    search: searchQuery || undefined,
  })
  const deleteWork = useDeleteWork()

  const handleDelete = (id: string) => {
    deleteWork.mutate(id, {
      onSuccess: () => toast.success('作品已删除'),
      onError: () => toast.error('删除失败'),
    })
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30'>
              <FolderOpen className='w-6 h-6 text-teal-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white tracking-tight'>作品集</h1>
              <p className='text-sm text-gray-500 mt-1'>全部作品 · {works.length} 件</p>
            </div>
          </div>

          <div className='flex gap-4'>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className='w-40 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部项目' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部项目</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-32 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部类型' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部类型</SelectItem>
                <SelectItem value='text'>文本</SelectItem>
                <SelectItem value='image'>图片</SelectItem>
                <SelectItem value='video'>视频</SelectItem>
              </SelectContent>
            </Select>

            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <input
                type='text'
                placeholder='搜索作品...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full h-10 pl-10 pr-4 bg-gray-900/50 border border-gray-700/30 rounded-md text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors'
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-500'>加载中...</div>
          </div>
        ) : works.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {works.map(work => (
              <WorkCard key={work.id} work={work} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse' />
                  <Sparkles className='relative w-16 h-16 text-gray-600' />
                </div>
              </div>
              <p className='text-gray-500 text-lg'>暂无作品</p>
              <p className='text-gray-600 text-sm mt-2'>使用AI工具创作并收藏你的第一个作品</p>
              <Button
                onClick={() => window.location.href = '/tools'}
                variant='outline'
                className='mt-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
              >
                前往工具箱
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 4: 创建组件导出**

创建 `src/features/portfolio/components/index.ts`:

```typescript
export { Portfolio } from './Portfolio'
export { WorkCard } from './WorkCard'
export { CollectDialog } from './CollectDialog'
```

**Step 5: 更新模块导出**

修改 `src/features/portfolio/index.ts`:

```typescript
export * from './types'
export * from './api'
export * from './hooks'
export * from './components'
```

**Step 6: 创建页面入口**

创建 `src/pages/Portfolio.tsx`:

```typescript
import { Portfolio } from '@/features/portfolio'

export default Portfolio
```

**Step 7: 更新路由配置**

修改 `src/app/router/index.tsx`，添加作品集路由:

```typescript
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Home = lazy(() => import('@/pages/Home'))
const Portfolio = lazy(() => import('@/pages/Portfolio'))
const AiTools = lazy(() => import('@/features/ai-tools').then(m => ({ default: m.AiTools })))
const ProjectDetail = lazy(() =>
  import('@/features/project').then(m => ({ default: m.ProjectDetail }))
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'tools',
        element: <AiTools />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      {
        path: 'project/:id',
        element: <ProjectDetail />,
      },
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

**Step 8: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 9: 提交**

```bash
git add -A && git commit -m "feat: add portfolio page with filtering and deletion"
```

---

## Task 5: 重构项目详情页为Tab布局

**Files:**
- Modify: `src/features/project/components/ProjectDetail.tsx`
- Create: `src/features/project/components/MaterialsTab.tsx`
- Create: `src/features/project/components/WorksTab.tsx`

**Step 1: 创建素材库Tab组件**

创建 `src/features/project/components/MaterialsTab.tsx`:

```typescript
import { FileText, Film, Image, Plus, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

interface Material {
  id: string
  type: 'text' | 'image' | 'video'
  name: string
  content: string
  createdAt: string
}

interface MaterialsTabProps {
  materials: Material[]
  onUpload: () => void
  onDelete: (id: string) => void
}

const typeConfig = {
  text: { icon: FileText, label: '文本', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  image: { icon: Image, label: '图片', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  video: { icon: Film, label: '视频', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
}

export function MaterialsTab({ materials, onUpload, onDelete }: MaterialsTabProps) {
  const [filter, setFilter] = useState<'all' | 'text' | 'image' | 'video'>('all')

  const filteredMaterials = materials.filter(m => 
    filter === 'all' || m.type === filter
  )

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex gap-2'>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}
          >
            全部
          </Button>
          <Button
            variant={filter === 'text' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('text')}
            className={filter === 'text' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}
          >
            <FileText className='w-4 h-4 mr-1' />
            文本
          </Button>
          <Button
            variant={filter === 'image' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('image')}
            className={filter === 'image' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}
          >
            <Image className='w-4 h-4 mr-1' />
            图片
          </Button>
          <Button
            variant={filter === 'video' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('video')}
            className={filter === 'video' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}
          >
            <Film className='w-4 h-4 mr-1' />
            视频
          </Button>
        </div>

        <Button
          onClick={onUpload}
          className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
        >
          <Upload className='w-4 h-4 mr-2' />
          上传素材
        </Button>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className='flex-1 overflow-auto'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            {filteredMaterials.map(material => {
              const config = typeConfig[material.type]
              const Icon = config.icon

              return (
                <Card
                  key={material.id}
                  className='group relative bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-gray-600/50'
                >
                  <div className='aspect-square relative'>
                    {material.type === 'image' && material.content ? (
                      <img src={material.content} alt={material.name} className='w-full h-full object-cover' />
                    ) : material.type === 'video' && material.content ? (
                      <video src={material.content} className='w-full h-full object-cover' muted />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-800/50'>
                        <Icon className='w-12 h-12 text-gray-600' />
                      </div>
                    )}

                    <div className='absolute top-2 left-2'>
                      <Badge className={`${config.color} border`}>
                        <Icon className='w-3 h-3 mr-1' />
                        {config.label}
                      </Badge>
                    </div>

                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onDelete(material.id)}
                        className='text-red-400 hover:text-red-300 hover:bg-red-500/20'
                      >
                        <Trash2 className='w-5 h-5' />
                      </Button>
                    </div>
                  </div>

                  <div className='p-3'>
                    <p className='text-sm text-gray-300 truncate'>{material.name}</p>
                    <p className='text-xs text-gray-600 mt-1'>
                      {new Date(material.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4'>
              <Plus className='w-8 h-8 text-gray-600' />
            </div>
            <p className='text-gray-500'>暂无素材</p>
            <p className='text-gray-600 text-sm mt-1'>点击上传添加素材</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 2: 创建作品集Tab组件**

创建 `src/features/project/components/WorksTab.tsx`:

```typescript
import { FileText, Film, Image, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Work } from '@/features/portfolio/types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

interface WorksTabProps {
  works: Work[]
  onDelete: (id: string) => void
}

const typeConfig = {
  text: { icon: FileText, label: '文本', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  image: { icon: Image, label: '图片', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  video: { icon: Film, label: '视频', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
}

export function WorksTab({ works, onDelete }: WorksTabProps) {
  const navigate = useNavigate()

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <span className='text-sm text-gray-500'>{works.length} 个作品</span>
        <Button
          onClick={() => navigate('/tools')}
          className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          开始AI创作
        </Button>
      </div>

      {works.length > 0 ? (
        <div className='flex-1 overflow-auto'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            {works.map(work => {
              const config = typeConfig[work.type]
              const Icon = config.icon

              return (
                <Card
                  key={work.id}
                  className='group relative bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-gray-600/50'
                >
                  <div className='aspect-square relative'>
                    {work.type === 'image' && work.content ? (
                      <img src={work.content} alt={work.prompt} className='w-full h-full object-cover' />
                    ) : work.type === 'video' && work.content ? (
                      <video src={work.content} className='w-full h-full object-cover' muted />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-800/50'>
                        <Icon className='w-12 h-12 text-gray-600' />
                      </div>
                    )}

                    <div className='absolute top-2 left-2'>
                      <Badge className={`${config.color} border`}>
                        <Icon className='w-3 h-3 mr-1' />
                        {config.label}
                      </Badge>
                    </div>

                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onDelete(work.id)}
                        className='text-red-400 hover:text-red-300 hover:bg-red-500/20'
                      >
                        <Trash2 className='w-5 h-5' />
                      </Button>
                    </div>
                  </div>

                  <div className='p-3'>
                    <p className='text-sm text-gray-400 line-clamp-2'>{work.prompt}</p>
                    <p className='text-xs text-gray-600 mt-2'>
                      {new Date(work.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4'>
              <Plus className='w-8 h-8 text-gray-600' />
            </div>
            <p className='text-gray-500'>暂无作品</p>
            <p className='text-gray-600 text-sm mt-1'>使用AI工具创作并收藏你的作品</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 3: 重构项目详情页**

修改 `src/features/project/components/ProjectDetail.tsx`:

```typescript
import { BookOpen, ChevronRight, FolderOpen, Layers } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MaterialsTab } from './MaterialsTab'
import { WorksTab } from './WorksTab'
import { useProject, useRecords, useTemplates } from '@/features/project/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id!)
  const { data: allTemplates = [] } = useTemplates()
  const { data: records = [] } = useRecords(id!)
  const [activeTab, setActiveTab] = useState<'materials' | 'works'>('materials')

  const handleStartCreation = () => {
    navigate('/tools')
  }

  const handleUploadMaterial = () => {
    console.log('Upload material')
  }

  const handleDeleteMaterial = (materialId: string) => {
    console.log('Delete material:', materialId)
  }

  const handleDeleteWork = (workId: string) => {
    console.log('Delete work:', workId)
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

  const presetTemplates = allTemplates.filter(t => project.presetTemplateIds?.includes(t.id))

  const materials = presetTemplates.map(t => ({
    id: t.id,
    type: 'text' as const,
    name: t.name,
    content: t.content,
    createdAt: new Date().toISOString(),
  }))

  const works = records.map(r => ({
    id: r.id,
    projectId: id,
    type: r.type as 'text' | 'image' | 'video',
    content: r.content,
    prompt: r.prompt || '',
    createdAt: r.createdAt,
  }))

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
                {project.description && <p className='text-gray-400 mb-3'>{project.description}</p>}
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
                <ChevronRight className='mr-2 h-4 w-4' />
                开始AI创作
              </Button>
            </div>
          </div>

          <div className='flex gap-2 border-b border-gray-800'>
            <button
              type='button'
              onClick={() => setActiveTab('materials')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                activeTab === 'materials'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              )}
            >
              <Layers className='w-4 h-4' />
              素材库
              <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full'>{materials.length}</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('works')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                activeTab === 'works'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              )}
            >
              <FolderOpen className='w-4 h-4' />
              作品集
              <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full'>{works.length}</span>
            </button>
          </div>
        </div>

        <Card className='h-[calc(100vh-350px)] bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
          {activeTab === 'materials' ? (
            <MaterialsTab
              materials={materials}
              onUpload={handleUploadMaterial}
              onDelete={handleDeleteMaterial}
            />
          ) : (
            <WorksTab works={works} onDelete={handleDeleteWork} />
          )}
        </Card>
      </div>
    </div>
  )
}
```

**Step 4: 更新组件导出**

修改 `src/features/project/components/index.ts`:

```typescript
export { ProjectCard } from './ProjectCard'
export { ProjectDetail } from './ProjectDetail'
export { PresetMaterials } from './PresetMaterials'
export { CreationRecords } from './CreationRecords'
export { MaterialsTab } from './MaterialsTab'
export { WorksTab } from './WorksTab'
```

**Step 5: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 6: 提交**

```bash
git add -A && git commit -m "refactor: update project detail page with tab layout"
```

---

## Task 6: 为AI工具箱添加收藏功能

**Files:**
- Modify: `src/features/ai-tools/components/AiTools.tsx`

**Step 1: 导入收藏弹窗组件**

在 `src/features/ai-tools/components/AiTools.tsx` 文件顶部添加导入:

```typescript
import { useState } from 'react'
import { Image, Sparkles, Type, Video, Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { CollectDialog } from '@/features/portfolio/components'
import type { WorkType } from '@/features/portfolio/types'
```

**Step 2: 添加收藏状态和弹窗**

在组件内部添加:

```typescript
const [collectDialogOpen, setCollectDialogOpen] = useState(false)
const [generatedContent, setGeneratedContent] = useState('')

const handleGenerate = () => {
  const placeholderContent = {
    text: '在 2147 年的新东京，霓虹灯闪烁的街道上，一台老旧的机器人正在修理自己的核心电路。它的机械手指颤抖着，微小的电火花在指间跳跃。周围是全息广告牌，播放着最新的脑机接口广告。',
    image: 'https://picsum.photos/512/512',
    video: 'https://example.com/video.mp4',
  }
  setGeneratedContent(placeholderContent[activeTab])
  toast.success('生成完成')
}

const handleCollect = () => {
  if (!generatedContent) {
    toast.error('请先生成内容')
    return
  }
  setCollectDialogOpen(true)
}

const handleCollectSuccess = () => {
  toast.success('已收藏到作品集')
  setGeneratedContent('')
}
```

**Step 3: 在预览区域添加收藏按钮**

在预览区域的内容区域添加:

```typescript
{generatedContent ? (
  <div className='relative w-full h-full flex items-center justify-center'>
    {activeTab === 'text' ? (
      <div className='p-6 text-gray-300 max-w-2xl'>{generatedContent}</div>
    ) : activeTab === 'image' ? (
      <img src={generatedContent} alt='Generated' className='max-w-full max-h-full object-contain' />
    ) : (
      <video src={generatedContent} className='max-w-full max-h-full' controls />
    )}
    <Button
      onClick={handleCollect}
      className='absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
    >
      <Bookmark className='w-4 h-4 mr-2' />
      收藏到作品集
    </Button>
  </div>
) : (
  // 原有的空状态 UI
)}
```

**Step 4: 在组件末尾添加收藏弹窗**

```typescript
<CollectDialog
  open={collectDialogOpen}
  onOpenChange={setCollectDialogOpen}
  type={activeTab as WorkType}
  content={generatedContent}
  prompt={prompt}
  engine={activeTab === 'image' ? 'gemini' : activeTab === 'video' ? 'veo' : undefined}
  onSuccess={handleCollectSuccess}
/>
```

**Step 5: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 6: 提交**

```bash
git add src/features/ai-tools/components/AiTools.tsx && git commit -m "feat: add collect to portfolio feature in AI tools"
```

---

## Task 7: 添加 MSW Mock 数据

**Files:**
- Create: `src/mocks/handlers/portfolio.ts`
- Modify: `src/mocks/handlers/index.ts`
- Modify: `src/mocks/db.ts`

**Step 1: 添加 Mock 数据库**

修改 `src/mocks/db.ts`:

```typescript
import type { Work } from '@/features/portfolio/types'

export const mockWorks: Work[] = [
  {
    id: '1',
    projectId: '1',
    projectName: '科幻短片创作',
    type: 'image',
    content: 'https://picsum.photos/512/512?random=1',
    prompt: '赛博朋克风格的街道',
    engine: 'gemini',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    projectId: '1',
    projectName: '科幻短片创作',
    type: 'video',
    content: 'https://example.com/video.mp4',
    prompt: '机器人在城市中行走',
    engine: 'veo',
    createdAt: '2024-03-14T14:30:00Z',
  },
  {
    id: '3',
    type: 'text',
    content: '在遥远的未来，人类与AI和谐共存...',
    prompt: '写一段科幻小说开头',
    createdAt: '2024-03-13T09:00:00Z',
  },
]
```

**Step 2: 创建作品集 Handler**

创建 `src/mocks/handlers/portfolio.ts`:

```typescript
import { http, HttpResponse } from 'msw'
import { mockWorks } from '../db'
import type { CreateWorkRequest, Work } from '@/features/portfolio/types'

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
      works = works.filter(w => 
        w.prompt.toLowerCase().includes(search.toLowerCase()) ||
        w.content.toLowerCase().includes(search.toLowerCase())
      )
    }

    return HttpResponse.json({ data: works })
  }),

  http.post('/api/works', async ({ request }) => {
    const body = await request.json() as CreateWorkRequest
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
```

**Step 3: 注册 Handler**

修改 `src/mocks/handlers/index.ts`:

```typescript
import { authHandlers } from './auth'
import { projectHandlers } from './projects'
import { portfolioHandlers } from './portfolio'

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...portfolioHandlers,
]
```

**Step 4: 运行 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 5: 提交**

```bash
git add src/mocks && git commit -m "feat: add portfolio mock handlers"
```

---

## Task 8: 最终验证

**Step 1: 运行完整 lint 检查**

Run: `pnpm lint`
Expected: 无错误

**Step 2: 运行类型检查**

Run: `pnpm build`
Expected: 构建成功

**Step 3: 启动开发服务器验证**

Run: `pnpm dev`
Expected: 服务启动成功

**Step 4: 手动验证功能**

1. 访问 `/login` 登录
2. 检查侧边栏显示三个菜单项
3. 点击「项目库」查看项目列表
4. 点击项目进入详情，检查 Tab 切换
5. 点击「工具箱」测试 AI 工具
6. 点击「作品集」查看作品列表

**Step 5: 最终提交**

```bash
git add -A && git commit -m "feat: complete menu refactor with portfolio feature"
```