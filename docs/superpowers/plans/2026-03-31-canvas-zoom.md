# Canvas Zoom Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mouse wheel zoom to Canvas, centered at cursor position, with zoom percentage displayed in Toolbar.

**Architecture:** Create useCanvasZoom hook to encapsulate zoom logic. Canvas manages zoom state internally and notifies parent via callback. Toolbar displays zoom percentage. All transforms use inline styles.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Zustand

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/features/generator/hooks/useCanvasZoom.ts` | Create | Zoom logic hook (state + wheel handler) |
| `src/features/generator/hooks/index.ts` | Modify | Export new hook |
| `src/features/generator/components/Canvas.tsx` | Modify | Use hook, apply zoom transform |
| `src/features/generator/components/CanvasToolbar.tsx` | Modify | Display zoom percentage |
| `src/features/generator/components/GeneratorPage.tsx` | Modify | Connect zoom callback to Toolbar |

---

### Task 1: Create useCanvasZoom Hook

**Files:**
- Create: `src/features/generator/hooks/useCanvasZoom.ts`
- Modify: `src/features/generator/hooks/index.ts`

- [ ] **Step 1: Write the useCanvasZoom hook**

```typescript
// src/features/generator/hooks/useCanvasZoom.ts
import { useCallback, useState } from 'react'

interface UseCanvasZoomOptions {
  minZoom?: number
  maxZoom?: number
  step?: number
}

interface CanvasZoomResult {
  zoom: number
  offset: { x: number; y: number }
}

const DEFAULT_MIN_ZOOM = 0.25
const DEFAULT_MAX_ZOOM = 2.0
const DEFAULT_STEP = 0.1

export function useCanvasZoom(options?: UseCanvasZoomOptions) {
  const minZoom = options?.minZoom ?? DEFAULT_MIN_ZOOM
  const maxZoom = options?.maxZoom ?? DEFAULT_MAX_ZOOM
  const step = options?.step ?? DEFAULT_STEP

  const [zoom, setZoom] = useState(1)

  const handleWheel = useCallback(
    (e: React.WheelEvent, currentOffset: { x: number; y: number }): CanvasZoomResult => {
      const delta = e.deltaY > 0 ? -step : step
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta))

      // Skip if zoom unchanged (at boundary)
      if (newZoom === zoom) {
        return { zoom, offset: currentOffset }
      }

      // Cursor position relative to content (before zoom)
      const mouseXOnContent = (e.clientX - currentOffset.x) / zoom
      const mouseYOnContent = (e.clientY - currentOffset.y) / zoom

      // New offset to keep cursor at same content position
      const newOffset = {
        x: e.clientX - mouseXOnContent * newZoom,
        y: e.clientY - mouseYOnContent * newZoom,
      }

      return { zoom: newZoom, offset: newOffset }
    },
    [zoom, minZoom, maxZoom, step]
  )

  const resetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  return {
    zoom,
    setZoom,
    handleWheel,
    resetZoom,
  }
}
```

- [ ] **Step 2: Export hook from index**

```typescript
// src/features/generator/hooks/index.ts
export * from './keys'
export * from './useCanvas'
export * from './useCanvasZoom'
export * from './useChat'
export * from './useConversation'
```

- [ ] **Step 3: Run build to verify no TypeScript errors**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/hooks/useCanvasZoom.ts src/features/generator/hooks/index.ts
git commit -m "feat(generator): add useCanvasZoom hook"
```

---

### Task 2: Update Canvas Component

**Files:**
- Modify: `src/features/generator/components/Canvas.tsx`

- [ ] **Step 1: Update Canvas props interface**

Add `onZoomChange` callback prop:

```typescript
interface CanvasProps {
  tool?: 'select' | 'hand'
  onZoomChange?: (zoom: number) => void
}
```

- [ ] **Step 2: Import and use useCanvasZoom hook**

Update imports and add hook usage:

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useCanvasZoom } from '../hooks/useCanvasZoom'
import { CanvasItem } from './CanvasItem'

interface CanvasProps {
  tool?: 'select' | 'hand'
  onZoomChange?: (zoom: number) => void
}

export function Canvas({ tool = 'select', onZoomChange }: CanvasProps) {
  const { items, selectedId, handleDrag, selectItem, removeItem, handleDownload } = useCanvas()
  const { zoom, setZoom, handleWheel: handleZoomWheel } = useCanvasZoom()
  const canvasRef = useRef<HTMLElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  // ... rest of existing state
```

- [ ] **Step 3: Add wheel handler**

Add wheel event handler after existing mouse handlers:

```typescript
  // Handle zoom via wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const result = handleZoomWheel(e, canvasOffset)
      setZoom(result.zoom)
      setCanvasOffset(result.offset)
      onZoomChange?.(result.zoom)
    },
    [handleZoomWheel, canvasOffset, setZoom, onZoomChange]
  )
```

- [ ] **Step 4: Update section element with onWheel**

Update the section element to add `onWheel` and scale the background:

```typescript
  return (
    <section
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden bg-background ${
        tool === 'hand' ? 'cursor-grab' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.4) 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          selectItem(null)
        }
      }}
      aria-label='Canvas area'
    >
```

- [ ] **Step 5: Update content layer transform**

Update the content layer div to include scale:

```typescript
      {/* 可拖拽的内容层 */}
      <div
        className='absolute inset-0'
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
```

- [ ] **Step 6: Run build to verify no TypeScript errors**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 7: Commit**

```bash
git add src/features/generator/components/Canvas.tsx
git commit -m "feat(generator): add zoom functionality to Canvas"
```

---

### Task 3: Update CanvasToolbar to Display Zoom

**Files:**
- Modify: `src/features/generator/components/CanvasToolbar.tsx`

- [ ] **Step 1: Update CanvasToolbar props**

Add `zoom` prop:

```typescript
import { Hand, MousePointer2 } from 'lucide-react'

type Tool = 'select' | 'hand'

interface CanvasToolbarProps {
  onToolChange?: (tool: Tool) => void
  zoom?: number
}
```

- [ ] **Step 2: Display zoom percentage**

Update the component to display zoom below the tools:

```typescript
export function CanvasToolbar({ onToolChange, zoom = 1 }: CanvasToolbarProps) {
  const [activeTool, setActiveTool] = useState<Tool>('select')

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool)
    onToolChange?.(tool)
  }

  const zoomPercentage = Math.round(zoom * 100)

  return (
    <div className='absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 p-2 bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.3)]'>
      <button
        type='button'
        onClick={() => handleToolChange('select')}
        className={`p-3 rounded-xl transition-all duration-200 ${
          activeTool === 'select'
            ? 'bg-primary/15 text-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]'
            : 'hover:bg-surface-container-high text-muted-foreground hover:text-foreground'
        }`}
        title='选择工具'
      >
        <MousePointer2 className='w-5 h-5' />
      </button>

      <div className='w-5 h-px bg-border/50' />

      <button
        type='button'
        onClick={() => handleToolChange('hand')}
        className={`p-3 rounded-xl transition-all duration-200 ${
          activeTool === 'hand'
            ? 'bg-primary/15 text-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]'
            : 'hover:bg-surface-container-high text-muted-foreground hover:text-foreground'
        }`}
        title='拖拽画布'
      >
        <Hand className='w-5 h-5' />
      </button>

      <div className='w-5 h-px bg-border/50' />

      <div className='text-xs text-muted-foreground font-mono'>
        {zoomPercentage}%
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run build to verify no TypeScript errors**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/components/CanvasToolbar.tsx
git commit -m "feat(generator): display zoom percentage in CanvasToolbar"
```

---

### Task 4: Update GeneratorPage to Connect Zoom

**Files:**
- Modify: `src/features/generator/components/GeneratorPage.tsx`

- [ ] **Step 1: Add zoom state in GeneratorPage**

Add state to track zoom from Canvas:

```typescript
import { useEffect, useRef, useState } from 'react'
import { useConversation } from '../hooks'
import { useCanvasStore } from '../stores/canvas'
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

interface GeneratorPageProps {
  conversationId?: string
}

export function GeneratorPage({ conversationId }: GeneratorPageProps) {
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select')
  const [isLoaded, setIsLoaded] = useState(false)
  const [zoom, setZoom] = useState(1)

  // ... rest of existing code
```

- [ ] **Step 2: Pass zoom to CanvasToolbar**

Update the return to pass zoom:

```typescript
  return (
    <div className='relative h-full'>
      <Canvas tool={activeTool} onZoomChange={setZoom} />
      <FloatingChat conversationId={conversationId} />
      <CanvasToolbar onToolChange={setActiveTool} zoom={zoom} />
    </div>
  )
```

- [ ] **Step 3: Run build to verify no TypeScript errors**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/components/GeneratorPage.tsx
git commit -m "feat(generator): connect zoom display between Canvas and Toolbar"
```

---

### Task 5: Manual Testing

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`
Expected: Dev server starts

- [ ] **Step 2: Test zoom functionality**

1. Open the generator page with a canvas
2. Scroll mouse wheel up - canvas should zoom in
3. Scroll mouse wheel down - canvas should zoom out
4. Verify zoom percentage updates in toolbar
5. Verify grid background scales with zoom
6. Verify items scale correctly
7. Verify zoom centers at cursor position
8. Test boundary limits (25% and 200%)

- [ ] **Step 3: Test interaction with existing features**

1. Verify hand tool still works for panning
2. Verify select tool still works for selecting/dragging items
3. Verify items can be dragged at different zoom levels

---

### Task 6: Final Commit and Cleanup

- [ ] **Step 1: Run lint**

Run: `pnpm lint`
Expected: No linting errors

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Create summary commit if needed**

If all features are working correctly, no additional commit needed. All changes are already committed per task.