import { authHandlers } from './auth'
import { canvasGeneratorHandlers } from './canvas-generator'
import { creationsHandlers } from './creations'
import { materialsHandlers } from './materials'
import { tagGroupHandlers } from './tag-groups'

export const handlers = [
  ...authHandlers,
  ...materialsHandlers,
  ...tagGroupHandlers,
  ...creationsHandlers,
  ...canvasGeneratorHandlers,
]