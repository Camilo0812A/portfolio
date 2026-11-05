import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { portfolioData } from '@/data/portfolioData'
import { useLenisApi } from '@/context/lenisContext'
import { markPreloaderSeen } from '@/lib/preloaderSession'

interface PreloaderProps {
  onDone: () => void
}

const COUNT_SECONDS = 1
const HOLD_MS = 100

export function Preloader({ onDone }: PreloaderProps) {
  const { initials } = portfolioData.profile
  const lenis = useLenisApi()
  const count = useMotionValue(0)
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(2, '0'))

  useEffect(() => {
    lenis.stop()
    let timer = 0
    const controls = animate(count, 100, {
      duration: COUNT_SECONDS,
      ease: 'easeInOut',
      onComplete: () => {
        timer = window.setTimeout(() => {
          markPreloaderSeen()
          onDone()
        }, HOLD_MS)
      },
    })
    return () => {
      controls.stop()
      window.clearTimeout(timer)
      lenis.start()
    }
  }, [count, lenis, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-bg"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      {/* Spotlight cálido que respira como una vela */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgb(200 162 74 / 0.16) 0%, rgb(180 35 42 / 0.1) 28%, transparent 60%)',
        }}
        animate={{ opacity: [0.6, 1, 0.65, 0.95, 0.6], scale: [1, 1.06, 0.98, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <h1
        className="text-gradient-metal relative px-[0.06em] font-display text-[clamp(8rem,32vw,24rem)] font-black leading-none tracking-tight"
        aria-hidden="true"
      >
        {initials}
      </h1>

      <motion.span
        className="absolute bottom-6 right-4 font-mono text-sm tabular-nums tracking-widest text-gold md:bottom-10 md:right-10"
        aria-hidden="true"
      >
        {label}
      </motion.span>
    </motion.div>
  )
}
