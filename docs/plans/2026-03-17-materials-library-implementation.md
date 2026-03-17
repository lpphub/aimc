# 素材库实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 新增素材库功能模块，支持用户上传图片/视频、标签分组、批量操作

**Architecture:** 新建 features/materials 模块，包含 types、api、hooks、components；新增路由 /materials；修改 Sidebar 添加菜单项

**Tech Stack:** React 19, TanStack Query, Zustand, shadcn/ui, MSW

---

### Task 1: 定义素材库数据类型

**Files:**
- Create: `src/features/materials/types.ts`

**Step 1: 创建类型定义**

```typescript
export type MaterialType = 'image' | 'video'

export interface Material {
  id: string
  type: MaterialType
  url: string
  filename: string
  size: number
  tags: string[]
  createdAt: string
}

export interface CreateMaterialRequest {
  file: File
  tags?: string[]
}

export interface MaterialsFilter {
  tags?: string[]
  search?: string
}

export interface BatchUpdateTagsRequest {
  ids: string[]
  tags: string[]
  mode: 'add' | 'replace'
}
```

**Step 2: 创建模块导出文件**

Create: `src/features/materials/index.ts`

```typescript
export * from './types'
export * from './api'
export * from './hooks'
export { Materials } from './components/Materials'
```

**Step 3: 提交**

```bash
git add src/features/materials/types.ts src/features/materials/index.ts
git commit -m "feat(materials): add type definitions"
```

---

### Task 2: 创建 API 接口

**Files:**
- Create: `src/features/materials/api.ts`

**Step 1: 实现 API 函数**

```typescript
import { ky } from '@/lib/api'
import type { Material, CreateMaterialRequest, MaterialsFilter, BatchUpdateTagsRequest } from './types'

export async function getMaterials(filter?: MaterialsFilter): Promise<Material[]> {
  const params = new URLSearchParams()
  if (filter?.tags?.length) {
    params.set('tags', filter.tags.join(','))
  }
  if (filter?.search) {
    params.set('search', filter.search)
  }
  const query = params.toString()
  return ky.get(`materials${query ? `?${query}` : ''}`).json<Material[]>()
}

export async function uploadMaterial(data: CreateMaterialRequest): Promise<Material> {
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.tags?.length) {
    formData.append('tags', JSON.stringify(data.tags))
  }
  return ky.post('materials', { body: formData }).json<Material>()
}

export async function deleteMaterial(id: string): Promise<void> {
  await ky.delete(`materials/${id}`)
}

export async function batchUpdateTags(data: BatchUpdateTagsRequest): Promise<Material[]> {
  return ky.patch('materials/batch-tags', { json: data }).json<Material[]>()
}

export async function getMaterialTags(): Promise<string[]> {
  return ky.get('materials/tags').json<string[]>()
}
```

**Step 2: 提交**

```bash
git add src/features/materials/api.ts
git commit -m "feat(materials): add API functions"
```

---

### Task 3: 创建 React Hooks

**Files:**
- Create: `src/features/materials/hooks.ts`

**Step 1: 实现 hooks**

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from './api'
import type { MaterialsFilter, CreateMaterialRequest, BatchUpdateTagsRequest } from './types'

export function useMaterials(filter?: MaterialsFilter) {
  return useQuery({
    queryKey: ['materials', filter],
    queryFn: () => api.getMaterials(filter),
  })
}

export function useUploadMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => api.uploadMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('上传成功')
    },
    onError: () => toast.error('上传失败'),
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('删除成功')
    },
    onError: () => toast.error('删除失败'),
  })
}

export function useBatchUpdateTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BatchUpdateTagsRequest) => api.batchUpdateTags(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      toast.success('标签更新成功')
    },
    onError: () => toast.error('标签更新失败'),
  })
}

export function useMaterialTags() {
  return useQuery({
    queryKey: ['material-tags'],
    queryFn: () => api.getMaterialTags(),
  })
}
```

**Step 2: 提交**

```bash
git add src/features/materials/hooks.ts
git commit -m "feat(materials): add React hooks"
```

---

### Task 4: 创建 MSW Mock Handlers

**Files:**
- Create: `src/mocks/handlers/materials.ts`
- Modify: `src/mocks/handlers/index.ts`

**Step 1: 创建 mock 数据库扩展**

Modify: `src/mocks/db.ts`

添加 Material 类型：

```typescript
export interface Material {
  id: string
  type: 'image' | 'video'
  url: string
  filename: string
  size: number
  tags: string[]
  createdAt: string
}
```

**Step 2: 创建 handlers**

Create: `src/mocks/handlers/materials.ts`

```typescript
import { http, HttpResponse } from 'msw'
import { materials as db } from '../db'

const generateId = () => Math.random().toString(36).substring(7)

export const materialsHandlers = [
  http.get('/api/materials', ({ request }) => {
    const url = new URL(request.url)
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean)
    const search = url.searchParams.get('search')

    let result = db.materials

    if (tags?.length) {
      result = result.filter(m => tags.some(tag => m.tags.includes(tag)))
    }
    if (search) {
      result = result.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()))
    }

    return HttpResponse.json(result)
  }),

  http.post('/api/materials', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tags = JSON.parse(formData.get('tags') as string || '[]')

    const material = {
      id: generateId(),
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
      tags,
      createdAt: new Date().toISOString(),
    }
    db.materials.push(material)
    return HttpResponse.json(material)
  }),

  http.delete('/api/materials/:id', ({ params }) => {
    const index = db.materials.findIndex(m => m.id === params.id)
    if (index !== -1) {
      db.materials.splice(index, 1)
    }
    return HttpResponse.json({})
  }),

  http.patch('/api/materials/batch-tags', async ({ request }) => {
    const { ids, tags, mode } = await request.json()
    const updated: typeof db.materials = []

    ids.forEach((id: string) => {
      const material = db.materials.find(m => m.id === id)
      if (material) {
        if (mode === 'replace') {
          material.tags = tags
        } else {
          material.tags = [...new Set([...material.tags, ...tags])]
        }
        updated.push(material)
      }
    })

    return HttpResponse.json(updated)
  }),

  http.get('/api/materials/tags', () => {
    const allTags = new Set<string>()
    db.materials.forEach(m => m.tags.forEach(t => allTags.add(t)))
    return HttpResponse.json([...allTags])
  }),
]
```

**Step 3: 注册 handlers**

Modify: `src/mocks/handlers/index.ts`

```typescript
import { materialsHandlers } from './materials'

export const handlers = [
  // ... existing handlers
  ...materialsHandlers,
]
```

**Step 4: 提交**

```bash
git add src/mocks/handlers/materials.ts src/mocks/handlers/index.ts src/mocks/db.ts
git commit -m "feat(materials): add MSW mock handlers"
```

---

### Task 5: 创建素材卡片组件

**Files:**
- Create: `src/features/materials/components/MaterialCard.tsx`

**Step 1: 实现 MaterialCard**

```typescript
import { CheckCircle, FileImage, FileVideo } from 'lucide-react'
import type { Material } from '../types'
import { cn } from '@/lib/utils'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const isVideo = material.type === 'video'

  return (
    <div
      onClick={() => onSelect(material.id)}
      className={cn(
        'relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-200',
        isSelected
          ? 'border-cyan-500 ring-2 ring-cyan-500/30'
          : 'border-gray-800 hover:border-gray-700'
      )}
    >
      <div className='aspect-square bg-gray-900/50'>
        {isVideo ? (
          <video
            src={material.url}
            className='w-full h-full object-cover'
            muted
          />
        ) : (
          <img
            src={material.url}
            alt={material.filename}
            className='w-full h-full object-cover'
          />
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        <div className='absolute top-2 right-2'>
          {isSelected ? (
            <CheckCircle className='w-6 h-6 text-cyan-500 fill-cyan-500/20' />
          ) : (
            <div className='w-6 h-6 rounded-full border-2 border-gray-600 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity' />
          )}
        </div>

        <div className='absolute top-2 left-2'>
          {isVideo ? (
            <FileVideo className='w-5 h-5 text-purple-400' />
          ) : (
            <FileImage className='w-5 h-5 text-blue-400' />
          )}
        </div>
      </div>

      <div className='p-3'>
        <p className='text-sm text-white truncate'>{material.filename}</p>
        {material.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2'>
            {material.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className='px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded'
              >
                {tag}
              </span>
            ))}
            {material.tags.length > 3 && (
              <span className='px-2 py-0.5 text-xs text-gray-500'>+{material.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add src/features/materials/components/MaterialCard.tsx
git commit -m "feat(materials): add MaterialCard component"
```

---

### Task 6: 创建批量操作栏组件

**Files:**
- Create: `src/features/materials/components/BatchActionBar.tsx`

**Step 1: 实现 BatchActionBar**

```typescript
import { X, Tag } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useBatchUpdateTags } from '../hooks'

interface BatchActionBarProps {
  selectedIds: string[]
  onClear: () => void
  onDelete: (ids: string[]) => void
}

export function BatchActionBar({ selectedIds, onClear, onDelete }: BatchActionBarProps) {
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const batchUpdateTags = useBatchUpdateTags()

  const handleAddTags = () => {
    if (!tagInput.trim()) return
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
    batchUpdateTags.mutate(
      { ids: selectedIds, tags, mode: 'add' },
      { onSuccess: () => {
        setShowTagInput(false)
        setTagInput('')
        onClear()
      }}
    )
  }

  if (selectedIds.length === 0) return null

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl'>
      <div className='flex items-center gap-4'>
        <span className='text-white'>
          已选择 <span className='text-cyan-400 font-semibold'>{selectedIds.length}</span> 项
        </span>

        <div className='h-6 w-px bg-gray-700' />

        {!showTagInput ? (
          <>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setShowTagInput(true)}
              className='border-gray-600 text-gray-300 hover:text-white'
            >
              <Tag className='w-4 h-4 mr-2' />
              添加标签
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => onDelete(selectedIds)}
            >
              删除
            </Button>
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <input
              type='text'
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder='输入标签，逗号分隔'
              className='h-8 px-3 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none'
              onKeyDown={e => e.key === 'Enter' && handleAddTags()}
              autoFocus
            />
            <Button size='sm' onClick={handleAddTags}>确定</Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                setShowTagInput(false)
                setTagInput('')
              }}
            >
              取消
            </Button>
          </div>
        )}

        <div className='h-6 w-px bg-gray-700' />

        <button
          onClick={onClear}
          className='p-1 hover:bg-gray-800 rounded transition-colors'
        >
          <X className='w-5 h-5 text-gray-400' />
        </button>
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add src/features/materials/components/BatchActionBar.tsx
git commit -m "feat(materials): add BatchActionBar component"
```

---

### Task 7: 创建素材库主页面

**Files:**
- Create: `src/features/materials/components/Materials.tsx`
- Create: `src/features/materials/components/index.ts`

**Step 1: 实现 Materials 页面**

```typescript
import { Upload, Search, Tag, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDeleteMaterial, useMaterials, useMaterialTags, useUploadMaterial } from '../hooks'
import { MaterialCard } from './MaterialCard'
import { BatchActionBar } from './BatchActionBar'

export function Materials() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: materials = [], isLoading } = useMaterials({
    tags: tagFilter !== 'all' ? [tagFilter] : undefined,
    search: search || undefined,
  })
  const { data: allTags = [] } = useMaterialTags()
  const uploadMutation = useUploadMaterial()
  const deleteMutation = useDeleteMaterial()

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        toast.error(`${file.name} 不是支持的格式`)
        return
      }
      uploadMutation.mutate({ file })
    })
    e.target.value = ''
  }

  const handleBatchDelete = (ids: string[]) => {
    ids.forEach(id => deleteMutation.mutate(id))
    setSelectedIds([])
  }

  const clearSelection = () => setSelectedIds([])

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'>
              <Tag className='w-6 h-6 text-purple-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white tracking-tight'>素材库</h1>
              <p className='text-sm text-gray-500 mt-1'>管理你的图片和视频素材 · {materials.length} 个</p>
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <input
                type='text'
                placeholder='搜索素材...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='w-full h-10 pl-10 pr-4 bg-gray-900/50 border border-gray-700/30 rounded-md text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors'
              />
            </div>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className='w-40 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部标签' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部标签</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            >
              <Upload className='w-4 h-4 mr-2' />
              上传素材
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*,video/*'
              multiple
              className='hidden'
              onChange={handleUpload}
            />
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-500'>加载中...</div>
          </div>
        ) : materials.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                isSelected={selectedIds.includes(material.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse' />
                  <Tag className='relative w-16 h-16 text-gray-600' />
                </div>
              </div>
              <p className='text-gray-500 text-lg'>暂无素材</p>
              <p className='text-gray-600 text-sm mt-2'>上传你的第一个素材开始管理</p>
            </div>
          </div>
        )}
      </div>

      <BatchActionBar
        selectedIds={selectedIds}
        onClear={clearSelection}
        onDelete={handleBatchDelete}
      />
    </div>
  )
}
```

**Step 2: 创建组件导出**

Create: `src/features/materials/components/index.ts`

```typescript
export { Materials } from './Materials'
export { MaterialCard } from './MaterialCard'
export { BatchActionBar } from './BatchActionBar'
```

**Step 3: 提交**

```bash
git add src/features/materials/components/Materials.tsx src/features/materials/components/index.ts
git commit -m "feat(materials): add Materials main page"
```

---

### Task 8: 添加路由和页面入口

**Files:**
- Create: `src/pages/Materials.tsx`
- Modify: `src/app/router/index.tsx`

**Step 1: 创建页面入口**

Create: `src/pages/Materials.tsx`

```typescript
import { Materials } from '@/features/materials'

export default Materials
```

**Step 2: 添加路由**

Modify: `src/app/router/index.tsx`

在路由数组中添加 materials 路由：

```typescript
const Materials = lazy(() => import('@/pages/Materials'))

// 在 children 数组中添加：
{
  path: 'materials',
  element: <Materials />,
},
```

**Step 3: 提交**

```bash
git add src/pages/Materials.tsx src/app/router/index.tsx
git commit -m "feat(materials): add route and page entry"
```

---

### Task 9: 更新侧边栏菜单

**Files:**
- Modify: `src/shared/components/layout/Sidebar.tsx`

**Step 1: 修改菜单配置**

修改 `navItems` 数组，将「项目库」改为「作品集」，添加「素材库」：

```typescript
import { FolderOpen, Layers, LogOut, Sparkles, Tag } from 'lucide-react'

// ...

const navItems = [
  {
    path: '/portfolio',
    icon: FolderOpen,
    label: '作品集',
    description: 'AI创作结果',
  },
  {
    path: '/tools',
    icon: Sparkles,
    label: '工具箱',
    description: 'AI工具',
  },
  {
    path: '/materials',
    icon: Tag,
    label: '素材库',
    description: '素材管理',
  },
]
```

**Step 2: 更新 Logo 图标**

将 Logo 的 icon 从 Layers 改为其他图标（保持独特性）：

```typescript
<div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex-shrink-0'>
  <Sparkles className='w-5 h-5 text-cyan-400' />
</div>
```

**Step 3: 提交**

```bash
git add src/shared/components/layout/Sidebar.tsx
git commit -m "feat: update sidebar menu with materials"
```

---

### Task 10: 更新首页重定向

**Files:**
- Modify: `src/app/router/index.tsx`

**Step 1: 修改首页重定向**

将首页 `/` 重定向到 `/portfolio` 而非原来的首页：

```typescript
{
  index: true,
  element: <Navigate to='/portfolio' replace />,
},
```

**Step 2: 提交**

```bash
git add src/app/router/index.tsx
git commit -m "feat: redirect root to portfolio"
```

---

### Task 11: 验证功能

**Step 1: 启动开发服务器**

```bash
pnpm dev
```

**Step 2: 验证清单**

- [ ] 侧边栏显示「作品集」「工具箱」「素材库」三个菜单
- [ ] 点击「素材库」进入页面
- [ ] 页面显示上传按钮和搜索框
- [ ] 点击上传可以选择图片/视频文件
- [ ] 上传成功后素材显示在网格中
- [ ] 点击素材卡片可以选中
- [ ] 选中后底部显示批量操作栏
- [ ] 批量添加标签功能正常
- [ ] 按标签筛选功能正常
- [ ] 搜索功能正常

**Step 3: 运行 lint 检查**

```bash
pnpm lint
```

**Step 4: 最终提交**

```bash
git add -A
git commit -m "feat(materials): complete materials library feature"
```