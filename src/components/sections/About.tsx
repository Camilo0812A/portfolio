import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ParticlePortrait } from '@/components/effects/ParticlePortrait'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'
import { cn } from '@/lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.1 },
  }),
}

interface CardProps {
  index: number
  className?: string
  children: ReactNode
}

function Card({ index, className, children }: CardProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        'glow-corner relative overflow-hidden rounded-card border border-border bg-surface transition-colors duration-300 hover:border-gold/40',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export function About() {
  const { profile, socials, ui } = portfolioData
  const { about } = ui

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="px-4 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="about-title" eyebrow={about.eyebrow} title={about.title} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* A: retrato de partículas */}
          <Card index={0} className="aspect-square md:col-span-2 lg:aspect-auto lg:row-span-2 lg:min-h-[560px]">
            <ParticlePortrait />
            <p className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              {about.portraitCaption}
            </p>
          </Card>

          {/* B: bio */}
          <Card index={1} className="p-7 md:col-span-2 md:p-9">
            <p className="text-base leading-relaxed text-text md:text-lg md:leading-[1.7]">
              {profile.bio}
            </p>
          </Card>

          {/* C: disponibilidad */}
          <Card index={2} className="flex flex-col justify-between gap-6 p-7">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="relative mt-1.5 flex size-2.5 shrink-0">
                <span
                  className={cn(
                    'absolute inline-flex size-full rounded-full opacity-70',
                    profile.available ? 'animate-ping bg-emerald-400' : 'bg-faint',
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex size-2.5 rounded-full',
                    profile.available ? 'bg-emerald-400' : 'bg-faint',
                  )}
                />
              </span>
              <p className="font-display text-lg font-bold leading-snug text-text">
                {profile.available ? about.availableText : about.unavailableText}
              </p>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Icon name="MapPin" size={16} className="text-gold" aria-hidden="true" />
              <span className="sr-only">{about.locationLabel}: </span>
              {profile.location}
            </p>
          </Card>

          {/* D: redes */}
          <Card index={3} className="p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-faint">
              {ui.socialsTitle}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {socials.map((s) => {
                const external = s.url.startsWith('http')
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group/link flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm text-text transition-colors duration-200 hover:border-gold hover:text-gold"
                    >
                      <Icon name={s.icon} size={16} />
                      <span className="flex-1">{s.label}</span>
                      <Icon
                        name="ArrowUpRight"
                        size={16}
                        className="text-muted transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-gold"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
