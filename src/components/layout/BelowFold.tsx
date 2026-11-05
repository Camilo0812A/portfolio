import { useEffect } from 'react'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Music } from '@/components/sections/Music'
import { Philosophy } from '@/components/sections/Philosophy'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'

/** Secciones bajo el pliegue: se cargan en un chunk aparte tras el Hero. */
export default function BelowFold() {
  // Si la URL trae un ancla (#projects), se desplaza cuando la sección ya existe.
  useEffect(() => {
    const { hash } = window.location
    if (hash.length > 1) document.querySelector(hash)?.scrollIntoView()
  }, [])

  return (
    <>
      <About />
      <Philosophy />
      <Skills />
      <Projects />
      <Services />
      <Experience />
      <Music />
      <Contact />
    </>
  )
}
