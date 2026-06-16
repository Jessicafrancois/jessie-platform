import './meet-the-mind.css'
import PageBackLink from '@/components/navigation/PageBackLink'


export default function MeetTheMindPage() {
return ( <main className="mind-shell">
  <PageBackLink />

  <div className="mind-background-word">
    Curiosity
  </div>

  <div className="mind-top-left">
    JESSICA
    <br />
    FRANCOIS
    <br />
    CREATIVE STRATEGIST
  </div>

<div className="mind-back ">

  <a
    href="/home-page"
    className="mind-back-link"
  >
    ← Back
  </a>

</div>

  <section className="mind-hero">

    <h1 className="mind-title">
      Meet
      <br />
      The Mind
    </h1>


    <div>
    <p className="mind-note">
      Meet the mind behind the world —
      the questions, stories, curiosities,
      and experiences that shaped everything
      you see here.
    </p></div>


  </section>

  <section className="mind-introduction">

    <div className="mind-intro-image">

      <img
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/profile/jessica.jpg`}
        alt="Jessica Francois"
      />

    </div>

    <div className="mind-intro-content">

      <blockquote>
        “Every human being on the face of the earth has a steel plate in his head, but if you lie down now and then and get still as you can, it will slide open like elevator doors, letting in all the secret thoughts that have been standing around so patiently, pushing the button for a ride to the top. The real troubles in life happen when those hidden doors stay closed for too long.”
      </blockquote>

      <span className="mind-quote-author">
        — Sue Monk Kidd,
        <em> The Secret Life of Bees</em>
      </span>

      <h2>
        Jessica Francois,
        <br />
        pleasure to meet you.
      </h2>

      <p>
        While you're here, you'll have the opportunity to meet me—or at least the wandering thoughts, ideas, questions, and curiosities I've chosen to make available.
      </p>

      <p>
        This page isn't a biography. It's an invitation into the systems, stories, experiences, and obsessions that shape the world you're exploring.
      </p>

      <p>
        Some of those ideas became ventures. Some became stories. Some became communities. The rest are still evolving. What follows is a collection of the identities, interests, and experiences that continue to shape this world.
      </p>

    </div>

  </section>

  <section className="mind-transition">

    <p>
      We are all collections of experiences.
    </p>

    <p>
      The pieces below are the ones that shaped this world.
    </p>

  </section>

  <section className="mind-divider">
    <span>THE COLLECTION</span>
  </section>

  <section className="mind-gallery">

    <article className="mind-card card-student">
      <a href="#student">
        <div className="artifact-number">001</div>
        <h2>The Student</h2>
      
      </a>
    </article>

    <article className="mind-card card-builder">
      <a href="#builder">
        <div className="artifact-number">002</div>
        <h2>The Builder</h2>
      </a>
    </article>

    <article className="mind-card card-explorer">
      <a href="#explorer">
        <div className="artifact-number">003</div>
        <h2>The Explorer</h2>
      </a>
    </article>

    <article className="mind-card card-storyteller">
      <a href="#storyteller">
        <div className="artifact-number">004</div>
        <h2>The Storyteller</h2>
      </a>
    </article>

    <article className="mind-card card-strategist">
      <a href="#strategist">
        <div className="artifact-number">005</div>
        <h2>The Strategist</h2>
      </a>
    </article>

  </section>

  <section className="mind-ending">

    <p className="mind-ending-script">
      Every world starts as a single thought.
    </p>

    <div className="mind-ending-line" />

    <span>
      Jessica Francois
    </span>

  </section>

</main>


)
}
