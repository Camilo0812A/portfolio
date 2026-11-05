import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { portfolioData } from '@/data/portfolioData'

const EASE = [0.22, 1, 0.36, 1] as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

type CopyState = 'idle' | 'copied' | 'failed'

const circleBtn =
  'inline-flex size-12 items-center justify-center rounded-full border border-border bg-bg/40 text-text backdrop-blur-sm transition-colors duration-200 hover:border-gold hover:text-gold'

export function Contact() {
  const { profile, art, socials, ui } = portfolioData
  const { contact: t } = ui
  const reduce = useReducedMotion()
  const [copy, setCopy] = useState<CopyState>('idle')
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async (): Promise<void> => {
    let next: CopyState = 'copied'
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      next = 'failed'
    }
    setCopy(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopy('idle'), next === 'copied' ? 2000 : 5000)
  }

  const linkSocials = socials.filter((s) => s.icon === 'Linkedin' || s.icon === 'Github')
  const status = copy === 'copied' ? t.copied : copy === 'failed' ? t.copyFailed : ''

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="grain relative flex min-h-svh items-end overflow-hidden bg-bg md:items-center"
    >
      <img
        src={art.contact}
        alt={t.imageAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_0%,rgb(11_9_7/0.85)_45%,rgb(11_9_7/0.2)_100%)] md:bg-[linear-gradient(to_right,var(--color-bg)_0%,rgb(11_9_7/0.85)_32%,transparent_68%)]"
      />

      <motion.div
        variants={stagger}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 w-full px-4 pb-20 pt-28 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <motion.p
            variants={rise}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs"
          >
            {t.eyebrow}
          </motion.p>

          <motion.h2 variants={rise} id="contact-title" className="mt-4">
            <span className="text-gradient-metal block font-display text-[clamp(3.5rem,11vw,9.5rem)] font-black leading-[0.9] tracking-tight">
              {t.title}
            </span>
            <span className="mt-1 block font-serif text-[clamp(2rem,5vw,4rem)] font-normal italic leading-tight text-accent-soft">
              {t.titleAccent}
            </span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 flex items-center gap-3 text-sm text-muted md:text-base"
          >
            <span
              aria-hidden="true"
              className={
                profile.available
                  ? 'size-2.5 animate-pulse rounded-full bg-emerald-500'
                  : 'size-2.5 rounded-full bg-faint'
              }
            />
            {profile.available ? t.availableText : t.unavailableText}
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-5 break-all font-mono text-[clamp(1.1rem,3.4vw,2rem)] text-text"
          >
            <span className="sr-only">{t.emailLabel}: </span>
            {profile.email}
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCopy}
              aria-label={t.copyAria}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-text transition-colors hover:bg-[#8f1b21]"
            >
              <Icon name={copy === 'copied' ? 'Check' : 'Copy'} size={18} aria-hidden="true" />
              {t.copy}
            </button>
            <a
              href={`mailto:${profile.email}`}
              aria-label={`${t.writeAria} ${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-6 py-3 text-sm font-medium text-text backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <Icon name="Mail" size={18} aria-hidden="true" />
              {t.write}
            </a>
            {linkSocials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} (${t.newTab})`}
                className={circleBtn}
              >
                <Icon name={s.icon} size={20} aria-hidden="true" />
              </a>
            ))}
          </motion.div>

          <p
            role="status"
            aria-live="polite"
            className="mt-4 min-h-6 font-mono text-xs uppercase tracking-[0.18em] text-gold"
          >
            {status}
          </p>
        </div>
      </motion.div>
    </section>
  )
}
