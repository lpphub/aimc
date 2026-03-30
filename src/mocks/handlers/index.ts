import { authHandlers } from './auth'
import { generatorHandlers } from './generator'
import { toolsHandlers } from './tools'
import { materialsHandlers } from './materials'
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...toolsHandlers,
  ...generatorHandlers,
]