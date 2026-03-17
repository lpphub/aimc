# 菜单重构设计文档

## 概述

重构应用菜单结构，将现有「项目库」「创作中心」「AI工具箱」三个菜单改为「项目库」「工具箱」「作品集」三个顶级菜单，移除创作中心，新增全局作品集功能。

## 需求

### 菜单结构

- **项目库**: 项目卡片列表 → 点击进入项目详情（素材库 + 作品集两个Tab）
- **工具箱**: AI文本、AI绘图、AI视频生成 → 可收藏结果到作品集
- **作品集**: 全局作品集，展示所有项目的AI生成作品，支持筛选

### 功能关系

- 全局作品集 = 所有项目的作品合集
- 进入项目可查看该项目专属作品
- AI工具独立生成，结果可收藏入库
- 素材来源: 用户上传 + AI生成保存

## 架构设计

### 目录结构

```
src/
├── features/
│   ├── project/           # 项目库 (保持现有)
│   ├── ai-tools/          # AI工具箱 (保持现有，增加收藏功能)
│   ├── portfolio/         # 全局作品集 (新建)
│   └── auth/              # 认证 (保持现有)
├── pages/
│   ├── Home.tsx           # 项目库首页
│   └── Portfolio.tsx      # 全局作品集页 (新建)
└── app/router/
    └── index.tsx          # 路由配置
```

### 路由结构

```typescript
const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },              // 项目库首页
      { path: 'project/:id', element: <ProjectDetail /> },  // 项目详情(Tab切换)
      { path: 'tools', element: <AiTools /> },         // AI工具箱
      { path: 'portfolio', element: <Portfolio /> },   // 全局作品集
    ],
  },
])
```

**路由变化**:
- 移除 `/creation` 路由
- `/ai-tools` → `/tools`
- 新增 `/portfolio` 路由
- 项目详情保留 `/project/:id`，内部用Tab切换素材库/作品集

## 页面设计

### 侧边栏

```tsx
const navItems = [
  { path: '/',       icon: Layers,    label: '项目库' },
  { path: '/tools',  icon: Sparkles,  label: '工具箱' },
  { path: '/portfolio', icon: FolderOpen, label: '作品集' },
]
```

视觉设计保持现有科技感风格:
- 渐变背景、发光效果、模糊背景
- 激活状态: cyan-teal 渐变边框 + 发光指示点
- 悬停状态: 灰色背景 + 白色文字过渡

### 项目库首页

保持现有设计:
- 项目卡片网格展示
- 搜索、筛选、创建项目功能
- 点击卡片 → 进入项目详情

### 项目详情页

布局: 顶部项目信息 + Tab切换素材库/作品集

```
┌─────────────────────────────────────────────────────────────┐
│  [项目图标]  项目名称                                       │
│             项目描述                    [开始AI创作] 按钮   │
│             #标签 #标签                                      │
├─────────────────────────────────────────────────────────────┤
│   [素材库]  [作品集]  ← Tab切换                              │
├─────────────────────────────────────────────────────────────┤
│                    Tab内容区域                              │
└─────────────────────────────────────────────────────────────┘
```

**素材库 Tab**:
- 上传按钮（文案/图片/视频）
- 素材卡片网格展示
- 支持删除、预览

**作品集 Tab**:
- 该项目的AI生成作品列表
- 作品卡片（缩略图 + 类型标签 + 时间）
- 支持删除

### AI工具箱页面

保持现有设计，增加「收藏到作品集」功能:

- 生成结果区域增加「收藏」按钮
- 点击收藏 → 弹窗选择目标项目或存入全局作品集
- 收藏成功后 toast 提示

收藏弹窗设计:
```
┌─────────────────────────────┐
│  收藏到作品集               │
├─────────────────────────────┤
│  ○ 全局作品集               │
│  ○ 项目A                    │
│  ○ 项目B                    │
│  ──────────────────────     │
│  [取消]  [确认收藏]         │
└─────────────────────────────┘
```

### 全局作品集页面

布局: 顶部筛选栏 + 作品网格

```
┌─────────────────────────────────────────────────────────────┐
│  [作品集图标]  作品集                                       │
│               全部作品 · 共 N 件                             │
├─────────────────────────────────────────────────────────────┤
│  筛选: [全部项目 ▼]  [全部类型 ▼]  [搜索...]               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐              │
│  │作品1│  │作品2│  │作品3│  │作品4│  │作品5│              │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘              │
└─────────────────────────────────────────────────────────────┘
```

**作品卡片**:
- 缩略图（图片/视频封面）
- 类型标签（文本/图片/视频）
- 来源项目名（可选）
- 创建时间
- 悬停显示删除按钮

**筛选功能**:
- 按项目筛选
- 按类型筛选（文本/图片/视频）
- 搜索（按内容/标签）

## 数据模型

```typescript
// 素材类型
type MaterialType = 'text' | 'image' | 'video'

interface Material {
  id: string
  projectId: string
  type: MaterialType
  content: string          // 文本内容或文件URL
  name: string
  createdAt: string
}

// 作品类型
type WorkType = 'text' | 'image' | 'video'

interface Work {
  id: string
  projectId?: string       // 可选，全局作品无项目
  type: WorkType
  content: string          // 生成内容或文件URL
  prompt: string           // 使用的提示词
  engine?: string          // 使用的引擎
  createdAt: string
}
```

## API 端点

### 素材相关
- `GET /projects/:id/materials` - 获取项目素材
- `POST /projects/:id/materials` - 添加素材
- `DELETE /materials/:id` - 删除素材

### 作品相关
- `GET /projects/:id/works` - 获取项目作品
- `GET /works` - 获取全局作品集
- `POST /works` - 创建作品（收藏）
- `DELETE /works/:id` - 删除作品

## 改动范围

### 新增
- `src/features/portfolio/` - 作品集模块
- `src/pages/Portfolio.tsx` - 作品集页面

### 修改
- `src/app/router/index.tsx` - 路由配置
- `src/shared/components/layout/Sidebar.tsx` - 侧边栏导航
- `src/features/ai-tools/components/AiTools.tsx` - 增加收藏功能
- `src/features/project/components/ProjectDetail.tsx` - 改为Tab布局

### 移除
- `src/features/creation/` - 创作中心模块