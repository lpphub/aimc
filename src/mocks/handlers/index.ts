import { authHandlers } from './auth'
import { materialsHandlers } from './materials'
import { portfolioHandlers } from './portfolio'
import { projectHandlers } from './projects'

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...portfolioHandlers,
  ...materialsHandlers,
]
