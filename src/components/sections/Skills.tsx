import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'
import type { Skill, SoftSkill } from '@/types/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const
// Sangría en cascada de las cards (solo desktop).
const CASCADE = ['md:ml-0', 'md:ml-12', 'md:ml-24'] as const

interface Branch {
  d: string
  x1: number
  y1: number
  x2: number
  y2: number
}

interface TreeGeometry {
  w: number
  h: number
  branches: Branch[]
}

/** Posición de un elemento respecto al contenedor, sin verse afectada por transforms. */
function box(el: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== container) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function measure(
  container: HTMLElement,
  root: HTMLElement,
  cards: (HTMLElement | null)[],
): TreeGeometry {
  const desktop = window.matchMedia('(min-width: 768px)').matches
  const r = box(root, container)
  const branches: Branch[] = []

  for (const card of cards) {
    if (!card) continue
    const c = box(card, container)
    const ey = c.y + c.h / 2
    if (desktop) {
      const x1 = r.x + r.w
      const y1 = r.y + r.h / 2
      const x2 = c.x
      const dx = (x2 - x1) * 0.55
      branches.push({
        d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${ey}, ${x2} ${ey}`,
        x1,
        y1,
        x2,
        y2: ey,
      })
    } else {
      const x1 = r.x + 24
      const y1 = r.y + r.h
      const x2 = c.x
      const k = Math.min(14, Math.max(0, x2 - x1))
      branches.push({
        d: `M ${x1} ${y1} L ${x1} ${ey - k} Q ${x1} ${ey} ${x1 + k} ${ey} L ${x2} ${ey}`,
        x1,
        y1,
        x2,
        y2: ey,
      })
    }
  }
  return { w: container.offsetWidth, h: container.offsetHeight, branches }
}

function SkillTree() {
  const { toolGroups, ui } = portfolioData
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLLIElement | null)[]>([])
  const inView = useInView(containerRef, { once: true, amount: 0.25 })
  const [geo, setGeo] = useState<TreeGeometry | null>(null)

  const update = useCallback(() => {
    const container = containerRef.current
    const root = rootRef.current
    if (!container || !root) return
    const next = measure(container, root, cardRefs.current)
    setGeo((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
  }, [])

  useLayoutEffect(() => {
    update()
  }, [update])

  useEffect(() => {
    const container = containerRef.current
    const root = rootRef.current
    if (!container || !root) return
    const ro = new ResizeObserver(update)
    ro.observe(container)
    ro.observe(root)
    for (const card of cardRefs.current) if (card) ro.observe(card)
    return () => ro.disconnect()
  }, [update])

  const gradientId = useId()

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ui.skills.treeLabel}
      className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-0"
    >
      {geo && (
        <svg
          aria-hidden="true"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
        >
          <defs>
            {geo.branches.map((b, i) => (
              <linearGradient
                key={i}
                id={`${gradientId}-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
              >
                <stop offset="0" stopColor="#ede6d8" stopOpacity="0.14" />
                <stop offset="1" stopColor="#c8a24a" stopOpacity="0.85" />
              </linearGradient>
            ))}
          </defs>
          {geo.branches.map((b, i) => (
            <g key={i}>
              <motion.path
                d={b.d}
                fill="none"
                stroke={`url(#${gradientId}-${i})`}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: inView || reduce ? 1 : 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.15 }}
              />
              <motion.circle
                cx={b.x2}
                cy={b.y2}
                r={3.5}
                fill="#c8a24a"
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={{ opacity: inView || reduce ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.15 }}
              />
            </g>
          ))}
        </svg>
      )}

      <div
        ref={rootRef}
        className="relative z-10 self-start rounded-full border border-gold/40 bg-surface px-8 py-3.5 font-mono text-sm uppercase tracking-[0.25em] text-gold shadow-[0_0_40px_-8px_rgb(200_162_74/0.35)]"
      >
        {ui.skills.root}
      </div>

      <ul className="relative z-10 ml-8 flex flex-1 flex-col gap-4 md:ml-24">
        {toolGroups.map((group, i) => (
          <motion.li
            key={group.title}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.12 }}
            className={`glow-corner relative overflow-hidden rounded-card border border-border bg-surface p-6 transition-colors duration-300 hover:border-gold/40 md:max-w-xl ${CASCADE[i % CASCADE.length]}`}
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-gold">
                <Icon name={group.icon} size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-text">{group.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{group.items.join(', ')}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

interface PillProps {
  skill: Skill
  /** Solo el contenido "real" (no el duplicado) recibe foco y tooltip accesible. */
  interactive: boolean
  tipId: string
}

function Pill({ skill, interactive, tipId }: PillProps) {
  const { ui } = portfolioData
  const hasLevel = Boolean(skill.level)
  const tip = hasLevel ? `${ui.skills.levelLabel}: ${skill.level}` : null
  return (
    <li
      tabIndex={interactive && hasLevel ? 0 : undefined}
      aria-describedby={interactive && hasLevel ? tipId : undefined}
      className="group/pill relative mr-3 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface/60 px-5 py-2.5 text-sm text-text transition-colors duration-200 hover:border-gold/50 focus-visible:border-gold/50"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {skill.name}
      {tip && (
        <span
          id={interactive ? tipId : undefined}
          role={interactive ? 'tooltip' : undefined}
          className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md border border-gold/30 bg-bg px-2.5 py-1 font-mono text-[11px] text-gold opacity-0 transition-opacity duration-150 group-hover/pill:opacity-100 group-focus-visible/pill:opacity-100"
        >
          {tip}
        </span>
      )}
    </li>
  )
}

interface MarqueeRowProps {
  skills: Skill[]
  reverse?: boolean
  duration: number
  rowId: string
}

function MarqueeRow({ skills, reverse = false, duration, rowId }: MarqueeRowProps) {
  const { ui } = portfolioData
  return (
    <div className="marquee pt-10">
      <div
        className="marquee-track"
        data-reverse={reverse}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <ul aria-label={ui.skills.marqueeLabel} className="flex shrink-0">
          {skills.map((s, i) => (
            <Pill key={s.name} skill={s} interactive tipId={`${rowId}-${i}`} />
          ))}
        </ul>
        <ul aria-hidden="true" className="marquee-dup flex shrink-0">
          {skills.map((s, i) => (
            <Pill key={s.name} skill={s} interactive={false} tipId={`${rowId}-dup-${i}`} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function SoftSkillCard({ skill, index }: { skill: SoftSkill; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.1 }}
      className="glow-corner group relative overflow-hidden rounded-card border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-gold/40 hover:shadow-[0_0_40px_-16px_rgb(200_162_74/0.45)]"
    >
      <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 motion-reduce:transform-none">
        <Icon name={skill.icon} size={20} aria-hidden="true" />
      </span>
      <h4 className="mt-5 font-display text-lg font-bold leading-snug text-text">{skill.name}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{skill.evidence}</p>
    </motion.li>
  )
}

function SoftSkills() {
  const { softSkills, ui } = portfolioData
  const t = ui.skills.soft
  const reduce = useReducedMotion()
  const titleId = useId()
  return (
    <div className="mt-20 border-t border-border pt-14 md:mt-28 md:pt-20">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-8 md:mb-10"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
          {t.eyebrow}
        </p>
        <h3
          id={titleId}
          className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight tracking-tight text-text"
        >
          {t.title.before}{' '}
          <span className="font-serif font-normal italic text-accent-soft [-webkit-text-fill-color:var(--color-accent-soft)]">
            {t.title.accent}
          </span>
          {t.title.after ? ` ${t.title.after}` : null}
        </h3>
      </motion.header>
      <ul aria-labelledby={titleId} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {softSkills.map((s, i) => (
          <SoftSkillCard key={s.id} skill={s} index={i} />
        ))}
      </ul>
    </div>
  )
}

export function Skills() {
  const { skills, ui } = portfolioData
  const baseId = useId()
  const rowA = skills
  const rowB = [...skills].reverse()

  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SectionHeading id="skills-title" eyebrow={ui.skills.eyebrow} title={ui.skills.title} />
        <SkillTree />
      </div>

      <div className="mt-16 md:mt-24">
        <MarqueeRow skills={rowA} duration={70} rowId={`${baseId}-a`} />
        <MarqueeRow skills={rowB} reverse duration={85} rowId={`${baseId}-b`} />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SoftSkills />
      </div>
    </section>
  )
}
