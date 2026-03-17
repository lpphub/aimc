import { authHandlers } from './auth'
import { materialsHandlers } from './materials'
import { portfolioHandlers } from './portfolio'
import { projectHandlers } from './projects'
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...portfolioHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
]
