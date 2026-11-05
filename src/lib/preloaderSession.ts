const KEY = 'portfolio:preloader-seen'

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** El preloader solo se muestra la primera vez por sesión. Si sessionStorage falla, se muestra. */
export function shouldShowPreloader(): boolean {
  if (prefersReducedMotion()) return false
  try {
    return window.sessionStorage.getItem(KEY) !== '1'
  } catch {
    return true
  }
}

export function markPreloaderSeen(): void {
  try {
    window.sessionStorage.setItem(KEY, '1')
  } catch {
    // sessionStorage no disponible: no pasa nada
  }
}
