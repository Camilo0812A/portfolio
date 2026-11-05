import { lazy, Suspense, useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MenuOverlay } from '@/components/layout/MenuOverlay'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { LenisContext } from '@/context/lenisContext'
import { portfolioData } from '@/data/portfolioData'
import { useLenis } from '@/hooks/useLenis'
import { shouldShowPreloader } from '@/lib/preloaderSession'

const BelowFold = lazy(() => import('@/components/layout/BelowFold'))

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
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-bg transition-transform focus:translate-y-0"
      >
        {ui.skip}
      </a>
      <AnimatePresence>
        {showPreloader && <Preloader onDone={donePreloader} />}
      </AnimatePresence>
      <Navbar menuOpen={menuOpen} onOpenMenu={openMenu} />
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={!showPreloader} />
        <Suspense fallback={<div aria-hidden="true" className="min-h-svh" />}>
          <BelowFold />
        </Suspense>
      </main>
      <Footer />
    </LenisContext.Provider>
  )
}
