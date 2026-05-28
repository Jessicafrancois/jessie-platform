import { SectionDefinition } from '..types'

import { HeroSchema } from '.schema'
import { heroDefaults } from '.defaults'

import HeroEditor from '.editor'
import HeroRenderer from '.renderer'
import HeroPreview from '.preview'

export const HeroSection SectionDefinition = {
  type 'hero',

  label 'Hero',

  schema HeroSchema,

  defaults heroDefaults,

  editor HeroEditor,

  renderer HeroRenderer,

  preview HeroPreview,
}