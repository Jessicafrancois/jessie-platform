import { ZodSchema } from 'zod'
import { ComponentType } from 'react'

export type SectionComponentProps<T = any> = {
  content: T
  sectionId?: string
  isEditing?: boolean
}

export type SectionDefinition<T = any> = {
  type: string
  label: string

  schema: ZodSchema<T>

  defaults: T

  editor: ComponentType<SectionComponentProps<T>>
  renderer: ComponentType<SectionComponentProps<T>>
  preview?: ComponentType<SectionComponentProps<T>>
}