import HomeHero from '../home/HomeHero'
import HomeIntro from '../home/HomeIntro'
import HomeManifesto from '../home/HomeManifesto'
import HomeShift from '../home/HomeShift'

import CinematicImage from './CinematicImage'
import CinematicQuote from './CinematicQuote'
import CinematicStatement from './CinematicStatement'

import { Section } from '@/app/lib/sections'

type Props = {
  sections: Section[]
}

export default function SectionRenderer({
  sections,
}: Props) {

  return (
    <>
      {sections.map((section, index) => {

        switch (section.type) {

          case 'hero':
            return <HomeHero key={index} />

          case 'intro':
            return <HomeIntro key={index} />

          case 'manifesto':
            return <HomeManifesto key={index} />

          case 'shift':
            return <HomeShift key={index} />

          case 'quote':
            return (
              <CinematicQuote
                key={index}
                quote={section.quote || ''}
              />
            )

          case 'statement':
            return (
              <CinematicStatement
                key={index}
                text={section.content || ''}
              />
            )

          case 'image':
            return (
              <CinematicImage
                key={index}
                image={section.image || ''}
              />
            )

          default:
            return null

        }

      })}
    </>
  )
}