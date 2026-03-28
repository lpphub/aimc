# Canvas Dialog Design - AI Image Generation

**Date:** 2026-03-28  
**Feature:** AI-powered product marketing image generation canvas

---

## Overview

A full-page draggable canvas with a fixed-width chat panel on the left for communicating with an AI agent to generate and modify product marketing images.

## User Flow

1. User opens the canvas generator page
2. Chat with AI agent in the left panel
3. Upload product images via chat
4. Request image modifications/enhancements
5. Generated images appear on canvas
6. Freely position images on canvas
7. Export final composition

## Architecture

### Component Structure (FSD)

```
src/features/canvas-generator/
├── api.ts              # AI agent chat & image generation APIs
├── types.ts            # Chat message, canvas item types
├── hooks/
│   ├── useCanvas.ts    # Canvas state & drag logic
│   └── useChat.ts      # Chat conversation with AI
├── components/
│   ├── CanvasGeneratorPage.tsx  # Main page component
│   ├── ChatPanel.tsx            # Left sidebar chat UI
│   ├── Canvas.tsx               # Draggable canvas area
│   ├── CanvasItem.tsx           # Draggable image component
│   └── CanvasToolbar.tsx        # Bottom toolbar
└── index.ts
```

### Layer Dependencies

- `pages/CanvasGenerator.tsx` - Route page composition
- `features/canvas-generator/` - Feature business logic
- `shared/components/ui/` - Reusable UI components
- `lib/api.ts` - API client

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header (optional)                                           │
├──────────────┬──────────────────────────────────────────────┤
│ Chat Panel   │  Canvas Area (dot-grid background)           │
│ (380px fixed)│  ┌─────────────────────────────────────────┐ │
│              │  │  • Draggable image items                │ │
│ ┌──────────┐ │  │  • Free positioning                     │ │
│ │ AI Msg   │ │  │  • Drop zone for uploads                │ │
│ │ User Msg │ │  │                                         │ │
│ │ AI Msg   │ │  │         [Image]    [Image]              │ │
│ │          │ │  │                                         │ │
│ └──────────┘ │  └─────────────────────────────────────────┘ │
│              │                                              │
│ [Input + 📎] │  ┌─────────────────────────────────────────┐ │
│              │  │ Toolbar: [Select/Move] [Undo] [Redo]    │ │
│              │  └─────────────────────────────────────────┘ │
──────────────┴──────────────────────────────────────────────┘
```

## Data Models

### Chat Message

```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: number
}
```

### Canvas Item

```typescript
interface CanvasItem {
  id: string
  type: 'image'
  imageUrl: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}
```

### API Types

```typescript
interface ChatMessageReq {
  conversationId?: string
  message: string
  image?: File
}

interface ChatMessageResp {
  conversationId: string
  message: ChatMessage
  generatedImage?: {
    imageUrl: string
    suggestedPosition?: { x: number; y: number }
  }
}

interface CanvasExportReq {
  items: CanvasItem[]
  format: 'png' | 'jpeg'
}

interface CanvasExportResp {
  imageUrl: string
}
```

## State Management

### Canvas Store (Zustand)

```typescript
interface CanvasState {
  items: CanvasItem[]
  selectedId: string | null
  isDragging: boolean
  
  // Actions
  addItem: (item: CanvasItem) => void
  updateItem: (id: string, updates: Partial<CanvasItem>) => void
  removeItem: (id: string) => void
  selectItem: (id: string | null) => void
  clearCanvas: () => void
}
```

### Chat State (Component + TanStack Query)

- Conversation history via TanStack Query
- Input state in component
- Streaming responses handled via component state

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/canvas/chat` | Send message to AI agent |
| POST | `/canvas/generate` | Generate image from prompt |
| POST | `/canvas/export` | Export canvas as image |

## Error Handling

1. **API Errors**: Display in chat as AI message
2. **Upload Errors**: Show toast notification
3. **Canvas Errors**: Silent fail with console log

## Styling

- Tailwind CSS only
- Dot-grid background via CSS pattern
- Fixed chat panel: `w-[380px]`
- Canvas fills remaining space: `flex-1`
- Toolbar: fixed at bottom of canvas area

## Future Considerations (Out of Scope)

- Multi-image selection
- Image resizing handles
- Layer management
- Text overlay on images
- Template presets
- Collaboration features
