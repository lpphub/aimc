# Canvas Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a full-page draggable canvas with left chat panel for AI-powered product marketing image generation.

**Architecture:** React-based canvas using Zustand for state management, fixed-width chat panel on left, draggable image items with free positioning on dot-grid background canvas area.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query, lucide-react icons, existing API client (ky).

---

## Task 1: Create Feature Directory Structure

**Files:**
- Create: `src/features/canvas-generator/`
- Create: `src/features/canvas-generator/types.ts`
- Create: `src/features/canvas-generator/api.ts`
- Create: `src/features/canvas-generator/hooks/`
- Create: `src/features/canvas-generator/components/`
- Create: `src/features/canvas-generator/index.ts`

**Step 1: Create directory structure**

```bash
mkdir -p src/features/canvas-generator/hooks src/features/canvas-generator/components
```

Expected: Directories created

**Step 2: Commit**

```bash
git add src/features/canvas-generator/
git commit -m "feat: add canvas-generator feature directory structure"
```

---

## Task 2: Define TypeScript Types

**Files:**
- Create: `src/features/canvas-generator/types.ts`

**Step 1: Write types**

```typescript
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: number
}

export interface CanvasItem {
  id: string
  type: 'image'
  imageUrl: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface ChatMessageReq {
  conversationId?: string
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

export interface CanvasExportReq {
  items: CanvasItem[]
  format: 'png' | 'jpeg'
}

export interface CanvasExportResp {
  imageUrl: string
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/types.ts
git commit -m "feat: define canvas-generator TypeScript types"
```

---

## Task 3: Create Canvas API Client

**Files:**
- Create: `src/features/canvas-generator/api.ts`

**Step 1: Write API client**

```typescript
import api, { apiClient, unwrap } from '@/lib/api'
import type {
  ChatMessageReq,
  ChatMessageResp,
  CanvasExportReq,
  CanvasExportResp,
} from './types'

export const canvasGeneratorApi = {
  sendMessage: async (data: ChatMessageReq): Promise<ChatMessageResp> => {
    const formData = new FormData()
    formData.append('message', data.message)
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId)
    }
    if (data.image) {
      formData.append('image', data.image)
    }

    const res = await apiClient.post('canvas/chat', { body: formData })
    return unwrap<ChatMessageResp>(res)
  },

  exportCanvas: (data: CanvasExportReq) =>
    api.post<CanvasExportResp>('canvas/export', {
      items: data.items,
      format: data.format,
    }),
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/api.ts
git commit -m "feat: create canvas-generator API client"
```

---

## Task 4: Create Canvas Zustand Store

**Files:**
- Create: `src/features/canvas-generator/stores/canvas.ts`

**Step 1: Create stores directory and write store**

```bash
mkdir -p src/features/canvas-generator/stores
```

```typescript
import { create } from 'zustand'
import type { CanvasItem } from '../types'

interface CanvasState {
  items: CanvasItem[]
  selectedId: string | null
  isDragging: boolean
  
  addItem: (item: CanvasItem) => void
  updateItem: (id: string, updates: Partial<CanvasItem>) => void
  removeItem: (id: string) => void
  selectItem: (id: string | null) => void
  clearCanvas: () => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  items: [],
  selectedId: null,
  isDragging: false,
  
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  
  selectItem: (id) => set({ selectedId: id }),
  
  clearCanvas: () => set({ items: [], selectedId: null }),
}))
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/stores/canvas.ts
git commit -m "feat: create canvas Zustand store"
```

---

## Task 5: Create useCanvas Hook

**Files:**
- Create: `src/features/canvas-generator/hooks/useCanvas.ts`

**Step 1: Write useCanvas hook**

```typescript
import { useCallback } from 'react'
import { useCanvasStore } from '../stores/canvas'
import type { CanvasItem } from '../types'

export function useCanvas() {
  const { items, selectedId, addItem, updateItem, removeItem, selectItem } =
    useCanvasStore()

  const handleAddImage = useCallback(
    (imageUrl: string, position?: { x: number; y: number }) => {
      const item: CanvasItem = {
        id: crypto.randomUUID(),
        type: 'image',
        imageUrl,
        x: position?.x ?? 100,
        y: position?.y ?? 100,
        width: 300,
        height: 400,
        rotation: 0,
      }
      addItem(item)
    },
    [addItem]
  )

  const handleDrag = useCallback(
    (id: string, x: number, y: number) => {
      updateItem(id, { x, y })
    },
    [updateItem]
  )

  return {
    items,
    selectedId,
    handleAddImage,
    handleDrag,
    selectItem,
    removeItem,
  }
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/hooks/useCanvas.ts
git commit -m "feat: create useCanvas hook for canvas operations"
```

---

## Task 6: Create CanvasItem Component

**Files:**
- Create: `src/features/canvas-generator/components/CanvasItem.tsx`

**Step 1: Write CanvasItem component**

```typescript
import { memo, useCallback } from 'react'
import type { CanvasItem as CanvasItemType } from '../types'

interface CanvasItemProps {
  item: CanvasItemType
  isSelected: boolean
  onDrag: (id: string, x: number, y: number) => void
  onSelect: (id: string) => void
}

export const CanvasItem = memo(function CanvasItem({
  item,
  isSelected,
  onDrag,
  onSelect,
}: CanvasItemProps) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(item.id)
      
      const startX = e.clientX - item.x
      const startY = e.clientY - item.y

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onDrag(item.id, moveEvent.clientX - startX, moveEvent.clientY - startY)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [item.id, item.x, item.y, onDrag, onSelect]
  )

  return (
    <div
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-secondary' : ''}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={item.imageUrl}
        alt="Canvas item"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  )
})
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/components/CanvasItem.tsx
git commit -m "feat: create draggable CanvasItem component"
```

---

## Task 7: Create Canvas Component

**Files:**
- Create: `src/features/canvas-generator/components/Canvas.tsx`

**Step 1: Write Canvas component**

```typescript
import { useCallback } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { CanvasItem } from './CanvasItem'

export function Canvas() {
  const { items, selectedId, handleDrag, selectItem } = useCanvas()

  const handleCanvasClick = useCallback(() => {
    selectItem(null)
  }, [selectItem])

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle, #d1d5db 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: '#f9fafb',
      }}
      onClick={handleCanvasClick}
    >
      {items.map((item) => (
        <CanvasItem
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onDrag={handleDrag}
          onSelect={selectItem}
        />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/components/Canvas.tsx
git commit -m "feat: create Canvas component with dot-grid background"
```

---

## Task 8: Create CanvasToolbar Component

**Files:**
- Create: `src/features/canvas-generator/components/CanvasToolbar.tsx`

**Step 1: Write CanvasToolbar component**

```typescript
import { MousePointer2, Undo2, Redo2 } from 'lucide-react'

export function CanvasToolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border">
      <button
        className="p-2 hover:bg-gray-100 rounded"
        title="Select/Move"
      >
        <MousePointer2 className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-200" />
      <button
        className="p-2 hover:bg-gray-100 rounded"
        title="Undo"
      >
        <Undo2 className="w-5 h-5" />
      </button>
      <button
        className="p-2 hover:bg-gray-100 rounded"
        title="Redo"
      >
        <Redo2 className="w-5 h-5" />
      </button>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/components/CanvasToolbar.tsx
git commit -m "feat: create CanvasToolbar component"
```

---

## Task 9: Create ChatPanel Component

**Files:**
- Create: `src/features/canvas-generator/components/ChatPanel.tsx`

**Step 1: Write ChatPanel component**

```typescript
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { useCanvas } from '../hooks/useCanvas'
import { canvasGeneratorApi } from '../api'
import type { ChatMessage } from '../types'

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { handleAddImage } = useCanvas()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (image?: File) => {
    if (!input.trim() && !image) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      imageUrl: image ? URL.createObjectURL(image) : undefined,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await canvasGeneratorApi.sendMessage({
        conversationId,
        message: input,
        image,
      })

      setConversationId(response.conversationId)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message.content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (response.generatedImage?.imageUrl) {
        handleAddImage(
          response.generatedImage.imageUrl,
          response.generatedImage.suggestedPosition
        )
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      sendMessage(file)
    }
  }

  return (
    <div className="w-[380px] h-full flex flex-col bg-white border-r">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Attachment"
                  className="w-full rounded-lg mb-2"
                />
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="描述你想要的效果，让 AI 搞定所有设计"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || (!input.trim())}
            className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/components/ChatPanel.tsx
git commit -m "feat: create ChatPanel component with AI conversation"
```

---

## Task 10: Create CanvasGeneratorPage Component

**Files:**
- Create: `src/features/canvas-generator/components/CanvasGeneratorPage.tsx`

**Step 1: Write CanvasGeneratorPage component**

```typescript
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { ChatPanel } from './ChatPanel'

export function CanvasGeneratorPage() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ChatPanel />
      <div className="relative flex-1 flex flex-col">
        <Canvas />
        <CanvasToolbar />
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/features/canvas-generator/components/CanvasGeneratorPage.tsx
git commit -m "feat: create CanvasGeneratorPage component"
```

---

## Task 11: Create Component Index and Feature Exports

**Files:**
- Create: `src/features/canvas-generator/components/index.ts`
- Modify: `src/features/canvas-generator/index.ts`

**Step 1: Write components index**

```typescript
export * from './Canvas'
export * from './CanvasGeneratorPage'
export * from './CanvasItem'
export * from './CanvasToolbar'
export * from './ChatPanel'
```

**Step 2: Update feature index**

```typescript
export * from './api'
export {
  Canvas,
  CanvasGeneratorPage,
  CanvasItem,
  CanvasToolbar,
  ChatPanel,
} from './components'
export * from './hooks/useCanvas'
export * from './stores/canvas'
export * from './types'
```

**Step 3: Commit**

```bash
git add src/features/canvas-generator/components/index.ts src/features/canvas-generator/index.ts
git commit -m "feat: add canvas-generator exports"
```

---

## Task 12: Add Route and Page

**Files:**
- Create: `src/pages/CanvasGenerator.tsx`
- Modify: `src/app/router/index.tsx`

**Step 1: Create page component**

```typescript
import { Image } from 'lucide-react'
import { CanvasGeneratorPage } from '@/features/canvas-generator'

export default function CanvasGenerator() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="flex items-center gap-4 p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-secondary-container/20 to-secondary/20 border border-secondary-container/30">
          <Image className="w-6 h-6 text-secondary-container" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            画布生成器
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI 对话生成商品营销图片
          </p>
        </div>
      </div>

      <CanvasGeneratorPage />
    </div>
  )
}
```

**Step 2: Update router**

Read `src/app/router/index.tsx` and add:

```typescript
const CanvasGenerator = lazy(() => import('@/pages/CanvasGenerator'))

// Add to Layout children:
{ path: '/canvas', element: <CanvasGenerator /> },
```

**Step 3: Commit**

```bash
git add src/pages/CanvasGenerator.tsx src/app/router/index.tsx
git commit -m "feat: add canvas generator route and page"
```

---

## Task 13: Run Lint and Build

**Step 1: Run lint**

```bash
pnpm lint
```

Expected: No errors (or fix any reported)

**Step 2: Run build**

```bash
pnpm build
```

Expected: Build succeeds with no errors

**Step 3: Commit if fixes needed**

```bash
git add -A
git commit -m "fix: address lint/build issues"
```

---

## Testing Checklist

Manual testing steps:

1. Navigate to `/canvas`
2. Verify chat panel is fixed width (~380px) on left
3. Verify canvas fills remaining space with dot-grid background
4. Verify toolbar is centered at bottom of canvas
5. Type message in chat input and send
6. Upload image via paperclip button
7. Verify generated images appear on canvas
8. Click and drag images to reposition
9. Verify selected image shows ring border
10. Click canvas to deselect

---

## Future Enhancements (Out of Scope)

- Undo/Redo functionality
- Image resizing handles
- Canvas export
- Chat history persistence
- Multi-image selection
- Keyboard shortcuts
