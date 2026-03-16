# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

For development guidelines, coding conventions, and architecture patterns, see [CLAUDE.md](./CLAUDE.md).

## Quick Reference

- **Dev server**: `pnpm dev` (port 5000)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` / `pnpm lint:fix`
- **Format**: `pnpm format`

## Architecture Summary

```
src/
├── app/          # Router, providers, App.tsx
├── pages/        # Page components (route entry points)
├── features/     # Business modules (auth, project, etc.)
├── shared/       # UI components, stores, utils
├── lib/          # Core library wrappers (ky HTTP client)
└── mocks/        # MSW handlers for development
```

## Key Technologies

- React 19 + TypeScript
- Vite 7 + Tailwind CSS 4
- TanStack Query (data fetching)
- Zustand (state management)
- shadcn/ui (UI components)
- Biome (linting/formatting)