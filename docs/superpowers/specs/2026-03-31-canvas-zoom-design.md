---
name: Canvas Zoom Feature
description: Add zoom in/out functionality to Canvas with mouse wheel, zooming centered at cursor position
type: project
---

# Canvas Zoom Feature Design

## Overview

Add zoom capability to the Canvas component, allowing users to zoom in/out using mouse wheel. Items on the canvas will scale accordingly, with the zoom centered at the cursor position for intuitive navigation.

## Requirements

| Aspect | Specification |
|--------|---------------|
| Trigger | Mouse wheel (scroll up = zoom in, scroll down = zoom out) |
| Zoom Center | Cursor position (like Figma/Sketch) |
| Zoom Range | 25% - 200% (0.25 - 2.0) |
| Step Size | 10% per wheel tick |
| Style Method | Pure inline style |
| UI Indicator | Display zoom percentage in CanvasToolbar |

## Architecture

### New Hook: `useCanvasZoom`

Extract zoom logic into a dedicated hook following FSD architecture.

**Location:** `src/features/generator/hooks/useCanvasZoom.ts`

**Interface:**

```typescript
interface UseCanvasZoomOptions {
  minZoom?: number   // default: 0.25
  maxZoom?: number   // default: 2.0
  step?: number      // default: 0.1
}

interface CanvasZoomResult {
  zoom: number
  offset: { x: number; y: number }
}

function useCanvasZoom(options?: UseCanvasZoomOptions): {
  zoom: number
  setZoom: (zoom: number) => void
  handleWheel: (e: React.WheelEvent, currentOffset: { x: number; y: number }) => CanvasZoomResult
}
```

**Core Algorithm:**

```typescript
handleWheel(e, currentOffset) {
  const delta = e.deltaY > 0 ? -step : step
  const newZoom = clamp(zoom + delta, minZoom, maxZoom)

  // Cursor position relative to content (before zoom)
  const mouseXOnContent = (e.clientX - currentOffset.x) / zoom
  const mouseYOnContent = (e.clientY - currentOffset.y) / zoom

  // New offset to keep cursor at same content position
  const newOffset = {
    x: e.clientX - mouseXOnContent * newZoom,
    y: e.clientY - mouseYOnContent * newZoom,
  }

  return { zoom: newZoom, offset: newOffset }
}
```

### Component Changes

**Canvas.tsx:**

1. Import and use `useCanvasZoom` hook
2. Add `onWheel` event handler to section element
3. Apply zoom to content layer via inline style: `transform: translate(...) scale(...)`
4. Scale grid background size: `backgroundSize: ${20 * zoom}px`

**CanvasToolbar.tsx:**

1. Accept `zoom` prop from parent
2. Display zoom percentage (e.g., "100%", "50%", "150%")
3. Position below tool buttons

**GeneratorPage.tsx:**

1. Lift zoom state from Canvas (or Canvas manages it internally with hook)
2. Pass zoom to CanvasToolbar for display

### Data Flow

```
GeneratorPage
├── Canvas (uses useCanvasZoom, manages zoom state internally)
│   └── Content Layer (transform: translate + scale)
│       └── CanvasItem (scales automatically with parent)
└── CanvasToolbar (receives zoom via callback/prop)
```

**Why:** Canvas manages its own zoom state internally using the hook. GeneratorPage doesn't need direct access to zoom - CanvasToolbar can receive it via a callback pattern or Canvas can expose a ref. Simpler option: Canvas manages zoom internally and calls `onZoomChange` callback to notify parent for Toolbar display.

## Implementation Steps

1. Create `useCanvasZoom.ts` hook
2. Update `Canvas.tsx` to use hook and handle wheel events
3. Update `CanvasToolbar.tsx` to display zoom percentage
4. Update `GeneratorPage.tsx` to connect zoom display
5. Test zoom behavior with items on canvas

## File Changes

| File | Action |
|------|--------|
| `src/features/generator/hooks/useCanvasZoom.ts` | Create |
| `src/features/generator/hooks/index.ts` | Export new hook |
| `src/features/generator/components/Canvas.tsx` | Modify |
| `src/features/generator/components/CanvasToolbar.tsx` | Modify |
| `src/features/generator/components/GeneratorPage.tsx` | Modify |

## Edge Cases

- **Zoom at boundary:** When already at min/max, wheel events have no effect
- **Dragging during zoom:** Existing drag behavior should work at any zoom level (positions stored in canvas coordinates, not screen coordinates)
- **Grid alignment:** Grid should remain visually consistent at all zoom levels