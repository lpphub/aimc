import { authHandlers } from './auth'
import { portfolioHandlers } from './portfolio'
import { projectHandlers } from './projects'

export const handlers = [...authHandlers, ...projectHandlers, ...portfolioHandlers]
