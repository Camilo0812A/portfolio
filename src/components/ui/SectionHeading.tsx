import { motion, useReducedMotion } from 'motion/react'
import type { SectionTitle } from '@/types/portfolio'

interface SectionHeadingProps {
  eyebrow: string
  title: SectionTitle
  id?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  const reduce = useReducedMotion()
  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mb-10 md:mb-14"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-text"
      >
        {title.before}{' '}
        <span className="font-serif font-normal italic text-accent-soft">{title.accent}</span>
        {title.after ? ` ${title.after}` : null}
      </h2>
    </motion.header>
  )
}
