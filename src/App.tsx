import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MenuOverlay } from '@/components/layout/MenuOverlay'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Philosophy } from '@/components/sections/Philosophy'
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

  const placeholders = [
    { id: 'projects', title: ui.placeholders.projects },
    { id: 'contact', title: ui.placeholders.contact },
  ]

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
        {placeholders.map((p) => (
          <section key={p.id} id={p.id} className="min-h-screen px-4 py-24 md:px-10">
            <h2 className="font-display text-5xl font-extrabold uppercase text-faint md:text-7xl">
              {p.title}
            </h2>
          </section>
        ))}
      </main>
    </LenisContext.Provider>
  )
}
