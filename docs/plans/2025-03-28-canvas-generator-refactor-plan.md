# Canvas Generator 重构实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 canvas-generator 页面重构为画布全屏底层，Chat 和工具栏作为浮动层覆盖在上方

**Architecture:** 使用 CSS 绝对定位将 Chat 组件（左上角浮动）和工具栏（底部居中浮动）置于画布之上，Chat 组件简化 UI 并支持收起/展开

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React

---

## 前置知识

### 项目结构（FSD）
- `src/features/canvas-generator/` - 功能模块
  - `components/` - UI 组件
  - `hooks/` - 业务逻辑 hooks
  - `stores/` - 状态管理
  - `types.ts` - 类型定义

### 命名规范
- 组件：PascalCase
- 函数：camelCase
- 文件夹：kebab-case

### 现有文件
- `CanvasGeneratorPage.tsx` - 页面入口（需要重构布局）
- `ChatPanel.tsx` - 当前聊天面板（将被替换）
- `Canvas.tsx` - 画布组件（保持不变）
- `CanvasToolbar.tsx` - 工具栏（需要修改按钮）

---

## Task 1: 重构 CanvasGeneratorPage 布局

**Files:**
- Modify: `src/features/canvas-generator/components/CanvasGeneratorPage.tsx`

**Step 1: 将 flex 布局改为相对定位容器**

当前代码：
```tsx
<div className='flex h-[calc(100vh-64px)]'>
  <ChatPanel />
  <div className='relative flex-1 flex flex-col'>
    <Canvas />
    <CanvasToolbar />
  </div>
</div>
```

修改为：
```tsx
<div className='relative h-[calc(100vh-64px)]'>
  <Canvas />
  {/* FloatingChat 和 CanvasToolbar 将在后续任务添加 */}
</div>
```

**Step 2: 运行 lint 检查**

Run: `pnpm lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/features/canvas-generator/components/CanvasGeneratorPage.tsx
git commit -m "refactor: change CanvasGeneratorPage to relative positioning"
```

---

## Task 2: 创建 FloatingChat 组件（简化版 UI）

**Files:**
- Create: `src/features/canvas-generator/components/FloatingChat.tsx`
- Modify: `src/features/canvas-generator/components/index.ts`

**Step 1: 创建 FloatingChat 组件**

创建文件 `src/features/canvas-generator/components/FloatingChat.tsx`：

```tsx
import { MessageSquare, Send, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCanvas } from '../hooks/useCanvas'
import { useChat } from '../hooks/useChat'

export function FloatingChat() {
  const [isExpanded, setIsExpanded] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { handleAddImage } = useCanvas()
  const { messages, isLoading, sendMessage } = useChat(handleAddImage)

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isExpanded])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string
    if (message.trim()) {
      await sendMessage(message)
      e.currentTarget.reset()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await sendMessage('', file)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 收起状态：显示浮动按钮
  if (!isExpanded) {
    return (
      <button
        type='button'
        onClick={() => setIsExpanded(true)}
        className='absolute left-4 top-4 z-20 p-3 bg-primary text-primary-foreground rounded-full shadow-elevation hover:bg-primary/90 transition-all'
        title='打开聊天'
      >
        <MessageSquare className='w-5 h-5' />
      </button>
    )
  }

  // 展开状态：显示完整面板
  return (
    <div className='absolute left-4 top-4 z-20 w-[380px] max-h-[600px] flex flex-col bg-card border border-border rounded-lg shadow-elevation transition-all duration-300'>
      {/* 关闭按钮 */}
      <div className='flex justify-end p-2 border-b border-border'>
        <button
          type='button'
          onClick={() => setIsExpanded(false)}
          className='p-1 text-muted-foreground hover:text-foreground rounded'
          title='收起'
        >
          <X className='w-4 h-4' />
        </button>
      </div>

      {/* 消息列表 */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]'>
        {messages.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>
            <p className='text-sm'>输入描述，让 AI 生成图片</p>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className='space-y-1'>
            <div className='flex justify-center'>
              <span className='text-xs text-muted-foreground/60'>
                {formatTime(message.timestamp)}
              </span>
            </div>

            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.role === 'assistant' && (
                  <button
                    type='button'
                    onClick={() => copyToClipboard(message.content)}
                    className='absolute -right-6 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-high rounded'
                    title='复制'
                  >
                    <span className='text-xs'>复制</span>
                  </button>
                )}

                {message.imageUrl && (
                  <div className='mb-2'>
                    <img src={message.imageUrl} alt='附件' className='max-w-[200px] rounded-lg' />
                  </div>
                )}

                <div className='whitespace-pre-wrap'>{message.content}</div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-muted rounded-xl px-3 py-2'>
              <div className='flex items-center gap-1.5'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce' />
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]' />
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]' />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 简化输入框 */}
      <div className='p-3 border-t border-border'>
        <form onSubmit={handleSubmit}>
          <div className='relative flex items-center'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileSelect}
            />
            
            {/* 上传按钮融入输入框左侧 */}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute left-2 p-1.5 text-muted-foreground hover:text-secondary transition-colors rounded'
              title='上传图片'
            >
              <Upload className='w-4 h-4' />
            </button>

            {/* 输入框 */}
            <input
              type='text'
              name='message'
              placeholder='描述你想要的效果...'
              className='w-full pl-10 pr-10 py-2 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground'
              disabled={isLoading}
            />

            {/* 发送按钮 */}
            <button
              type='submit'
              disabled={isLoading}
              className='absolute right-2 p-1.5 text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**Step 2: 导出 FloatingChat**

修改 `src/features/canvas-generator/components/index.ts`：

```typescript
export { Canvas } from './Canvas'
export { CanvasGeneratorPage } from './CanvasGeneratorPage'
export { CanvasItem } from './CanvasItem'
export { CanvasToolbar } from './CanvasToolbar'
export { ChatPanel } from './ChatPanel'
export { FloatingChat } from './FloatingChat'
```

**Step 3: 运行 lint 检查**

Run: `pnpm lint`
Expected: No errors

**Step 4: Commit**

```bash
git add src/features/canvas-generator/components/FloatingChat.tsx
git add src/features/canvas-generator/components/index.ts
git commit -m "feat: add FloatingChat component with simplified UI"
```

---

## Task 3: 更新 CanvasGeneratorPage 使用新组件

**Files:**
- Modify: `src/features/canvas-generator/components/CanvasGeneratorPage.tsx`

**Step 1: 引入并使用 FloatingChat**

修改 `CanvasGeneratorPage.tsx`：

```tsx
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

export function CanvasGeneratorPage() {
  return (
    <div className='relative h-[calc(100vh-64px)]'>
      <Canvas />
      <FloatingChat />
      <CanvasToolbar />
    </div>
  )
}
```

**Step 2: 运行 lint 检查**

Run: `pnpm lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/features/canvas-generator/components/CanvasGeneratorPage.tsx
git commit -m "refactor: integrate FloatingChat into CanvasGeneratorPage"
```

---

## Task 4: 修改 CanvasToolbar（调整按钮）

**Files:**
- Modify: `src/features/canvas-generator/components/CanvasToolbar.tsx`

**Step 1: 修改为选择工具 + 抓手工具**

```tsx
import { Hand, MousePointer2 } from 'lucide-react'
import { useState } from 'react'

type Tool = 'select' | 'hand'

export function CanvasToolbar() {
  const [activeTool, setActiveTool] = useState<Tool>('select')

  return (
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1.5 bg-card rounded-lg border border-border shadow-elevation'>
      <button
        type='button'
        onClick={() => setActiveTool('select')}
        className={`p-2 rounded transition-colors ${
          activeTool === 'select'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-container-high text-foreground'
        }`}
        title='选择工具'
      >
        <MousePointer2 className='w-5 h-5' />
      </button>
      
      <div className='w-px h-5 bg-border mx-1' />
      
      <button
        type='button'
        onClick={() => setActiveTool('hand')}
        className={`p-2 rounded transition-colors ${
          activeTool === 'hand'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-container-high text-foreground'
        }`}
        title='拖拽画布'
      >
        <Hand className='w-5 h-5' />
      </button>
    </div>
  )
}
```

**Step 2: 运行 lint 检查**

Run: `pnpm lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/features/canvas-generator/components/CanvasToolbar.tsx
git commit -m "refactor: update CanvasToolbar with select and hand tools only"
```

---

## Task 5: 清理旧代码（可选）

**Files:**
- Delete: `src/features/canvas-generator/components/ChatPanel.tsx`
- Modify: `src/features/canvas-generator/components/index.ts`

**Step 1: 删除 ChatPanel.tsx**

```bash
rm src/features/canvas-generator/components/ChatPanel.tsx
```

**Step 2: 更新 index.ts 移除 ChatPanel 导出**

```typescript
export { Canvas } from './Canvas'
export { CanvasGeneratorPage } from './CanvasGeneratorPage'
export { CanvasItem } from './CanvasItem'
export { CanvasToolbar } from './CanvasToolbar'
export { FloatingChat } from './FloatingChat'
```

**Step 3: 运行 lint 检查**

Run: `pnpm lint`
Expected: No errors

**Step 4: Commit**

```bash
git add src/features/canvas-generator/components/
git commit -m "chore: remove deprecated ChatPanel component"
```

---

## Task 6: 验证构建

**Step 1: 运行类型检查**

Run: `pnpm build`
Expected: Build successful

**Step 2: 运行开发服务器验证**

Run: `pnpm dev`
Expected: 
- 页面正常加载
- Chat 组件显示在左上角，默认展开
- 工具栏显示在底部居中
- 画布全屏显示

**Step 3: 功能验证清单**

- [ ] Chat 可以收起为浮动按钮
- [ ] Chat 可以重新展开
- [ ] 消息历史正常显示
- [ ] 可以输入文字发送
- [ ] 可以上传图片
- [ ] 工具栏有两个按钮（选择、抓手）
- [ ] 当前选中工具有高亮
- [ ] 画布可以拖拽元素

**Step 4: Commit（如有调整）**

```bash
git add .
git commit -m "fix: resolve any issues found during verification"
```

---

## 总结

重构完成后的页面结构：
```
CanvasGeneratorPage (relative)
├── Canvas (底层全屏)
├── FloatingChat (absolute, left-4 top-4)
└── CanvasToolbar (absolute, bottom-4 left-1/2)
```

**主要变更：**
1. 布局从 flex 改为绝对定位
2. Chat 组件简化 UI，移除标题和快捷按钮
3. 上传按钮融入输入框
4. Chat 支持收起/展开
5. 工具栏只保留选择和抓手工具
6. 删除旧的 ChatPanel 组件
