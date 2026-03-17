# 标签选择弹窗设计文档

## 概述

为素材库实现一个标签选择弹窗（Tag Selector Modal），用于批量给素材选择标签。支持标签组分类、标签搜索、多选等功能。

## 需求

- 替换 `BatchActionBar.tsx` 中的逗号分隔文本输入
- 支持标签组分类管理
- 支持标签搜索过滤
- 支持多选/取消选择
- 支持创建标签和标签组
- 底部显示已选标签

## 类型定义

```typescript
// src/features/materials/types.ts

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

## API 设计

```typescript
// src/features/materials/api.ts

export async function getTagGroups(): Promise<TagGroup[]>
export async function createTagGroup(name: string): Promise<TagGroup>
export async function createTag(name: string, groupId?: number): Promise<Tag>
export async function deleteTag(tagId: number): Promise<void>
export async function addTagsToMaterials(params: {
  materialIds: string[]
  tagIds: number[]
}): Promise<void>
```

## Hooks 设计

```typescript
// src/features/materials/hooks.ts

export const tagKeys = {
  all: ['tags'] as const,
  groups: () => [...tagKeys.all, 'groups'] as const,
}

export function useTagGroups()
export function useCreateTagGroup()
export function useCreateTag()
export function useDeleteTag()
export function useAddTagsToMaterials()
```

## 组件设计

### 文件结构

```
src/features/materials/components/
└── TagSelectorModal.tsx  # 包含所有子组件
```

### Props

```typescript
interface TagSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTagIds: number[]
  onConfirm: (tagIds: number[]) => void
}
```

### 内部状态

- `selectedTagIds: number[]` - 当前选中的标签 ID
- `activeGroupId: string` - 当前激活的组 ID
- `searchKeyword: string` - 搜索关键词

### 布局结构

```
┌───────────────────────────────────────────────┐
│ Header: 选择标签                          [X] │
├───────────────┬───────────────────────────────┤
│ TagGroupSidebar │ TagGrid (搜索 + 标签网格)     │
│ (220px)       │                               │
│               │                               │
├───────────────┴───────────────────────────────┤
│ SelectedTagsBar (已选标签展示)                 │
├───────────────────────────────────────────────┤
│ Footer: 已选择 N 个      [清空] [确认]         │
└───────────────────────────────────────────────┘
```

### 子组件

#### TagGroupSidebar

- 宽度 220px
- 顶部：标题"标签组" + 新建按钮
- 列表项：组名 + 标签数量
- 第一项："全部"（虚拟组）

#### TagGrid

- 顶部：搜索框（搜索标签）
- 标签网格：flex-wrap, gap-12px
- 第一项："+ 新建标签"（虚线边框）
- 标签按钮：圆角 8px，选中显示勾号

#### SelectedTagsBar

- 高度 64px
- 已选标签：pill 形式 `[组名: 标签名 ×]`
- 点击 × 移除

#### Footer

- 左侧：已选择 N 个标签
- 右侧：清空按钮 + 确认按钮

## MSW Mock

```typescript
// src/mocks/handlers/tag-groups.ts

export const tagGroupHandlers = [
  http.get('/api/tag-groups', ...),
  http.post('/api/tag-groups', ...),
  http.post('/api/tags', ...),
  http.delete('/api/tags/:id', ...),
  http.post('/api/materials/tags', ...),
]
```

默认数据：
- 默认标签组：风景、人物
- 风格组：简约、复古

## 集成点

替换 `BatchActionBar.tsx` 中的标签输入：

```typescript
// 点击"添加标签"按钮打开弹窗
<TagSelectorModal
  open={showTagModal}
  onOpenChange={setShowTagModal}
  selectedTagIds={[]}
  onConfirm={(tagIds) => {
    batchAddTags.mutate({ ids: selectedIds, tagIds })
    setShowTagModal(false)
  }}
/>
```