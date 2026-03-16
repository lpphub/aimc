# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIMC (智绘工坊) - AI-powered creative workflow platform.

## Development Commands

```bash
pnpm dev        # Start dev server on port 5000
pnpm build      # Build for production (runs tsc then vite build)
pnpm lint       # Biome lint check
pnpm lint:fix   # Biome lint with auto-fix
pnpm format     # Biome format
```

Adding shadcn/ui components:
```bash
npx shadcn@latest add <component>
npx shadcn@latest add <component> --overwrite
```

## Architecture

### Directory Structure

- `src/app/` - Application core (router, providers, App.tsx)
- `src/pages/` - Page components (route entry points)
- `src/features/` - Business feature modules (auth, project, creation, ai-tools)
- `src/shared/` - Cross-feature shared resources (components/ui, stores, utils)
- `src/lib/` - Core library wrappers (ky HTTP client, utilities)
- `src/mocks/` - MSW mock handlers for development

### Feature Module Structure

Each feature follows this pattern:
```
src/features/<feature>/
├── api.ts        # API endpoints using ky client
├── types.ts      # TypeScript interfaces
├── hooks.ts      # TanStack Query hooks (or hooks/index.ts)
├── components/   # Feature-specific components
└── index.ts      # Public exports
```

### Data Flow Pattern

```
Component → Hook (TanStack Query) → API (ky) → Backend
                ↓
           Store (Zustand) - for client state
```

## Key Patterns

### API Layer

Use the `api` client from `@/lib/api`. It handles:
- Bearer token injection
- 401 retry with token refresh
- Response unwrapping (`ApiResponse<T>` → `T`)

```typescript
// src/lib/api.ts provides typed methods
api.get<T>(url, params?)
api.post<T, D>(url, body?)
api.put<T, D>(url, body?)
api.patch<T, D>(url, body?)
api.delete<T>(url)
```

### Query Keys Pattern

Define query keys as const objects for cache management:

```typescript
export const featureKeys = {
  all: ['feature'] as const,
  list: () => [...featureKeys.all, 'list'] as const,
  detail: (id: string) => [...featureKeys.all, 'detail', id] as const,
}
```

### Hooks Pattern

Use TanStack Query hooks with query key invalidation:

```typescript
export function useFeatureList() {
  return useQuery({
    queryKey: featureKeys.list(),
    queryFn: () => featureApi.list(),
  })
}

export function useCreateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReq) => featureApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.list() })
    },
  })
}
```

### Store Pattern

Zustand stores in `src/shared/stores/` with persist middleware for auth state.

## Coding Conventions

### TypeScript

- Use `type` for object types, `interface` for extensible types
- Export types from `types.ts` in each feature
- Use path alias `@/` for imports

### React

- Use function components with arrow functions
- Prefer named exports for components
- Use `useAuthStore` selector pattern: `useAuthStore(s => s.user)`

### Code Style (Biome)

- Single quotes for strings
- No semicolons (asNeeded)
- ES5 trailing commas
- 2-space indentation
- 100 char line width

### Import Order

Group imports logically:
1. React/React ecosystem
2. Third-party libraries
3. Local imports (use `@/` alias)
4. Types (use `type` keyword)

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/features/auth/types'
import { authApi } from '@/features/auth/api'
```

## Adding a New Feature

1. Create feature directory: `src/features/<feature>/`
2. Define types in `types.ts`
3. Create API endpoints in `api.ts`
4. Create query keys and hooks in `hooks.ts`
5. Build components
6. Add route in `src/app/router/index.tsx`
7. Add MSW handlers in `src/mocks/handlers/` for development

## Environment Variables

```bash
VITE_API_BASE_URL=/api       # Backend API base URL
VITE_ENABLE_PROXY=true       # Enable Vite proxy to localhost:8080
```

## Mock Data (Development)

MSW is enabled in development. Test account:
- Email: `test@aimc.com`
- Password: `123456`