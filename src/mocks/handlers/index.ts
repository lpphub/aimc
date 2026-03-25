import { authHandlers } from './auth'
import { creationsHandlers } from './creations'
import { materialsHandlers } from './materials'
import { projectHandlers } from './projects'
import { tagGroupHandlers } from './tag-groups'
import { worksHandlers } from './works'

export const handlers = [
  ...authHandlers,
  ...projectHandlers,
  ...worksHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...creationsHandlers,
]
