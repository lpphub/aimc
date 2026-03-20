# CLAUDE.md (AI-STRICT MODE, STYLING INCLUDED)

## 0. Mission

AI MUST generate code according to these rules:

- All code MUST follow feature-based architecture.
- Components MUST NOT contain business logic or API calls.
- API data MUST go through Hooks.
- Feature modules MUST be isolated.
- Server data MUST NOT be stored in Zustand.
- Query keys MUST be centralized per feature.
- Styling changes MUST follow Tailwind CSS + CVA + semantic color rules.

---

## 1. Naming Conventions (MUST)

### 1.1 Components
- PascalCase
- Example: `UserProfile.tsx`, `VideoCard.tsx`

### 1.2 Utility Functions
- camelCase
- Example: `formatDate`, `calculateTotal`

### 1.3 Constants
- UPPER_SNAKE_CASE
- Example: `MAX_RETRY_COUNT`, `API_TIMEOUT`

### 1.4 Directories / Folders
- kebab-case
- Example: `user-profile/`, `video-list/`

### 1.5 API Types
- Request payloads → XxxReq
- Response data → XxxResp
- Example:
```ts
export interface ListVideosReq { page: number; pageSize: number }
export interface VideoItem { id: string; title: string; coverUrl: string }
export interface ListVideosResp { list: VideoItem[]; total: number }
export interface CreateVideoReq { title: string; coverUrl: string }
export interface CreateVideoResp { id: string }
```

### 1.6 Query Keys
- Must be stored in a single object per feature
- All keys should be `const` and descriptive
- Example:
```ts
export const videoKeys = {
  all: ['video'] as const,
  list: () => [...videoKeys.all, 'list'] as const,
  detail: (id: string) => [...videoKeys.all, 'detail', id] as const,
}
```

### 1.7 Stores (Zustand)
- Store names MUST match purpose
- Example: `useAuthStore`, `useThemeStore`, `useLocaleStore`
- MUST NOT store server data

---

## 2. Feature Architecture (MUST)

```
src/features/<feature>/
├── api.ts                 # API endpoints
├── types.ts               # API types
├── hooks/                 # Query Hooks
│   └── index.ts
├── components/            # Feature components
└── index.ts               # Public exports
```

Rules:

- Components MUST NOT call API directly.
- API functions MUST be typed with XxxReq / XxxResp.
- Hooks MUST use TanStack Query.
- Components MUST use hooks for data.
- Features MUST NOT import from other features (only `shared/` allowed).

---

## 3. API Rules (MUST)

- Must return typed responses.
- Must not use `any`.
- Must use ky client.
- Example:

```ts
import api from '@/lib/api'
import type { ListVideosReq, ListVideosResp } from './types'

export const videoApi = {
  list: (params: ListVideosReq) => api.get<ListVideosResp>('videos', { searchParams: params }),
  create: (data: CreateVideoReq) => api.post<CreateVideoResp>('videos', data),
}
```

---

## 4. Hook Rules (MUST)

- Must use `useQuery` / `useMutation` from TanStack Query.
- Query keys MUST follow QueryKeys object.
- Example:

```ts
export function useVideoList(params: ListVideosReq) {
  return useQuery({
    queryKey: [...videoKeys.list(), params],
    queryFn: () => videoApi.list(params),
  })
}
```

---

## 5. Data Flow (MUST)

- Components → Hooks → API → Backend
- NEVER call API directly in component
- NEVER store server response in Zustand

---

## 6. Zustand Usage (MUST)

- Only for `auth`, `theme`, `locale`
- Store names MUST match purpose
- NEVER store server data

---

## 7. Styling Rules (MUST)

- Tailwind classes only
- Use `cn()` for conditional classes
- Use semantic color classes (`text-muted-foreground`, `bg-primary`, `bg-primary-foreground`)
- NO inline styles
- NO hardcoded colors
- **CVA Variants**
  - Only allowed for buttons, inputs, and other UI primitives
  - Must not introduce new colors outside Tailwind preset
  - Must not override global `:root` variables outside theme store
- **Theme changes**
  - Light/dark mode only via `useThemeStore` + `document.documentElement.classList.toggle('dark')`
  - Global colors (`--primary`, `--foreground`, `--background`) MUST NOT be hardcoded in component CSS

---

## 8. Routing Rules (MUST)

- Pages MUST be lazy-loaded
- Auth guard MUST be applied via `<AuthGuard requireAuth>`
- All routes MUST be defined in `app/router/index.tsx`

---

## 9. Prohibitions (MUST)

- NO class components
- NO var keyword
- NO direct database calls
- NO comments in AI-generated code
- NEVER invent types outside XxxReq / XxxResp
- NEVER bypass feature isolation
