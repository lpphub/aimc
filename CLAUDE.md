# CLAUDE.md — AI HARD MODE (FSD)

## Core Rules

- Follow Feature-Sliced Design (FSD)
- Layers: `app` → `pages` → `features` → `shared`
- Components = UI only (no business logic / API)
- Data flow: Component → Hook → API
- Use TanStack Query for all server data
- No server data in Zustand
- No upward or cross-layer violations
- Full TypeScript strict (no `any`)

## Commands

- `pnpm build` - Build project (runs tsc + vite build)
- `pnpm dev` - Start dev server (Vite)
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint with Biome
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome

## Structure

src/
- app/        # app init, providers, router
- pages/      # route-level composition only
- features/   # business features (isolated)
- shared/     # reusable logic (ui, lib, hooks, config)
- lib/        # global clients (api, env, utils)

### Feature

src/features/<feature>/
- api.ts
- types.ts
- hooks/
- components/
- model/ (optional)
- index.ts


## Layer Rules

- `app` → can import all
- `pages` → can import `features`, `shared`
- `features` → can import `shared` only
- `shared` → cannot import from other layers
- `lib` → global, no feature dependency


## Naming

- Component: PascalCase
- Function: camelCase
- Constant: UPPER_SNAKE_CASE
- Folder: kebab-case

Types:
- Request → XxxReq
- Response → XxxResp

## Data Rules

- Components → Hooks → API → Backend
- API via `ky`, fully typed
- Hooks wrap ALL requests
- No API calls in components

Query Keys (per feature):

export const xxxKeys = {
  all: ["xxx"] as const,
}

## State

Zustand ONLY for:
- auth
- theme
- locale

NEVER store server data

## Styling

- Tailwind only
- No CSS files / inline styles
- Use semantic tokens only
- Use `cn()` for conditions

CVA:
- Only for base UI components

Theme:
- Controlled via `useThemeStore`
- Toggle `document.documentElement.classList`

## Routing

- Defined in `app`
- Pages are composition only
- Support lazy loading
- Use `<AuthGuard>`

## Forbidden

- class components
- var
- any
- API calls in components
- cross-feature imports
- layer violations
- custom server state

## Workflow

- typecheck after changes
