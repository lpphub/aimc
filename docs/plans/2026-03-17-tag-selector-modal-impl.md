# 标签选择弹窗实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现标签选择弹窗组件，支持标签组分类、搜索、多选、创建标签等功能。

**Architecture:** 基于 shadcn/ui Dialog 组件构建弹窗，使用 TanStack Query 管理标签组数据，MSW 提供 mock API。

**Tech Stack:** React, TypeScript, TanStack Query, shadcn/ui, MSW, Tailwind CSS

---

## Task 1: 添加类型定义

**Files:**
- Modify: `src/features/materials/types.ts`

**Step 1: 添加 Tag 和 TagGroup 类型**

在 `src/features/materials/types.ts` 末尾添加：

```typescript
export interface Tag {
  id: number
  name: string
}

export interface TagGroup {
  id: number
  name: string
  tags: Tag[]
}

export const ALL_TAGS_GROUP_ID = '__all__'
```

**Step 2: 验证类型定义**

运行: `pnpm build`
预期: 编译成功，无类型错误

**Step 3: 提交**

```bash
git add src/features/materials/types.ts
git commit -m "feat(materials): add Tag and TagGroup types"
```

---

## Task 2: 添加 API 接口

**Files:**
- Modify: `src/features/materials/api.ts`

**Step 1: 添加 tag 相关 API 函数**

在 `src/features/materials/api.ts` 末尾添加：

```typescript
export async function getTagGroups(): Promise<TagGroup[]> {
  return api.get<TagGroup[]>('tag-groups')
}

export async function createTagGroup(name: string): Promise<TagGroup> {
  return api.post<TagGroup, { name: string }>('tag-groups', { name })
}

export async function createTag(name: string, groupId?: number): Promise<Tag> {
  return api.post<Tag, { name: string; groupId?: number }>('tags', { name, groupId })
}

export async function deleteTag(tagId: number): Promise<void> {
  return api.delete(`tags/${tagId}`)
}

export async function addTagsToMaterials(params: {
  materialIds: string[]
  tagIds: number[]
}): Promise<void> {
  return api.post<void, typeof params>('materials/tags', params)
}
```

**Step 2: 添加类型导入**

在文件顶部 import 区域添加：

```typescript
import type { Tag, TagGroup } from './types'
```

**Step 3: 验证编译**

运行: `pnpm build`
预期: 编译成功

**Step 4: 提交**

```bash
git add src/features/materials/api.ts
git commit -m "feat(materials): add tag groups API endpoints"
```

---

## Task 3: 添加 Query Hooks

**Files:**
- Modify: `src/features/materials/hooks.ts`

**Step 1: 添加 query keys**

在 `materialKeys` 定义后添加：

```typescript
export const tagKeys = {
  all: ['tags'] as const,
  groups: () => [...tagKeys.all, 'groups'] as const,
}
```

**Step 2: 添加 useTagGroups hook**

在文件末尾添加：

```typescript
export function useTagGroups() {
  return useQuery({
    queryKey: tagKeys.groups(),
    queryFn: () => api.getTagGroups(),
  })
}
```

**Step 3: 添加 useCreateTagGroup hook**

```typescript
export function useCreateTagGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => api.createTagGroup(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签组创建成功')
    },
    onError: () => toast.error('标签组创建失败'),
  })
}
```

**Step 4: 添加 useCreateTag hook**

```typescript
export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { name: string; groupId?: number }) =>
      api.createTag(params.name, params.groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签创建成功')
    },
    onError: () => toast.error('标签创建失败'),
  })
}
```

**Step 5: 添加 useDeleteTag hook**

```typescript
export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tagId: number) => api.deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签删除成功')
    },
    onError: () => toast.error('标签删除失败'),
  })
}
```

**Step 6: 添加 useAddTagsToMaterials hook**

```typescript
export function useAddTagsToMaterials() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { materialIds: string[]; tagIds: number[] }) =>
      api.addTagsToMaterials(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      toast.success('标签添加成功')
    },
    onError: () => toast.error('标签添加失败'),
  })
}
```

**Step 7: 添加 api 导入**

在文件顶部添加：

```typescript
import * as api from './api'
```

**Step 8: 验证编译**

运行: `pnpm build`
预期: 编译成功

**Step 9: 提交**

```bash
git add src/features/materials/hooks.ts
git commit -m "feat(materials): add tag groups query hooks"
```

---

## Task 4: 添加 MSW Mock Handlers

**Files:**
- Create: `src/mocks/handlers/tag-groups.ts`
- Modify: `src/mocks/handlers/index.ts`

**Step 1: 创建 tag-groups.ts**

```typescript
import { http, HttpResponse, delay } from 'msw'
import { env } from '@/shared/utils/env'

let tagGroups = [
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

export const tagGroupHandlers = [
  http.get(`${env.API_BASE_URL}tag-groups`, async () => {
    await delay(100)
    return HttpResponse.json({ code: 0, message: 'success', data: tagGroups })
  }),

  http.post(`${env.API_BASE_URL}tag-groups`, async ({ request }) => {
    await delay(100)
    const body = await request.json<{ name: string }>()
    const newGroup = { id: nextTagGroupId++, name: body.name, tags: [] }
    tagGroups.push(newGroup)
    return HttpResponse.json({ code: 0, message: 'success', data: newGroup })
  }),

  http.post(`${env.API_BASE_URL}tags`, async ({ request }) => {
    await delay(100)
    const body = await request.json<{ name: string; groupId?: number }>()
    const newTag = { id: nextTagId++, name: body.name }
    const group = tagGroups.find(g => g.id === body.groupId) ?? tagGroups[0]
    group.tags.push(newTag)
    return HttpResponse.json({ code: 0, message: 'success', data: newTag })
  }),

  http.delete(`${env.API_BASE_URL}tags/:id`, async ({ params }) => {
    await delay(100)
    const tagId = Number(params.id)
    for (const group of tagGroups) {
      group.tags = group.tags.filter(t => t.id !== tagId)
    }
    return HttpResponse.json({ code: 0, message: 'success', data: null })
  }),

  http.post(`${env.API_BASE_URL}materials/tags`, async () => {
    await delay(100)
    return HttpResponse.json({ code: 0, message: 'success', data: null })
  }),
]
```

**Step 2: 在 handlers/index.ts 中注册**

在 `src/mocks/handlers/index.ts` 中添加导入和导出：

```typescript
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  // ...existing handlers
  ...tagGroupHandlers,
]
```

**Step 3: 验证编译**

运行: `pnpm build`
预期: 编译成功

**Step 4: 提交**

```bash
git add src/mocks/handlers/tag-groups.ts src/mocks/handlers/index.ts
git commit -m "feat(mocks): add tag groups mock handlers"
```

---

## Task 5: 创建 TagSelectorModal 组件

**Files:**
- Create: `src/features/materials/components/TagSelectorModal.tsx`
- Modify: `src/features/materials/components/index.ts`

**Step 1: 创建组件骨架**

```typescript
import { Plus, Search, X, Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useTagGroups, useCreateTag, useCreateTagGroup } from '../hooks'
import type { Tag, TagGroup } from '../types'
import { ALL_TAGS_GROUP_ID } from '../types'

interface TagSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTagIds: number[]
  onConfirm: (tagIds: number[]) => void
}

export function TagSelectorModal({
  open,
  onOpenChange,
  selectedTagIds: initialSelectedTagIds,
  onConfirm,
}: TagSelectorModalProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialSelectedTagIds)
  const [activeGroupId, setActiveGroupId] = useState<string>(ALL_TAGS_GROUP_ID)
  const [searchKeyword, setSearchKeyword] = useState('')

  const { data: groups = [] } = useTagGroups()
  const createTag = useCreateTag()
  const createTagGroup = useCreateTagGroup()

  // 计算所有标签
  const allTags = useMemo(() => {
    const tags: Tag[] = []
    for (const group of groups) {
      for (const tag of group.tags) {
        tags.push(tag)
      }
    }
    return tags
  }, [groups])

  // 过滤标签
  const filteredTags = useMemo(() => {
    let tags: Tag[]
    if (activeGroupId === ALL_TAGS_GROUP_ID) {
      tags = allTags
    } else {
      const group = groups.find(g => g.id === Number(activeGroupId))
      tags = group?.tags ?? []
    }
    if (searchKeyword) {
      tags = tags.filter(t => t.name.includes(searchKeyword))
    }
    return tags
  }, [activeGroupId, allTags, groups, searchKeyword])

  // 选中的标签对象
  const selectedTags = useMemo(() => {
    return allTags.filter(t => selectedTagIds.includes(t.id))
  }, [allTags, selectedTagIds])

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const removeTag = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId))
  }

  const clearSelection = () => {
    setSelectedTagIds([])
  }

  const handleConfirm = () => {
    onConfirm(selectedTagIds)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[950px] h-[600px] p-0 flex flex-col bg-gray-900 border-gray-700">
        {/* Header */}
        <DialogHeader className="h-12 px-4 flex flex-row items-center justify-between border-b border-gray-700">
          <DialogTitle className="text-base font-semibold">选择标签</DialogTitle>
        </DialogHeader>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-[220px] border-r border-gray-700 flex flex-col">
            <div className="h-12 px-4 flex items-center justify-between border-b border-gray-800">
              <span className="text-sm font-medium text-gray-300">标签组</span>
              <button
                type="button"
                onClick={() => {
                  const name = prompt('请输入标签组名称')
                  if (name) createTagGroup.mutate(name)
                }}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {/* 全部 */}
              <button
                type="button"
                onClick={() => setActiveGroupId(ALL_TAGS_GROUP_ID)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                  activeGroupId === ALL_TAGS_GROUP_ID
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span>全部</span>
                <span className="text-xs text-gray-500">{allTags.length}</span>
              </button>
              {/* Groups */}
              {groups.map(group => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(String(group.id))}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                    activeGroupId === String(group.id)
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{group.name}</span>
                  <span className="text-xs text-gray-500">{group.tags.length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tag grid */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索标签..."
                className="h-9 pl-9 bg-gray-800/50 border-gray-700"
              />
            </div>

            {/* Tags */}
            <div className="flex-1 overflow-auto">
              <div className="flex flex-wrap gap-3">
                {/* Create tag button */}
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('请输入标签名称')
                    if (name) {
                      const groupId = activeGroupId === ALL_TAGS_GROUP_ID ? undefined : Number(activeGroupId)
                      createTag.mutate({ name, groupId })
                    }
                  }}
                  className="px-4 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  新建标签
                </button>
                {/* Tags */}
                {filteredTags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {tag.name}
                      {isSelected && <Check className="w-4 h-4 inline ml-2" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected tags bar */}
            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => {
                    const group = groups.find(g => g.tags.some(t => t.id === tag.id))
                    return (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                      >
                        {group?.name}: {tag.name}
                        <button
                          type="button"
                          onClick={() => removeTag(tag.id)}
                          className="p-0.5 hover:bg-gray-700 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 px-4 flex items-center justify-between border-t border-gray-700">
          <span className="text-sm text-gray-400">
            已选择 <span className="text-cyan-400">{selectedTagIds.length}</span> 个标签
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearSelection}>
              清空
            </Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: 更新 components/index.ts 导出**

在 `src/features/materials/components/index.ts` 中添加：

```typescript
export { TagSelectorModal } from './TagSelectorModal'
```

**Step 3: 验证编译**

运行: `pnpm build`
预期: 编译成功

**Step 4: 提交**

```bash
git add src/features/materials/components/TagSelectorModal.tsx src/features/materials/components/index.ts
git commit -m "feat(materials): add TagSelectorModal component"
```

---

## Task 6: 集成到 BatchActionBar

**Files:**
- Modify: `src/features/materials/components/BatchActionBar.tsx`

**Step 1: 添加状态和导入**

在文件顶部添加导入：

```typescript
import { TagSelectorModal } from './TagSelectorModal'
```

在组件内部添加状态：

```typescript
const [showTagModal, setShowTagModal] = useState(false)
```

**Step 2: 替换标签输入为弹窗触发**

将原有的 `showTagInput` 相关逻辑替换为：

```typescript
<Button
  size="sm"
  variant="outline"
  onClick={() => setShowTagModal(true)}
  className="border-gray-600 text-gray-300 hover:text-white"
>
  <Tag className="w-4 h-4 mr-2" />
  添加标签
</Button>

<TagSelectorModal
  open={showTagModal}
  onOpenChange={setShowTagModal}
  selectedTagIds={[]}
  onConfirm={(tagIds) => {
    // TODO: 调用批量添加标签 API
    setShowTagModal(false)
  }}
/>
```

**Step 3: 移除旧代码**

移除 `tagInput`、`setTagInput`、`showTagInput` 相关代码。

**Step 4: 验证编译**

运行: `pnpm build`
预期: 编译成功

**Step 5: 提交**

```bash
git add src/features/materials/components/BatchActionBar.tsx
git commit -m "feat(materials): integrate TagSelectorModal into BatchActionBar"
```

---

## Task 7: 验证功能

**Step 1: 启动开发服务器**

运行: `pnpm dev`

**Step 2: 手动测试**

1. 访问素材库页面
2. 选择多个素材
3. 点击"添加标签"按钮
4. 验证弹窗正常显示
5. 验证标签组切换
6. 验证标签搜索
7. 验证标签多选
8. 验证创建标签组
9. 验证创建标签
10. 验证确认提交

**Step 3: 验证 lint**

运行: `pnpm lint`
预期: 无错误

---

## 文件变更总结

| 文件 | 操作 |
|------|------|
| `src/features/materials/types.ts` | 修改 |
| `src/features/materials/api.ts` | 修改 |
| `src/features/materials/hooks.ts` | 修改 |
| `src/mocks/handlers/tag-groups.ts` | 新建 |
| `src/mocks/handlers/index.ts` | 修改 |
| `src/features/materials/components/TagSelectorModal.tsx` | 新建 |
| `src/features/materials/components/index.ts` | 修改 |
| `src/features/materials/components/BatchActionBar.tsx` | 修改 |