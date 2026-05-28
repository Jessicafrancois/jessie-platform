import { z } from 'zod'

export const HeroSchema = z.object({
  title: z.string(),

  subtitle: z.string().optional(),

  image_url: z.string().optional(),

  cta_text: z.string().optional(),

  cta_url: z.string().optional(),
})