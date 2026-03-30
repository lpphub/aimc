---
title: AIMC Sidebar & AI Draw Refactor
date: 2026-03-30
status: ready
---

# AIMC Sidebar & AI Draw Refactor Design

## Overview

重构 AIMC 项目的侧边栏菜单、AI绘图页面结构，以及清理冗余工具代码。

## Requirements

1. **Sidebar Menu**: 只保留 3 个菜单 — AI绘图、素材库、工具箱
2. **creations → tools**: 重命名文件夹，删除 PosterTool、TextTool 及相关 API/types/hooks
3. **canvas-generator → generator**: 重命名文件夹
4. **AI绘图页面**:
   - 首页：欢迎页 + 左侧历史对话列表
   - 点击"开始新对话"或历史对话 → 进入全屏画布页面（CanvasGeneratorPage）
   - 历史对话需要后端 API 存储，支持完整恢复（消息 + 画布状态）
5. **工具箱页面**: 显示工具卡片页，只保留 OCR 卡片

## Architecture

### Route Structure

| Route | Page | Description |
|-------|------|-------------|
| `/canvas` | AiDrawLanding | AI绘图首页（欢迎 + 历史列表） |
| `/canvas/:conversationId` | GeneratorPage | 画布页面（全屏 Canvas + FloatingChat） |
| `/tools` | Tools | 工具箱卡片页（仅 OCR） |
| `/tools/ocr` | OcrTool | OCR 工具详情页 |
| `/materials` | Materials | 素材库（不变） |

### File Structure Changes

```
src/
├── app/router/index.tsx          # 更新路由配置
├── pages/
│   ├── AiDraw.tsx                # 新增：AI绘图首页路由组件
│   ├── Generator.tsx             # 重命名：原 CanvasGenerator.tsx
│   └── Tools.tsx                 # 重命名：原 Creations.tsx
├── features/
│   ├── generator/                # 重命名：原 canvas-generator/
│   │   ├── api.ts                # 更新：新增对话历史 API
│   │   ├── types.ts              # 更新：新增 Conversation 相关类型
│   │   ├── hooks/
│   │   │   ├── index.ts              # 更新导出
│   │   │   ├── useCanvas.ts          # 保持
│   │   │   ├── useChat.ts            # 更新：支持 conversationId
│   │   │   ├── useConversations.ts   # 新增：历史对话列表 query hook
│   │   │   ├── useConversation.ts    # 新增：单个对话详情 query hook
│   │   │   ├── useCreateConversation.ts # 新增：创建对话 mutation hook
│   │   │   └── useDeleteConversation.ts # 新增：删除对话 mutation hook
│   │   ├── components/
│   │   │   ├── AiDrawLanding.tsx # 新增：AI绘图首页
│   │   │   ├── ConversationList.tsx # 新增：历史对话列表
│   │   │   ├── CanvasGeneratorPage.tsx # 保持，重命名为 GeneratorPage.tsx
│   │   │   ├── FloatingChat.tsx  # 更新：添加返回首页按钮
│   │   │   ├── Canvas.tsx        # 保持
│   │   │   ├── CanvasToolbar.tsx # 保持
│   │   │   ├── CanvasItem.tsx    # 保持
│   │   │   └── index.ts          # 更新导出
│   │   ├── stores/
│   │   │   └── canvas.ts         # 保持
│   │   └── index.ts              # 更新导出
│   ├── tools/                    # 重命名：原 creations/
│   │   ├── api.ts                # 简化：只保留 ocr API
│   │   ├── types.ts              # 简化：只保留 OcrReq, OcrResp
│   │   ├── hooks/
│   │   │   └── index.ts          # 简化：只保留 useOcr
│   │   ├── components/
│   │   │   ├── ToolGrid.tsx      # 简化：只显示 OCR 卡片
│   │   │   ├── OcrTool.tsx       # 保持
│   │   │   ├── ToolsPage.tsx     # 重命名：原 CreationsPage.tsx
│   │   │   └── index.ts          # 更新导出
│   │   └── index.ts              # 更新导出
│   ├── materials/                # 保持不变
│   ├── auth/                     # 保持不变
│   └── projects/                 # 删除（sidebar 已移除）
├── shared/components/layout/
│   └── Sidebar.tsx               # 更新：菜单改为 AI绘图、素材库、工具箱
├── mocks/handlers/
│   ├── generator.ts              # 重命名：原 canvas-generator.ts，新增对话历史 mock
│   ├── tools.ts                  # 重命名：原 creations.ts，只保留 OCR handlers
│   ├── projects.ts               # 删除
│   └── index.ts                  # 更新导入
```

### Deletions

以下文件/代码需要删除：

1. **features/creations/** 中的 PosterTool、TextTool：
   - `components/PosterTool.tsx`
   - `components/TextTool.tsx`
   - `api.ts` 中的 `generateText`, `generatePoster`
   - `types.ts` 中的 `GenerateTextReq`, `GenerateTextResp`, `GeneratePosterReq`, `GeneratePosterResp`, `BrandTone`, `PosterStyle`, `AspectRatio`
   - `hooks/index.ts` 中的 `useGenerateText`, `useGeneratePoster`, `creationsKeys`
   - `components/index.ts` 中的 PosterTool, TextTool 导出

2. **features/projects/** 整个文件夹（sidebar 已移除项目菜单）

3. **pages/Projects.tsx**

4. **mocks/handlers/projects.ts**, **mocks/handlers/works.ts**

5. 路由中的 `/projects` 路径

## API Design

### New Types (generator/types.ts)

> **Note:** `ChatMessage` and `CanvasItem` types already exist in the current `types.ts`. They will be reused/extended with the new Conversation types below.

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
  title?: string  // 可选，默认根据第一条消息生成
}

// 创建对话响应
export interface CreateConversationResp {
  conversation: Conversation
}

// 更新现有类型
export interface ChatMessageReq {
  conversationId: string  // 新增：必传
  message: string
  image?: File
}

export interface ChatMessageResp {
  conversationId: string
  message: ChatMessage
  generatedImage?: {
    imageUrl: string
    suggestedPosition?: { x: number; y: number }
  }
}
```

### New API (generator/api.ts)

```typescript
export const generatorApi = {
  // 对话历史管理
  getConversations: () => api.get<Conversation[]>('conversations'),
  getConversation: (id: string) => api.get<ConversationDetail>(`conversations/${id}`),
  createConversation: (data: CreateConversationReq) =>
    api.post<CreateConversationResp>('conversations', data),
  deleteConversation: (id: string) =>
    api.delete(`conversations/${id}`),

  // 发送消息（更新：需传 conversationId）
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

### Query Keys

```typescript
export const generatorKeys = {
  all: ['generator'] as const,
  conversations: () => [...generatorKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...generatorKeys.all, 'conversation', id] as const,
}
```

## Component Design

### AiDrawLanding

布局：左侧历史对话列表 (280px) + 右侧欢迎区域 (flex-1)

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Content Area                                  │
│ (64px)  │ ┌───────────────────────────────────────────┐│
│         │ │ History List │ Welcome Area               ││
│         │ │ (280px)      │ (flex-1)                    ││
│ AI绘图✓ │ │              │                             ││
│ 素材库  │ │ • 对话列表   │ ✨ AI 绘图                   ││
│ 工具箱  │ │ • 点击切换   │ 描述你想要的画面            ││
│         │ │ • 删除按钮   │ AI 将为你生成创意图片       ││
│         │ │              │                             ││
│         │ │ [新建对话]   │ [开始新对话]                ││
│         │ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**交互逻辑**:
- 点击历史对话项 → `navigate('/canvas/:conversationId')`
- 点击"开始新对话"按钮 → `createConversation()` → 获取新 ID → `navigate('/canvas/:newId')`
- 历史对话项支持删除（带确认）

### ConversationList

- 显示对话列表，每项包含：标题、更新时间、删除按钮
- 点击项跳转到详情页
- 删除按钮触发确认对话框
- 列表顶部有"新建对话"按钮
- 使用 `useConversations` hook 获取数据

### Hooks: useConversations & useConversation & Mutations

```typescript
// useConversations - 获取对话列表
export function useConversations() {
  return useQuery({
    queryKey: generatorKeys.conversations(),
    queryFn: () => generatorApi.getConversations(),
  })
}

// useConversation - 获取单个对话详情
export function useConversation(id: string) {
  return useQuery({
    queryKey: generatorKeys.conversation(id),
    queryFn: () => generatorApi.getConversation(id),
    enabled: !!id,
  })
}

// useCreateConversation - 创建新对话
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

// useDeleteConversation - 删除对话
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

### GeneratorPage (原 CanvasGeneratorPage)

- 从 URL params 获取 `conversationId`
- 进入时调用 `useConversation(conversationId)` 加载消息和画布状态
- 加载完成后初始化画布（恢复 canvasItems）
- 发送消息时携带 `conversationId`
- 保持现有布局：全屏 Canvas + FloatingChat + CanvasToolbar

### FloatingChat 更新

- 顶部添加"返回首页"按钮 → `navigate('/canvas')`
- 保持现有聊天功能

### Sidebar 更新

```typescript
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

### ToolGrid 简化

只保留 OCR 工具卡片：

```typescript
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
```

## Mock Handlers

### 新增对话历史 Mock (mocks/handlers/generator.ts)

```typescript
// 内存存储 mock 对话数据
const mockConversations: Map<string, ConversationDetail> = new Map()

export const generatorHandlers = [
  // GET /api/conversations - 获取列表
  http.get(`${API_BASE}/conversations`, () => {
    const list = Array.from(mockConversations.values())
      .map(c => ({ id: c.id, title: c.title, createdAt: c.createdAt, updatedAt: c.updatedAt }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
    return HttpResponse.json(success(list))
  }),

  // GET /api/conversations/:id - 获取详情
  http.get(`${API_BASE}/conversations/:id`, ({ params }) => {
    const conv = mockConversations.get(params.id)
    if (!conv) return notFound('对话不存在')
    return HttpResponse.json(success(conv))
  }),

  // POST /api/conversations - 创建
  http.post(`${API_BASE}/conversations`, () => {
    const id = crypto.randomUUID()
    const now = Date.now()
    const conv: ConversationDetail = {
      id,
      title: '新对话',
      messages: [],
      canvasItems: [],
      createdAt: now,
      updatedAt: now,
    }
    mockConversations.set(id, conv)
    return HttpResponse.json(success({ conversation: { id, title: conv.title, createdAt: now, updatedAt: now } }))
  }),

  // DELETE /api/conversations/:id - 删除
  http.delete(`${API_BASE}/conversations/:id`, ({ params }) => {
    mockConversations.delete(params.id)
    return HttpResponse.json(success(null))
  }),

  // POST /api/canvas/chat - 发送消息（更新）
  http.post(`${API_BASE}/canvas/chat`, async ({ request }) => {
    const formData = await request.formData()
    const conversationId = formData.get('conversationId') as string
    const message = formData.get('message') as string

    const conv = mockConversations.get(conversationId)
    if (!conv) return notFound('对话不存在')

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }
    conv.messages.push(userMsg)

    // 生成 mock 图片
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    const generatedImage = { imageUrl: randomImage, suggestedPosition: { x: 400, y: 200 } }

    // 添加 canvas item
    const newItem: CanvasItem = {
      id: crypto.randomUUID(),
      type: 'image',
      imageUrl: randomImage,
      x: 400,
      y: 200,
      width: 200,
      height: 200,
      rotation: 0,
    }
    conv.canvasItems.push(newItem)

    // 更新对话标题（如果是第一条消息）
    if (conv.messages.length === 1) {
      conv.title = message.slice(0, 20) || '新对话'
    }
    conv.updatedAt = Date.now()

    // 添加助手消息
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `已为您生成图片`,
      timestamp: Date.now(),
    }
    conv.messages.push(assistantMsg)

    return HttpResponse.json(success({
      conversationId,
      message: assistantMsg,
      generatedImage,
    }))
  }),
]
```

## Implementation Steps

1. **Rename folders & files**:
   - `features/canvas-generator/` → `features/generator/`
   - `features/creations/` → `features/tools/`
   - `pages/CanvasGenerator.tsx` → `pages/Generator.tsx`
   - `pages/Creations.tsx` → `pages/Tools.tsx`
   - Update all imports

2. **Delete unused code**:
   - Remove PosterTool, TextTool components
   - Remove generateText, generatePoster API/hooks/types
   - Remove entire `features/projects/` folder
   - Remove `pages/Projects.tsx`
   - Remove project/works mock handlers

3. **Update Sidebar.tsx**:
   - Change navItems to 3 items only

4. **Update router**:
   - Remove `/projects` route
   - Rename route paths

5. **Add new types & API**:
   - Add Conversation, ConversationDetail types
   - Add conversation API methods
   - Update ChatMessageReq to require conversationId

6. **Create new components & hooks**:
   - `AiDrawLanding.tsx`
   - `ConversationList.tsx`
   - `useConversations.ts` hook (列表 query)
   - `useConversation.ts` hook (单个对话详情 query)
   - `useCreateConversation.ts` hook (创建 mutation)
   - `useDeleteConversation.ts` hook (删除 mutation)

7. **Update existing components**:
   - `GeneratorPage.tsx`: Load conversation on mount
   - `FloatingChat.tsx`: Add back button, pass conversationId
   - `ToolGrid.tsx`: Only OCR card
   - `useChat.ts`: Accept conversationId param

8. **Update mock handlers**:
   - Rename files
   - Add conversation handlers
   - Remove unused handlers

9. **Code review & cleanup**:
   - Ensure FSD layer compliance
   - Remove unused imports
   - Update index.ts exports
   - Run lint and build

## Success Criteria

- Sidebar shows only 3 items: AI绘图, 素材库, 工具箱
- AI绘图首页 shows welcome + history list
- Clicking history or "start new" enters full-screen canvas
- Canvas page restores messages and canvas items from history
- Tools page shows only OCR card
- All builds and lint passes
- No FSD layer violations