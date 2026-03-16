# 项目库设计文档

## 概述

改造现有的项目功能，将项目从漫画/章节导向的模型重构为通用的创作空间。项目作为创作空间，支持预设素材模板和创作记录管理。

## 数据模型

### Project（项目）

```typescript
interface Project {
  id: string
  name: string
  description?: string
  tags: string[]              // 多标签，如 ['小红书', '短视频']
  presetTemplateIds: string[] // 预设模板ID列表
  createdAt: string
  updatedAt: string
}
```

### Template（模板 - 系统预设）

```typescript
interface Template {
  id: string
  name: string                // 如 "文案模板A"
  type: 'copy' | 'image' | 'video'  // 文案/图片/视频
  content: string             // 模板内容
}
```

### CreationRecord（创作记录）

```typescript
interface CreationRecord {
  id: string
  projectId: string
  type: 'copy' | 'image' | 'video' | 'mixed'  // 文案/图片/视频/图文
  title?: string
  content: string             // 生成的内容
  metadata?: Record<string, any>  // 额外信息
  createdAt: string
}
```

## API 设计

### 项目 API

```typescript
projectApi:
  - list(): Project[]
  - get(id): Project
  - create(data: { name, description?, tags? }): Project
  - update(id, data): Project
  - delete(id): void
```

### 模板 API

```typescript
templateApi:
  - list(type?: 'copy' | 'image' | 'video'): Template[]  // 按类型筛选
```

### 创作记录 API

```typescript
recordApi:
  - list(projectId): CreationRecord[]
  - create(projectId, data): CreationRecord
  - get(id): CreationRecord
  - update(id, data): CreationRecord
  - delete(id): void
```

## 页面结构

### 路由

```
/                    → Home (项目列表 - 保持现有)
/project/:id         → ProjectDetail (项目详情 - 重构)
```

### 项目列表页（Home）

- 保持现有布局和功能
- 项目卡片更新展示信息：
  - 项目名称
  - 项目描述（可选）
  - 标签（多标签展示）
- 点击卡片进入项目详情

### 项目详情页（ProjectDetail）

- 顶部：项目信息（名称、描述、标签）
- 左侧：预设素材卡片列表
- 右侧：创作记录卡片列表
- 底部：[开始AI创作] [上传素材] 按钮

## 组件结构

```
src/features/project/
├── components/
│   ├── ProjectCard.tsx      (更新：展示名称/描述/标签)
│   ├── ProjectDetail.tsx    (重构：新的项目详情页)
│   ├── PresetMaterials.tsx  (新增：预设素材列表)
│   └── CreationRecords.tsx  (新增：创作记录列表)
├── types.ts                  (更新：新增 Template, CreationRecord)
├── api.ts                    (更新：新增 templateApi, recordApi)
└── hooks.ts                  (更新：新增相关 hooks)

src/features/template/
├── types.ts
├── api.ts
├── hooks.ts
└── components/
    └── TemplateSelect.tsx    (模板选择组件)
```

## MSW Mock 数据

```typescript
// 预设模板
const mockTemplates: Template[] = [
  { id: 't1', name: '文案模板A', type: 'copy', content: '...' },
  { id: 't2', name: '文案模板B', type: 'copy', content: '...' },
  { id: 't3', name: '图片模板A', type: 'image', content: '...' },
  { id: 't4', name: '视频模板A', type: 'video', content: '...' },
]

// Mock 项目数据
const mockProjects: Project[] = [
  {
    id: 'p1',
    name: '夏季新品推广',
    description: '为小红书和抖音生成营销素材',
    tags: ['小红书', '短视频'],
    presetTemplateIds: ['t1', 't3'],
    createdAt: '2026-03-16',
    updatedAt: '2026-03-16',
  }
]

// Mock 创作记录
const mockRecords: CreationRecord[] = [
  {
    id: 'r1',
    projectId: 'p1',
    type: 'copy',
    title: '夏季新品文案',
    content: '...',
    createdAt: '2026-03-16',
  }
]
```

## 用户流程

```
创建项目 → 填写名称/描述/标签/预设素材
    ↓
进入项目 → 查看预设素材 / 已生成内容
    ↓
开始创作 → 跳转流水线
    ↓
生成结果 → 自动归入项目
```

## 迁移说明

1. 移除现有的章节目录和分镜工作台功能
2. 更新 Project 类型定义
3. 新增 Template 和 CreationRecord 类型
4. 重构 ProjectDetail 组件
5. 更新 ProjectCard 组件展示
6. 新增 MSW handlers