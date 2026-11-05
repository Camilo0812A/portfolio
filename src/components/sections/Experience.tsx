import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'

const EASE = [0.22, 1, 0.36, 1] as const
// Diámetro del nodo (size-10 = 2.5rem).
const NODE_SIZE = 40

export function Experience() {
  const { experience, ui } = portfolioData
  const { experience: t } = ui
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 55%'],
  })
  // La línea termina en el centro del último nodo, no al final de su texto.
  const [lineHeight, setLineHeight] = useState<number | null>(null)
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const last = list.lastElementChild
      if (last instanceof HTMLElement) setLineHeight(last.offsetTop + NODE_SIZE / 2)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [])

  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="px-4 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="experience-title" eyebrow={t.eyebrow} title={t.title} />

        <ol ref={listRef} aria-label={t.listLabel} className="relative max-w-3xl">
          {/* Línea vertical: pista tenue + trazo dorado ligado al scroll */}
          <span
            aria-hidden="true"
            style={{ height: lineHeight ?? '100%' }}
            className="absolute left-5 top-0 w-px -translate-x-1/2 bg-border"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : line, height: lineHeight ?? '100%' }}
            className="absolute left-5 top-0 w-px origin-top -translate-x-1/2 bg-gold"
          />

          {experience.map((item) => (
            <motion.li
              key={item.id}
              initial={reduce ? false : { opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative pb-12 pl-16 last:pb-0 md:pl-20"
            >
              <span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full border border-gold/50 bg-surface text-gold">
                <Icon name={t.icons[item.id] ?? t.fallbackIcon} size={18} aria-hidden="true" />
              </span>

              <h3 className="font-display text-2xl font-bold leading-tight text-text md:text-3xl">
                {item.role}
              </h3>

              {(item.org || item.period) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.org && (
                    <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text">
                      {item.org}
                    </span>
                  )}
                  {item.period && (
                    <span className="rounded-full border border-gold/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                      {item.period}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{item.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
