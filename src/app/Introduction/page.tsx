import CinematicLayout from '../components/CinematicLayout'
import CinematicPageShell from '../components/CinematicPageShell'
import CinematicFooter from '../components/CinematicFooter'
import FounderStatement from '../components/FounderStatement'
import CinematicImage from '../components/CinematicImage'
import CinematicQuote from '../components/CinematicQuote'

export default function IntroductionsPage() {
  return (
    <CinematicLayout>

      <CinematicPageShell
        kicker="Introductions"
        title="Entering the world behind the work."
        subtitle="Narrative systems, emotional architecture, and immersive storytelling."
      />

      <FounderStatement
        title="Philosophy"
        text="I believe the future belongs to emotionally immersive experiences."
      />

      <CinematicImage
        image="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1800&auto=format&fit=crop"
      />

      <FounderStatement
        title="Perspective"
        text="The strongest ventures are no longer products. They are worlds people emotionally enter."
      />

      <CinematicQuote
        quote="Atmosphere is becoming the foundation of modern storytelling."
      />

      <FounderStatement
        title="Direction"
        text="I’m interested in the emotional architecture behind identity, narrative, memory, and belonging."
      />

      <CinematicFooter />

    </CinematicLayout>
  )
}