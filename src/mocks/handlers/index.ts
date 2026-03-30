import { authHandlers } from './auth'
import { generatorHandlers } from './generator'
import { materialsHandlers } from './materials'
import { tagGroupHandlers } from './tag-groups'
import { toolsHandlers } from './tools'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...toolsHandlers,
  ...generatorHandlers,
]
