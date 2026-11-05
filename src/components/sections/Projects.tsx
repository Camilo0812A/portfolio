import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const
const STICKY_TOP = '12svh'
const STACK_SCALE = 0.94
const STACK_DIM = 0.45

/** Dominio visible en la barra de URL del mockup. */
function displayUrl(project: Project, githubUser: string): string {
  if (!project.liveUrl) return `github.com/${githubUser}/…`
  try {
    const { host, pathname } = new URL(project.liveUrl)
    return `${host}${pathname === '/' ? '' : pathname.replace(/\/$/, '')}`
  } catch {
    return project.liveUrl
  }
}

function initialsOf(title: string): string {
  return title
    .split(/[\s\-·]+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/* ───────────────────────── Mockup de navegador ───────────────────────── */

function BrowserMockup({ project }: { project: Project }) {
  const { profile, ui } = portfolioData
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(project.image) && !broken

  return (
    <div className="group/mock transition-transform duration-500 ease-out hover:-translate-y-1.5">
      <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-3.5 py-2.5">
          <span aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="size-2.5 rounded-full bg-accent/70" />
            <span className="size-2.5 rounded-full bg-gold/60" />
            <span className="size-2.5 rounded-full bg-text/25" />
          </span>
          <span
            aria-hidden="true"
            className="min-w-0 flex-1 truncate rounded-md bg-bg/70 px-3 py-1 text-center font-mono text-[10px] tracking-wide text-muted md:text-[11px]"
          >
            {displayUrl(project, profile.githubUser)}
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden md:aspect-[1.9/1]">
          {showImage ? (
            <img
              src={project.image}
              alt={`${ui.projects.shotAlt} ${project.title}`}
              loading="lazy"
              decoding="async"
              width={1440}
              height={900}
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover object-top transition-[object-position] duration-[4000ms] ease-in-out group-hover/mock:object-bottom"
            />
          ) : (
            <div className="grain absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-soft">
              <span
                aria-hidden="true"
                className="text-gradient-metal font-display text-[clamp(4rem,12vw,8rem)] font-extrabold leading-none"
              >
                {initialsOf(project.title)}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-faint">
                {project.tech[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Card destacada ───────────────────────── */

interface FeaturedCardProps {
  project: Project
  index: number
  total: number
  /** Progreso (0-1) con que la card siguiente llega a su posición; la última no tiene. */
  nextProgress: MotionValue<number> | null
  /** Publica el progreso de entrada de esta card para la anterior. */
  progressOut: MotionValue<number>
  stackable: boolean
}

function FeaturedCard({
  project,
  index,
  total,
  nextProgress,
  progressOut,
  stackable,
}: FeaturedCardProps) {
  const { ui } = portfolioData
  const { projects: t } = ui
  const reduce = useReducedMotion()
  const panelId = useId()
  const rootRef = useRef<HTMLLIElement>(null)
  const [expanded, setExpanded] = useState(false)
  // Sticky se apaga al abrir y vuelve cuando termina de cerrarse el panel.
  const [sticky, setSticky] = useState(true)
  const topBefore = useRef<number | null>(null)

  const hasDetails = Boolean(
    project.problem || project.solution || project.highlights?.length || project.role,
  )

  // Progreso de entrada de esta card: de entrar por abajo a quedar anclada.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'start 0.12'],
  })
  useMotionValueEvent(scrollYProgress, 'change', (v) => progressOut.set(v))

  const idle = useMotionValue(0)
  const source = nextProgress ?? idle
  const scale = useTransform(source, [0, 1], [1, stackable ? STACK_SCALE : 1])
  const dim = useTransform(source, [0, 1], [0, stackable ? STACK_DIM : 0])

  // Al cambiar sticky ↔ static la card cambia de posición: se compensa el scroll
  // para que no "salte" bajo el cursor del usuario.
  useLayoutEffect(() => {
    const before = topBefore.current
    const el = rootRef.current
    if (before === null || !el) return
    topBefore.current = null
    const delta = el.getBoundingClientRect().top - before
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' })
  }, [sticky])

  const toggle = () => {
    if (!expanded) {
      topBefore.current = rootRef.current?.getBoundingClientRect().top ?? null
      setSticky(false)
    }
    setExpanded((v) => !v)
  }

  const handleExitComplete = () => {
    topBefore.current = rootRef.current?.getBoundingClientRect().top ?? null
    setSticky(true)
  }

  const isSticky = stackable && sticky

  return (
    <motion.li
      ref={rootRef}
      style={{
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? STICKY_TOP : undefined,
        scale: stackable ? scale : 1,
        transformOrigin: 'center top',
        zIndex: index + 1,
      }}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="glow-corner overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="grid grid-cols-1 gap-8 p-5 md:min-h-[70svh] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-12 md:p-10 lg:p-12">
        {/* Mockup: arriba en móvil, a la derecha en desktop */}
        <div className="md:order-2">
          <BrowserMockup project={project} />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-5 md:order-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-text px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-bg transition-colors duration-200 hover:bg-gold"
              >
                {t.viewSite}
                <span className="sr-only">
                  {' '}
                  — {project.title} ({t.newTab})
                </span>
                <Icon name="ArrowUpRight" size={14} aria-hidden="true" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.codeAria} ${project.title} (${t.newTab})`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-text transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                <Icon name="Github" size={16} />
              </a>
            )}
            {project.isPrivate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <Icon name="Lock" size={12} aria-hidden="true" />
                {t.private}
              </span>
            )}
            <span className="ml-auto font-mono text-sm tracking-[0.2em] text-gold">
              <span aria-hidden="true">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span className="sr-only">
                {index + 1} / {total}
              </span>
            </span>
          </div>

          <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-text">
            {project.title}
          </h3>

          <p className="text-base leading-relaxed text-muted md:text-[17px]">
            {project.tagline ?? project.description}
          </p>

          <ul className="flex flex-wrap gap-2" aria-label={project.title}>
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted md:text-[11px]"
              >
                {tech}
              </li>
            ))}
          </ul>

          {hasDetails && (
            <div>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={toggle}
                className="group/btn inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                {expanded ? t.hideDetails : t.showDetails}
                <Icon
                  name="ArrowDownRight"
                  size={14}
                  aria-hidden="true"
                  className={cn('transition-transform duration-300', expanded && '-rotate-90')}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Panel de detalles */}
      {hasDetails && (
        <AnimatePresence initial={false} onExitComplete={handleExitComplete}>
          {expanded && (
            <motion.div
              id={panelId}
              role="region"
              aria-label={`${t.showDetails}: ${project.title}`}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="grid gap-8 border-t border-border p-5 md:grid-cols-2 md:gap-12 md:p-10 lg:p-12">
                <div className="flex flex-col gap-8">
                  {project.problem && <DetailBlock title={t.problem} text={project.problem} />}
                  {project.solution && <DetailBlock title={t.solution} text={project.solution} />}
                  {project.role && <DetailBlock title={t.role} text={project.role} />}
                </div>
                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
                      {t.technical}
                    </h4>
                    <ul className="mt-4 flex flex-col gap-3">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Oscurecimiento al quedar tapada por la siguiente card */}
      {stackable && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 z-10 rounded-card bg-bg"
        />
      )}
    </motion.li>
  )
}

function DetailBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">{title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-text md:text-base">{text}</p>
    </div>
  )
}

/** Miniatura de navegador para las cards compactas. */
function MiniMockup({ project }: { project: Project }) {
  const { profile, ui } = portfolioData
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(project.image) && !broken

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-soft">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-2.5 py-1.5">
        <span aria-hidden="true" className="flex shrink-0 gap-1">
          <span className="size-1.5 rounded-full bg-accent/70" />
          <span className="size-1.5 rounded-full bg-gold/60" />
          <span className="size-1.5 rounded-full bg-text/25" />
        </span>
        <span
          aria-hidden="true"
          className="min-w-0 flex-1 truncate rounded bg-bg/70 px-2 py-0.5 text-center font-mono text-[9px] tracking-wide text-muted"
        >
          {displayUrl(project, profile.githubUser)}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {showImage ? (
          <img
            src={project.image}
            alt={`${ui.projects.shotAlt} ${project.title}`}
            loading="lazy"
            decoding="async"
            width={1440}
            height={900}
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-[1.03]"
          />
        ) : (
          <div className="grain absolute inset-0 flex items-center justify-center bg-bg-soft">
            <span
              aria-hidden="true"
              className="text-gradient-metal font-display text-5xl font-extrabold leading-none"
            >
              {initialsOf(project.title)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────────────────── Card compacta ───────────────────────── */

function CompactCard({ project }: { project: Project }) {
  const { projects: t } = portfolioData.ui
  const href = project.liveUrl ?? project.repoUrl
  const label = project.liveUrl ? t.viewSite : t.code

  return (
    <li className="group/card glow-corner relative flex flex-col overflow-hidden gap-4 rounded-card border border-border bg-surface p-6 transition-colors duration-300 focus-within:border-gold hover:border-gold md:p-7">
      <MiniMockup project={project} />
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-display text-xl font-bold leading-tight text-text md:text-2xl">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-gold"
            >
              {project.title}
              <span className="sr-only">
                {' '}
                — {label} ({t.newTab})
              </span>
            </a>
          ) : (
            project.title
          )}
        </h4>
        <Icon
          name="ArrowUpRight"
          size={22}
          aria-hidden="true"
          className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1 group-hover/card:text-gold group-focus-within/card:text-gold"
        />
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.description}</p>

      <ul className="flex flex-wrap gap-2" aria-label={project.title}>
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="mt-auto flex items-center gap-3 pt-1 text-faint">
        {project.repoUrl && <Icon name="Github" size={16} />}
        {project.liveUrl && <Icon name="Monitor" size={16} />}
      </div>
    </li>
  )
}

/* ───────────────────────── Sección ───────────────────────── */

export function Projects() {
  const { projects, ui } = portfolioData
  const { projects: t } = ui
  const reduce = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  const stackable = desktop && !reduce

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects])
  const more = useMemo(() => projects.filter((p) => !p.featured), [projects])

  // Cada card publica su progreso de entrada; la anterior lo usa para escalarse.
  const progresses = useMemo(() => featured.map(() => motionValue(0)), [featured])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="px-4 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="projects-title" eyebrow={t.eyebrow} title={t.title} />

        <ol aria-label={t.listLabel} className="flex flex-col gap-6 md:gap-[10svh]">
          {featured.map((project, i) => (
            <FeaturedCard
              key={project.id}
              project={project}
              index={i}
              total={featured.length}
              nextProgress={progresses[i + 1] ?? null}
              progressOut={progresses[i]}
              stackable={stackable}
            />
          ))}
        </ol>

        {more.length > 0 && (
          <div className="mt-20 md:mt-28">
            <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:mb-8 md:text-xs">
              {t.moreTitle}
            </h3>
            <ul
              aria-label={t.moreLabel}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 md:[&>li:last-child:nth-child(odd)]:col-span-2"
            >
              {more.map((project) => (
                <CompactCard key={project.id} project={project} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
