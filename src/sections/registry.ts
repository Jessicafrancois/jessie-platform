import { HeroSection } from './hero'

export const SECTION_REGISTRY = {
  hero: HeroSection,
}

export type SectionType = keyof typeof SECTION_REGISTRY