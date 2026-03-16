# Pages Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move business pages (ProjectDetail, Creation, AiTools) from pages/ to their corresponding feature domains.

**Architecture:** Each feature domain (project, creation, ai-tools) will contain its page component in the components/ directory. Router imports will be updated to reference the new locations.

**Tech Stack:** React, TypeScript, React Router v7

---

## Task 1: Move ProjectDetail to features/project

**Files:**
- Create: `src/features/project/components/ProjectDetail.tsx`
- Modify: `src/features/project/index.ts`
- Delete: `src/pages/ProjectDetail.tsx`

**Step 1: Create ProjectDetail in features/project/components**

```typescript
import { BookOpen, ChevronRight, Grid3x3, Users } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export default function ProjectDetailPage() {
  const handleOpenCharacters = () => console.log('Open character library')
  const handleEnterPipeline = () => console.log('Enter pipeline')
  const handleCreateChapter = () => {
    console.log('Create new chapter')
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex-1 p-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <BookOpen className="h-10 w-10 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">test</h1>
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 backdrop-blur-sm">
                    漫画
                  </Badge>
                  <span className="text-sm text-gray-500">更新: 2026/3/12</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleOpenCharacters}
                className="bg-gray-900/50 border-gray-700/30 text-white hover:bg-gray-800/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300"
              >
                <Users className="mr-2 h-4 w-4" />
                角色库
              </Button>
              <Button
                onClick={handleEnterPipeline}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                进入流水线
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 h-[calc(100vh-350px)]">
          <div className="w-80 flex-shrink-0">
            <Card className="h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm">
              <div className="p-4 border-b border-gray-700/30">
                <h2 className="text-lg font-semibold text-white">章节目录</h2>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">暂无章节</p>
                  <Button
                    onClick={handleCreateChapter}
                    variant="outline"
                    className="mt-4 bg-transparent border-gray-700/30 text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-800/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    创建新章节
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Separator orientation="vertical" className="h-auto bg-gray-700/20" />

          <div className="flex-1">
            <Card className="h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm">
              <div className="p-4 border-b border-gray-700/30">
                <h2 className="text-lg font-semibold text-white">分镜工作台</h2>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-24 h-24 rounded-2xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center">
                        <Grid3x3 className="w-12 h-12 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">该章节暂无分镜</p>
                  <p className="text-gray-600 text-sm mb-4">前往创建新的分镜内容</p>
                  <Button
                    onClick={handleCreateChapter}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40"
                  >
                    前往创建
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Update features/project/index.ts**

```typescript
export * from './types'
export * from './api'
export { ProjectCard } from './components'
export { default as ProjectDetail } from './components/ProjectDetail'
```

**Step 3: Update router imports**

In `src/app/router/index.tsx`, change line 12 from:
```typescript
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
```
to:
```typescript
const ProjectDetail = lazy(() => import('@/features/project').then(m => ({ default: m.ProjectDetail })))
```

**Step 4: Delete old file**

```bash
rm src/pages/ProjectDetail.tsx
```

**Step 5: Verify and commit**

Run: `pnpm dev`
Expected: App loads without errors

```bash
git add -A && git commit -m "refactor: move ProjectDetail to features/project"
```

---

## Task 2: Create features/creation domain

**Files:**
- Create: `src/features/creation/components/Creation.tsx`
- Create: `src/features/creation/index.ts`
- Modify: `src/app/router/index.tsx`
- Delete: `src/pages/Creation.tsx`

**Step 1: Create creation feature directory structure**

```bash
mkdir -p src/features/creation/components
```

**Step 2: Create Creation.tsx in features/creation/components**

```typescript
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  PenTool,
  Save,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'

const CREATION_STEPS = [
  { id: 1, label: '基础设定', icon: Settings },
  { id: 2, label: '角色建立', icon: Users },
  { id: 3, label: '剧本撰写', icon: FileText },
  { id: 4, label: '分镜拆解', icon: ImageIcon },
  { id: 5, label: '画面生成', icon: ImageIcon },
] as const

export default function CreationPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(3)
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState('manual')

  const handleSave = () => {
    console.log('Saving progress...')
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30">
                <PenTool className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">创作中心</h1>
                <p className="text-sm text-gray-500">流水线创作，一站式体验</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              {CREATION_STEPS.map((step, index) => {
                const status = getStepStatus(step.id)
                const Icon = step.icon
                const isLast = index === CREATION_STEPS.length - 1

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          status === 'completed'
                            ? 'bg-gradient-to-br from-cyan-500 to-teal-500 border-transparent text-white'
                            : status === 'current'
                              ? 'bg-[#0a0a0a] border-cyan-500 text-cyan-400'
                              : 'bg-[#0a0a0a] border-gray-700 text-gray-500'
                        }`}
                      >
                        {status === 'completed' ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <p
                        className={`text-xs font-medium mt-2 ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div className="flex-1 mx-4 h-0.5">
                        {status === 'completed' ? (
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                        ) : (
                          <div className="h-full bg-gray-800" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'manual' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <PenTool className="w-4 h-4" />
                <span>手动创作</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'ai' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI 智脑</span>
              </Button>
            </div>
          </div>

          <div className="relative bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Button>
              <div className="text-xs text-gray-600 font-medium">MANUAL EDITOR</div>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm px-4 py-1.5 hover:from-cyan-600 hover:to-teal-600"
              >
                <Save className="w-4 h-4 mr-2" />
                保存进度
              </Button>
            </div>

            {activeTab === 'manual' ? (
              <Textarea
                placeholder="在此处开始您的剧本创作..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] bg-transparent border-0 text-white placeholder:text-gray-600 resize-none text-base leading-relaxed focus:ring-0 focus:outline-none"
              />
            ) : (
              <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                      <Sparkles className="relative w-16 h-16 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">AI 智脑正在准备中...</p>
                  <p className="text-gray-600 text-sm mb-4">敬请期待更多 AI 创作功能</p>
                  <Button
                    onClick={() => navigate('/ai-tools')}
                    variant="outline"
                    className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50"
                  >
                    前往 AI 工具箱
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-[#0a0a0a] px-3 py-1.5 rounded border border-gray-800">
                {content.length}/10000 CHARS
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a] hover:border-gray-600"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              上一步
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={currentStep === 5}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600"
            >
              下一步
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
      </div>
    </div>
  )
}
```

**Step 3: Create features/creation/index.ts**

```typescript
export { default as Creation } from './components/Creation'
```

**Step 4: Update router imports**

In `src/app/router/index.tsx`, change line 10 from:
```typescript
const Creation = lazy(() => import('@/pages/Creation'))
```
to:
```typescript
const Creation = lazy(() => import('@/features/creation').then(m => ({ default: m.Creation })))
```

**Step 5: Delete old file**

```bash
rm src/pages/Creation.tsx
```

**Step 6: Verify and commit**

Run: `pnpm dev`
Expected: App loads without errors

```bash
git add -A && git commit -m "feat: create creation feature domain"
```

---

## Task 3: Create features/ai-tools domain

**Files:**
- Create: `src/features/ai-tools/components/AiTools.tsx`
- Create: `src/features/ai-tools/index.ts`
- Modify: `src/app/router/index.tsx`
- Delete: `src/pages/AiTools.tsx`

**Step 1: Create ai-tools feature directory structure**

```bash
mkdir -p src/features/ai-tools/components
```

**Step 2: Create AiTools.tsx in features/ai-tools/components**

(Copy content from src/pages/AiTools.tsx - same content, just different location)

**Step 3: Create features/ai-tools/index.ts**

```typescript
export { default as AiTools } from './components/AiTools'
```

**Step 4: Update router imports**

In `src/app/router/index.tsx`, change line 11 from:
```typescript
const AiTools = lazy(() => import('@/pages/AiTools'))
```
to:
```typescript
const AiTools = lazy(() => import('@/features/ai-tools').then(m => ({ default: m.AiTools })))
```

**Step 5: Delete old file**

```bash
rm src/pages/AiTools.tsx
```

**Step 6: Verify and commit**

Run: `pnpm dev`
Expected: App loads without errors

```bash
git add -A && git commit -m "feat: create ai-tools feature domain"
```

---

## Task 4: Update README documentation

**Files:**
- Modify: `README.md`

**Step 1: Update project structure section**

Update the `## 项目结构` section to reflect new file locations:

```markdown
## 项目结构

```
src/
├── app/                    # 应用
│   └── router/             # 路由配置
├── pages/                  # 页面组件（路由入口）
│   ├── base/              # 错误页面 (404/401/500)
│   ├── Login.tsx          # 登录页
│   └── Home.tsx           # 首页
├── features/               # 业务功能模块
│   ├── auth/              # 认证
│   │   ├── api.ts         # API 接口定义
│   │   ├── types.ts       # 类型定义
│   │   ├── hooks/         # 业务 Hooks
│   │   └── components/    # 业务组件
│   ├── project/           # 项目
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── components/
│   ├── creation/          # 创作中心
│   │   └── components/
│   └── ai-tools/          # AI 工具箱
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
```

**Step 2: Verify and commit**

```bash
git add README.md && git commit -m "docs: update project structure after pages refactor"
```

---

## Task 5: Final verification

**Step 1: Run lint check**

Run: `pnpm lint`
Expected: No errors

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Test application**

Run: `pnpm dev`
Test all routes:
- `/` - Home page
- `/login` - Login page
- `/creation` - Creation page
- `/ai-tools` - AI Tools page
- `/project/:id` - Project detail page

**Step 4: Final commit (if needed)**

If any changes were made during verification:
```bash
git add -A && git commit -m "fix: resolve lint/build issues after refactor"
```