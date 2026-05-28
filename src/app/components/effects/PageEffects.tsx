'use client'

import { useEffect } from 'react'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PageEffects() {

  useEffect(() => {

    if (typeof window === 'undefined') return

    const reveals = gsap.utils.toArray('.reveal')

    reveals.forEach((element: any) => {

      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,

          duration: 1.4,

          ease: 'power3.out',

          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        }
      )

    })

    const heroImage = document.querySelector('.cinematic-hero img')

    if (heroImage) {

      gsap.to(heroImage, {
        yPercent: 12,

        scale: 1.12,

        ease: 'none',

        scrollTrigger: {
          trigger: '.cinematic-hero',
          scrub: true,
        },
      })

    }

    const glow = document.querySelector('.ambient-glow')

    if (glow) {

      gsap.to(glow, {
        y: 120,

        ease: 'none',

        scrollTrigger: {
          trigger: glow,
          scrub: true,
        },
      })

    }

    return () => {

      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill()
      })

    }

  }, [])

  return null
}