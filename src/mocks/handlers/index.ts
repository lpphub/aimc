import { authHandlers } from './auth'
import { projectHandlers } from './projects'

export const handlers = [...authHandlers, ...projectHandlers]
