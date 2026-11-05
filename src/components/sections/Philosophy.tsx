import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { portfolioData } from '@/data/portfolioData'

interface WordProps {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
}

function Word({ word, progress, start, end }: WordProps) {
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{' '}
    </>
  )
}

export function Philosophy() {
  const { profile, art, ui } = portfolioData
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imageScale = useTransform(sectionProgress, [0, 1], [1.1, 1])

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.45'],
  })

  const words = profile.philosophy.split(/\s+/).filter(Boolean)
  const span = 0.75 // fracción del recorrido en la que arranca la última palabra
  const fade = 1 - span

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      aria-label={ui.philosophy.eyebrow}
      className="grain relative flex min-h-[120svh] items-center justify-center overflow-hidden bg-bg px-4 py-28 md:px-10"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduce ? 1 : imageScale }}
      >
        <img
          src={art.philosophy}
          alt={ui.philosophy.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg/60" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent"
      />

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold md:text-xs">
          {ui.philosophy.eyebrow}
        </p>
        <p
          ref={textRef}
          className="mt-8 max-w-4xl font-serif text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.25] text-text"
        >
          {reduce
            ? profile.philosophy
            : words.map((word, i) => {
                const start = (i / words.length) * span
                return (
                  <Word
                    key={`${word}-${i}`}
                    word={word}
                    progress={textProgress}
                    start={start}
                    end={start + fade}
                  />
                )
              })}
        </p>
      </div>
    </section>
  )
}
