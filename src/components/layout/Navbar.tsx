import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { portfolioData } from '@/data/portfolioData'
import { useLenisApi } from '@/context/lenisContext'

interface NavbarProps {
  menuOpen: boolean
  onOpenMenu: () => void
}

const HIDE_AFTER = 120

export function Navbar({ menuOpen, onOpenMenu }: NavbarProps) {
  const { profile, socials, ui, nav } = portfolioData
  const lenis = useLenisApi()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(latest > prev && latest > HIDE_AFTER)
  })

  const homeHref = nav[0]?.href ?? '#home'

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-4 md:px-10 md:pt-6"
      animate={{ y: hidden && !menuOpen ? '-130%' : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center rounded-full border border-border bg-bg/60 py-1.5 pl-5 pr-1.5 backdrop-blur-md">
        <a
          href={homeHref}
          aria-label={ui.homeAria}
          onClick={(e) => {
            e.preventDefault()
            lenis.scrollTo(homeHref)
          }}
          className="font-display text-sm font-extrabold uppercase tracking-[0.3em] text-text"
        >
          {profile.shortName}
        </a>
        <span aria-hidden="true" className="mx-4 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={ui.menuOpen}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className="flex size-9 items-center justify-center rounded-full text-text transition-colors hover:text-gold"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      <ul className="hidden items-center gap-3 md:flex">
        {socials.map((s) => {
          const external = s.url.startsWith('http')
          return (
            <li key={s.label}>
              <a
                href={s.url}
                aria-label={s.label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-bg/60 text-text backdrop-blur-md transition duration-200 hover:scale-110 hover:border-gold hover:text-gold"
              >
                <Icon name={s.icon} size={18} />
              </a>
            </li>
          )
        })}
      </ul>
    </motion.header>
  )
}
