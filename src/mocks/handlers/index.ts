import { authHandlers } from './auth'
import { generatorHandlers } from './generator'
import { creationsHandlers } from './creations'
import { materialsHandlers } from './materials'
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...creationsHandlers,
  ...generatorHandlers,
]