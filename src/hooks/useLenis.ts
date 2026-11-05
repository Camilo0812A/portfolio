import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Inicializa Lenis (smooth scroll) y lo sincroniza con requestAnimationFrame.
 * Se desactiva si el usuario prefiere movimiento reducido.
 */
export function useLenis(): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let frame = 0

    const raf = (time: number): void => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}
