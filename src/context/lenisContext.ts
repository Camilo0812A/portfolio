import { createContext, useContext } from 'react'

export interface LenisApi {
  /** Desplaza suavemente a un selector (p. ej. "#projects"). */
  scrollTo: (target: string) => void
  /** Bloquea el scroll (se puede llamar varias veces; cada stop() necesita su start()). */
  stop: () => void
  start: () => void
}

const fallback: LenisApi = {
  scrollTo: (target) => document.querySelector(target)?.scrollIntoView(),
  stop: () => undefined,
  start: () => undefined,
}

export const LenisContext = createContext<LenisApi>(fallback)

export function useLenisApi(): LenisApi {
  return useContext(LenisContext)
}
