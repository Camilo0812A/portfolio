import { useCallback, useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import type { LenisApi } from '@/context/lenisContext'

/**
 * Inicializa Lenis (smooth scroll) sincronizado con requestAnimationFrame y expone
 * una API pequeña (scrollTo / stop / start). El bloqueo usa un contador para que
 * el preloader y el menú puedan convivir. Con prefers-reduced-motion no se crea
 * Lenis y se usa el scroll nativo.
 */
export function useLenis(): LenisApi {
  const lenisRef = useRef<Lenis | null>(null)
  const locks = useRef(0)
  const frameRef = useRef(0)

  const apply = useCallback((): void => {
    const locked = locks.current > 0
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    const lenis = lenisRef.current
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis
    apply()

    const raf = (time: number): void => {
      lenis.raf(time)
      frameRef.current = requestAnimationFrame(raf)
    }
    frameRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameRef.current)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [apply])

  return useMemo<LenisApi>(
    () => ({
      scrollTo: (target) => {
        const lenis = lenisRef.current
        if (lenis) lenis.scrollTo(target, { force: true, duration: 1.2 })
        else document.querySelector(target)?.scrollIntoView()
      },
      stop: () => {
        locks.current += 1
        apply()
      },
      start: () => {
        locks.current = Math.max(0, locks.current - 1)
        apply()
      },
    }),
    [apply],
  )
}
