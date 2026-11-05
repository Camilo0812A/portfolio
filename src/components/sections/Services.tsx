import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'
import { cn } from '@/lib/cn'
import type { Service } from '@/types/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const

interface RowProps {
  service: Service
  open: boolean
  onToggle: () => void
}

function ServiceRow({ service, open, onToggle }: RowProps) {
  const reduce = useReducedMotion()
  const uid = useId()
  const buttonId = `${uid}-btn`
  const panelId = `${uid}-panel`

  return (
    <li className="group/row relative overflow-hidden border-t border-border last:border-b">
      {/* Franja carmesí que barre la fila al pasar el cursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-accent/10 transition-transform duration-500 ease-out group-hover/row:scale-x-100 group-has-[:focus-visible]/row:scale-x-100"
      />
      <h3 className="relative">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-5 py-6 text-left outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold md:gap-10 md:py-8"
        >
          <span className="w-8 shrink-0 font-mono text-sm tracking-[0.2em] text-gold md:w-12 md:text-base">
            {service.number}
          </span>
          <span className="flex-1 font-display text-[clamp(1.25rem,2.5vw,2rem)] font-bold uppercase leading-tight transition-transform duration-300 ease-out group-hover/row:translate-x-2">
            {service.title}
          </span>
          <Icon
            name="ArrowDownRight"
            size={28}
            aria-hidden="true"
            className={cn(
              'shrink-0 text-muted transition-transform duration-300 group-hover/row:text-gold',
              open && '-rotate-90 text-gold',
            )}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
            className="relative overflow-hidden"
          >
            <p className="max-w-2xl pb-7 pl-[3.25rem] pr-6 text-base leading-relaxed text-muted md:pb-9 md:pl-[5.5rem] md:text-lg">
              {service.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export function Services() {
  const { services, ui } = portfolioData
  const { services: t } = ui
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null)

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="px-4 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="services-title"
          eyebrow={t.eyebrow}
          title={t.title}
          align="right"
          titleClassName="text-gradient-metal"
        />
        <ul aria-label={t.listLabel}>
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              open={openId === service.id}
              onToggle={() => setOpenId((cur) => (cur === service.id ? null : service.id))}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
