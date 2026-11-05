import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { portfolioData } from '@/data/portfolioData'
import { useLenisApi } from '@/context/lenisContext'

interface HeroProps {
  /** true cuando el preloader ya terminó: dispara la animación de entrada. */
  ready: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

const letter: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.06 },
  }),
}

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
}

// Las cajas del brillo replican exactamente el recuadro que ocupa la imagen con
// object-cover, así la llama coincide en cualquier tamaño de pantalla.
const glowBase =
  'pointer-events-none absolute top-1/2 -translate-y-1/2'

export function Hero({ ready }: HeroProps) {
  const { profile, art, ui } = portfolioData
  const lenis = useLenisApi()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const initial = reduce ? false : 'hidden'
  const state = ready ? 'show' : 'hidden'
  const letters = [...profile.heroWord]

  const goTo = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    lenis.scrollTo(href)
  }

  const flame = (
    <motion.span
      aria-hidden="true"
      className="absolute block aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgb(255 190 90 / 0.28) 0%, rgb(200 162 74 / 0.12) 35%, transparent 68%)',
        mixBlendMode: 'screen',
      }}
      animate={
        reduce
          ? undefined
          : { opacity: [0.55, 0.95, 0.6, 1, 0.5, 0.85], scale: [1, 1.1, 0.95, 1.14, 0.98, 1.06] }
      }
      transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', times: [0, 0.18, 0.4, 0.55, 0.8, 1] }}
    />
  )

  return (
    <section
      id="home"
      ref={ref}
      className="grain relative h-svh min-h-[560px] w-full overflow-hidden bg-bg"
    >
      {/* Arte de fondo con parallax de escala */}
      <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : imageScale }}>
        <picture>
          <source media="(max-width: 767px)" srcSet={art.heroMobile} />
          <img
            src={art.hero}
            alt={ui.heroAlt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover md:object-[right_center]"
          />
        </picture>

        {/* Brillo de vela: móvil (imagen centrada) */}
        <div
          className={`${glowBase} left-1/2 -translate-x-1/2 md:hidden`}
          style={{ width: 'max(100%, calc(100svh * 0.9777))', aspectRatio: '920 / 941' }}
        >
          <div className="absolute" style={{ left: '41.8%', top: '22.8%' }}>
            {flame}
          </div>
        </div>
        {/* Brillo de vela: desktop (imagen alineada a la derecha) */}
        <div
          className={`${glowBase} right-0 hidden md:block`}
          style={{ width: 'max(100%, calc(100svh * 1.7769))', aspectRatio: '1672 / 941' }}
        >
          <div className="absolute" style={{ left: '67.6%', top: '23.5%' }}>
            {flame}
          </div>
        </div>
      </motion.div>

      {/* Degradados para legibilidad del texto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_0%,rgb(11_9_7/0.82)_38%,transparent_78%)] md:bg-[linear-gradient(to_right,var(--color-bg)_0%,rgb(11_9_7/0.8)_28%,transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent"
      />

      {/* Contenido */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-4 pb-24 pt-28 md:justify-center md:px-10 md:pb-16"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted md:text-xs"
          variants={rise}
          custom={0.1}
          initial={initial}
          animate={state}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {ui.heroEyebrow}
        </motion.p>

        <h1 className="mt-4 font-display text-[clamp(4.5rem,17vw,15rem)] font-black leading-[0.85] tracking-tight">
          <span className="sr-only">{profile.fullName}</span>
          <span aria-hidden="true" className="flex">
            {letters.map((char, i) => (
              <span key={`${char}-${i}`} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="text-gradient-metal inline-block"
                  variants={letter}
                  custom={i}
                  initial={initial}
                  animate={state}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="mt-5 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight"
          variants={rise}
          custom={0.55}
          initial={initial}
          animate={state}
        >
          {profile.role}{' '}
          <span className="font-serif font-normal italic text-accent-soft">{profile.roleAccent}</span>
        </motion.p>

        <motion.p
          className="mt-3 max-w-md text-muted"
          variants={rise}
          custom={0.7}
          initial={initial}
          animate={state}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          variants={rise}
          custom={0.85}
          initial={initial}
          animate={state}
        >
          <a
            href="#projects"
            onClick={goTo('#projects')}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-text transition-colors hover:bg-[#8f1b21]"
          >
            {ui.ctaProjects}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href="#contact"
            onClick={goTo('#contact')}
            className="inline-flex items-center rounded-full border border-border bg-bg/40 px-6 py-3 text-sm font-medium text-text backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
          >
            {ui.ctaContact}
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">{ui.scroll}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-gold"
            animate={reduce ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}
