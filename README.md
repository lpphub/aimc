# AIMC - 智绘工坊

AI 驱动的创意工作流平台

## 技术栈

- React 19 + TypeScript
- Vite 7 (Rolldown)
- TanStack Query (数据请求)
- Zustand (状态管理)
- shadcn/ui + Tailwind CSS 4
- React Router v7 (路由)
- Biome (代码检查和格式化)
- MSW (Mock Service Worker)

## 项目结构

```
src/
├── app/                    # 应用
│   └── router/             # 路由配置
├── pages/                  # 页面组件（路由入口）
│   ├── base/              # 错误页面 (404/401/500)
│   ├── Login.tsx          # 登录页
│   ├── Home.tsx           # 首页
│   ├── Creation.tsx       # 创作中心
│   ├── AiTools.tsx        # AI 工具箱
│   └── ProjectDetail.tsx  # 项目详情
├── features/               # 业务功能模块
│   ├── auth/              # 认证
│   │   ├── api.ts         # API 接口定义
│   │   ├── types.ts       # 类型定义
│   │   ├── hooks/         # 业务 Hooks
│   │   └── components/    # 业务组件
│   └── project/           # 项目
│       ├── api.ts
│       ├── types.ts
│       └── components/
├── shared/                 # 跨功能共享资源
│   ├── components/        # UI 组件
│   │   ├── ui/            # shadcn/ui：Button, Input, Dialog...
│   │   └── layout/        # Layout, Sidebar, Main
│   ├── stores/            # auth, project
│   └── utils/             # constants, env
├── lib/                   # 核心库（三方库封装）
│   ├── api.ts             # ky HTTP 客户端
│   └── utils.ts           # cn, class-variance-authority
├── mocks/                 # MSW 模拟接口
│   ├── browser.ts
│   ├── db.ts
│   └── handlers/
├── main.tsx               # 应用入口
└── index.css              # 全局样式
```

## 后端接口调用流程

```
┌──────────────────────────────────────────────────────────────────┐
│                         调用链路                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page/Component                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐    封装请求逻辑     ┌─────────────┐             │
│  │   Hooks     │ ◄────────────────── │    API      │             │
│  │ (useQuery)  │                     │  (ky实例)   │             │
│  └─────────────┘                     └─────────────┘             │
│       │                                     │                    │
│       │ 自动处理                            │ features：          │
│       │ - 缓存                              │ - api.ts           │
│       │ - 加载状态                          │ - hooks/           │
│       │ - 错误处理                          │ - types.ts         │
│       ▼                                     ▼                    │
│  ┌─────────────┐                     ┌─────────────┐             │
│  │   Store     │                     │  Backend    │             │
│  │ (Zustand)   │                     │   Server    │             │
│  └─────────────┘                     └─────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 分层职责

| 层级 | 文件位置 | 职责 |
|------|----------|------|
| **API 层** | `src/features/*/api.ts` | 定义接口地址、请求参数类型、返回类型 |
| **Hooks 层** | `src/features/*/hooks/*.ts` | 封装 TanStack Query，处理缓存、状态、错误 |
| **Store 层** | `src/shared/stores/*.ts` | 管理全局状态（如用户登录态） |

### 示例：添加新功能的 API

```typescript
// 1. 定义类型 - src/features/xxx/types.ts
export interface CreateXxxReq {
  name: string
}

export interface XxxResp {
  id: number
  name: string
}

// 2. 创建 API - src/features/xxx/api.ts
import type { CreateXxxReq, XxxResp } from './types'
import api from '@/lib/api'

export const xxxApi = {
  list: () => api.get<XxxResp[]>('xxx'),
  create: (data: CreateXxxReq) => api.post<XxxResp>('xxx', data),
}

// 3. 封装 Hook - src/features/xxx/hooks/index.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { xxxApi } from '../api'

export const xxxKeys = {
  all: ['xxx'] as const,
  list: () => [...xxxKeys.all, 'list'] as const,
}

export function useXxxList() {
  return useQuery({
    queryKey: xxxKeys.list(),
    queryFn: () => xxxApi.list(),
  })
}

export function useCreateXxx() {
  return useMutation({
    mutationFn: xxxApi.create,
  })
}

// 4. 组件中使用
function XxxPage() {
  const { data, isLoading } = useXxxList()
  const createXxx = useCreateXxx()
}
```

## 环境变量

```bash
VITE_API_BASE_URL=/api       # 后端 API 地址
VITE_ENABLE_PROXY=true       # 启用 Vite 代理到 localhost:8080
```

## 开发命令

```bash
pnpm dev        # 启动开发服务器 (端口 5000)
pnpm build      # 构建生产版本
pnpm lint       # Biome 代码检查
pnpm lint:fix   # Biome 代码检查并自动修复
pnpm format     # Biome 代码格式化
```

## 添加 UI 组件

```bash
npx shadcn@latest add <component>           # 添加新组件
npx shadcn@latest add <component> --overwrite  # 覆盖现有组件
```

## Mock 数据

开发环境下使用 MSW 模拟后端接口。测试账号：

- 邮箱：`test@aimc.com`
- 密码：`123456`