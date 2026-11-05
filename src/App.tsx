import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MenuOverlay } from '@/components/layout/MenuOverlay'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Philosophy } from '@/components/sections/Philosophy'
import { Projects } from '@/components/sections/Projects'
import { Services } from '@/components/sections/Services'
import { Skills } from '@/components/sections/Skills'
import { LenisContext } from '@/context/lenisContext'
import { portfolioData } from '@/data/portfolioData'
import { useLenis } from '@/hooks/useLenis'
import { shouldShowPreloader } from '@/lib/preloaderSession'

export default function App() {
  const lenis = useLenis()
  const { ui } = portfolioData
  const [showPreloader, setShowPreloader] = useState(shouldShowPreloader)
  const [menuOpen, setMenuOpen] = useState(false)

  const donePreloader = useCallback(() => setShowPreloader(false), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <LenisContext.Provider value={lenis}>
      <AnimatePresence>
        {showPreloader && <Preloader onDone={donePreloader} />}
      </AnimatePresence>
      <Navbar menuOpen={menuOpen} onOpenMenu={openMenu} />
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      <main>
        <Hero ready={!showPreloader} />
        <About />
        <Philosophy />
        <Skills />
        <Projects />
        <Services />
        <Experience />
        <section id="contact" className="min-h-screen px-4 py-24 md:px-10">
          <h2 className="font-display text-5xl font-extrabold uppercase text-faint md:text-7xl">
            {ui.placeholders.contact}
          </h2>
        </section>
      </main>
    </LenisContext.Provider>
  )
}
