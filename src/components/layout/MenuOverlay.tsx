import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { X } from 'lucide-react'
import { portfolioData } from '@/data/portfolioData'
import { useLenisApi } from '@/context/lenisContext'

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const FOCUSABLE = 'a[href], button:not([disabled])'

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const { nav, socials, ui } = portfolioData
  const lenis = useLenisApi()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Scroll detenido, foco inicial y retorno de foco al botón que abrió el menú.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    lenis.stop()
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      lenis.start()
      opener?.focus()
    }
  }, [open, lenis, onClose])

  const go = (href: string): void => {
    onClose()
    // Espera a que se libere el bloqueo de scroll (efecto de cierre) antes de desplazar.
    window.setTimeout(() => lenis.scrollTo(href), 60)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-bg/70 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={ui.menuLabel}
            className="grain relative flex h-full w-full flex-col justify-between bg-bg-soft px-6 pb-8 pt-6 md:w-[40%] md:min-w-[480px] md:px-12 md:pb-12 md:pt-8"
            variants={{ hidden: { x: '100%' }, show: { x: 0 } }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={ui.menuClose}
                className="flex size-10 items-center justify-center rounded-full border border-border text-text transition duration-200 hover:scale-110 hover:border-gold hover:text-gold"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <motion.nav aria-label={ui.menuLabel} variants={list}>
              <ul className="flex flex-col gap-2 md:gap-3">
                {nav.map((n, i) => (
                  <motion.li key={n.href} variants={item}>
                    <motion.a
                      href={n.href}
                      onClick={(e) => {
                        e.preventDefault()
                        go(n.href)
                      }}
                      whileHover={{ x: 8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="inline-flex items-start gap-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold uppercase leading-none text-text transition-colors hover:text-accent-soft"
                    >
                      <sup className="mt-1 font-mono text-xs font-normal tracking-widest text-gold">
                        {String(i + 1).padStart(2, '0')}
                      </sup>
                      {n.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div variants={item}>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-faint">
                {ui.socialsTitle}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((s) => {
                  const external = s.url.startsWith('http')
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="text-sm text-muted underline-offset-4 transition-colors hover:text-gold hover:underline"
                      >
                        {s.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
