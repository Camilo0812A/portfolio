import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { portfolioData } from '@/data/portfolioData'
import { cn } from '@/lib/cn'

// Paleta óleo: mayoría blanco hueso, con toques carmesí y dorado (~10 %).
const COLORS = ['#ede6d8', '#c4343b', '#c8a24a'] as const
const ACCENT_CHANCE = 0.1

const BRIGHTNESS_THRESHOLD = 0.08
const MAX_DPR = 2
const TARGET_DESKTOP = 5000
const TARGET_MOBILE = 2200

// Física: muelle simple hacia el punto de origen + repulsión del puntero.
const SPRING = 0.055
const DAMPING = 0.86
const REPEL_STRENGTH = 2.6
const ENTRY_SPREAD_MS = 900
const ENTRY_FADE_MS = 450
const REST_EPSILON = 0.03

interface Field {
  count: number
  homeX: Float32Array
  homeY: Float32Array
  x: Float32Array
  y: Float32Array
  vx: Float32Array
  vy: Float32Array
  size: Float32Array
  alpha: Float32Array
  delay: Float32Array
  color: Uint8Array
}

/** Dibuja la imagen "cover" (anclada arriba para conservar el rostro) en un canvas offscreen. */
function readPixels(img: HTMLImageElement, w: number, h: number): Uint8ClampedArray | null {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, (w - dw) / 2, (h - dh) * 0.2, dw, dh)
  return ctx.getImageData(0, 0, w, h).data
}

interface Sample {
  x: number
  y: number
  tone: number
}

/**
 * Muestrea la imagen cada `step` px. Cada celda entra con probabilidad proporcional
 * a su brillo (estarcido), así las sombras quedan ralas y los rasgos del rostro se leen.
 */
function sampleTones(data: Uint8ClampedArray, w: number, h: number, step: number, norm: number) {
  const out: Sample[] = []
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const b = Math.min(1, (data[(y * w + x) * 4] / 255) * norm)
      if (b <= BRIGHTNESS_THRESHOLD) continue
      const tone = Math.pow((b - BRIGHTNESS_THRESHOLD) / (1 - BRIGHTNESS_THRESHOLD), 1.15)
      if (tone < Math.random() * 0.85) continue
      out.push({ x, y, tone })
    }
  }
  return out
}

function buildField(img: HTMLImageElement, w: number, h: number, target: number): Field | null {
  const W = Math.max(1, Math.round(w))
  const H = Math.max(1, Math.round(h))
  const data = readPixels(img, W, H)
  if (!data) return null

  // Normaliza el brillo por el percentil 98 para aprovechar todo el rango tonal.
  const histogram = new Uint32Array(256)
  let total = 0
  for (let i = 0; i < data.length; i += 16) {
    histogram[data[i]]++
    total++
  }
  let acc = 0
  let peak = 255
  for (let v = 255; v >= 0; v--) {
    acc += histogram[v]
    if (acc >= total * 0.02) {
      peak = Math.max(v, 64)
      break
    }
  }
  const norm = 255 / peak

  // Densidad adaptativa: sube el paso de muestreo hasta quedar bajo el objetivo.
  let step = 2
  let samples = sampleTones(data, W, H, step, norm)
  while (samples.length > target) {
    step++
    samples = sampleTones(data, W, H, step, norm)
  }

  const count = samples.length
  const field: Field = {
    count,
    homeX: new Float32Array(count),
    homeY: new Float32Array(count),
    x: new Float32Array(count),
    y: new Float32Array(count),
    vx: new Float32Array(count),
    vy: new Float32Array(count),
    size: new Float32Array(count),
    alpha: new Float32Array(count),
    delay: new Float32Array(count),
    color: new Uint8Array(count),
  }

  for (let i = 0; i < count; i++) {
    const { x, y, tone } = samples[i]
    // Pequeña dispersión dentro de la celda para un aspecto orgánico.
    field.homeX[i] = x + Math.random() * step
    field.homeY[i] = y + Math.random() * step
    field.x[i] = Math.random() * W
    field.y[i] = Math.random() * H
    field.size[i] = 0.6 + tone * 1.9
    field.alpha[i] = 0.35 + tone * 0.65
    field.delay[i] = Math.random() * ENTRY_SPREAD_MS
    field.color[i] = Math.random() < ACCENT_CHANCE ? 1 + Math.floor(Math.random() * 2) : 0
  }
  return field
}

function draw(
  ctx: CanvasRenderingContext2D,
  field: Field,
  w: number,
  h: number,
  elapsed: number,
): void {
  ctx.clearRect(0, 0, w, h)
  for (let c = 0; c < COLORS.length; c++) {
    ctx.fillStyle = COLORS[c]
    for (let i = 0; i < field.count; i++) {
      if (field.color[i] !== c) continue
      const appear = Math.min(1, Math.max(0, (elapsed - field.delay[i]) / ENTRY_FADE_MS))
      if (appear === 0) continue
      ctx.globalAlpha = field.alpha[i] * appear
      const s = field.size[i]
      ctx.fillRect(field.x[i] - s / 2, field.y[i] - s / 2, s, s)
    }
  }
  ctx.globalAlpha = 1
}

interface ParticlePortraitProps {
  className?: string
}

export function ParticlePortrait({ className }: ParticlePortraitProps) {
  const { profile, ui } = portfolioData
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    const target = isMobile ? TARGET_MOBILE : TARGET_DESKTOP
    const animated = !reduce

    const life = {
      cancelled: false,
      resizeTimer: 0,
      img: null as HTMLImageElement | null,
      field: null as Field | null,
      w: 0,
      h: 0,
      raf: 0,
      last: 0,
      startedAt: 0,
      formed: false,
      inView: false,
      pointerX: -1e4,
      pointerY: -1e4,
      pointerActive: false,
    }

    const isActive = () => life.inView && !document.hidden

    const stop = () => {
      if (life.raf) cancelAnimationFrame(life.raf)
      life.raf = 0
    }

    const tick = (now: number) => {
      life.raf = 0
      const field = life.field
      if (!field || !life.formed || !isActive()) return
      const dt = Math.min((now - life.last) / 16.667, 2.5)
      life.last = now
      const elapsed = now - life.startedAt
      const radius = Math.min(130, Math.max(70, Math.min(life.w, life.h) * 0.2))
      const r2 = radius * radius
      const damp = Math.pow(DAMPING, dt)
      let moving = elapsed < ENTRY_SPREAD_MS + ENTRY_FADE_MS

      for (let i = 0; i < field.count; i++) {
        if (elapsed < field.delay[i]) continue
        let vx = field.vx[i]
        let vy = field.vy[i]
        let x = field.x[i]
        let y = field.y[i]
        const ex = field.homeX[i] - x
        const ey = field.homeY[i] - y
        vx += ex * SPRING * dt
        vy += ey * SPRING * dt

        if (life.pointerActive) {
          const dx = x - life.pointerX
          const dy = y - life.pointerY
          const d2 = dx * dx + dy * dy
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const k = 1 - d / radius
            const push = k * k * REPEL_STRENGTH * dt
            vx += (dx / d) * push * 6
            vy += (dy / d) * push * 6
          }
        }

        vx *= damp
        vy *= damp
        x += vx * dt
        y += vy * dt
        field.vx[i] = vx
        field.vy[i] = vy
        field.x[i] = x
        field.y[i] = y
        if (
          Math.abs(ex) > REST_EPSILON ||
          Math.abs(ey) > REST_EPSILON ||
          Math.abs(vx) > REST_EPSILON ||
          Math.abs(vy) > REST_EPSILON
        ) {
          moving = true
        }
      }

      draw(ctx, field, life.w, life.h, elapsed)
      // Si todo está en reposo y no hay puntero, se detiene el bucle hasta nueva interacción.
      if (moving || life.pointerActive) life.raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (life.raf || !life.field || !life.formed || !isActive()) return
      life.last = performance.now()
      life.raf = requestAnimationFrame(tick)
    }

    const drawStatic = () => {
      if (!life.field) return
      for (let i = 0; i < life.field.count; i++) {
        life.field.x[i] = life.field.homeX[i]
        life.field.y[i] = life.field.homeY[i]
      }
      draw(ctx, life.field, life.w, life.h, Number.POSITIVE_INFINITY)
    }

    const rebuild = () => {
      if (!life.img) return
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return
      life.w = rect.width
      life.h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(life.w * dpr)
      canvas.height = Math.round(life.h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      life.field = buildField(life.img, life.w, life.h, target)
      if (!life.field) return
      if (!animated) {
        drawStatic()
        return
      }
      if (life.formed) {
        // Tras un resize las partículas nacen ya formadas, sin repetir la entrada.
        for (let i = 0; i < life.field.count; i++) {
          life.field.x[i] = life.field.homeX[i]
          life.field.y[i] = life.field.homeY[i]
          life.field.delay[i] = 0
        }
        life.startedAt = -ENTRY_SPREAD_MS - ENTRY_FADE_MS
        draw(ctx, life.field, life.w, life.h, Number.POSITIVE_INFINITY)
        wake()
      }
    }

    const ro = new ResizeObserver(() => {
      window.clearTimeout(life.resizeTimer)
      life.resizeTimer = window.setTimeout(rebuild, 120)
    })

    let io: IntersectionObserver | null = null
    const onVisibility = () => (isActive() ? wake() : stop())

    const toLocal = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      life.pointerX = e.clientX - rect.left
      life.pointerY = e.clientY - rect.top
    }
    const onPointerMove = (e: PointerEvent) => {
      toLocal(e)
      life.pointerActive = true
      wake()
    }
    const onPointerLeave = () => {
      life.pointerActive = false
      life.pointerX = life.pointerY = -1e4
      wake()
    }

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (life.cancelled) return
      life.img = image
      rebuild()
      ro.observe(wrap)
      if (!animated) return

      io = new IntersectionObserver(
        ([entry]) => {
          life.inView = entry.isIntersecting
          if (life.inView && !life.formed) {
            life.formed = true
            life.startedAt = performance.now()
          }
          if (life.inView) wake()
          else stop()
        },
        { threshold: 0.25 },
      )
      io.observe(wrap)
      document.addEventListener('visibilitychange', onVisibility)
      wrap.addEventListener('pointermove', onPointerMove)
      wrap.addEventListener('pointerdown', onPointerMove)
      wrap.addEventListener('pointerleave', onPointerLeave)
      wrap.addEventListener('pointercancel', onPointerLeave)
      wrap.addEventListener('pointerup', onPointerLeave)
    }
    image.onerror = () => {
      if (!life.cancelled) setFailed(true)
    }
    image.src = profile.portraitParticles

    return () => {
      life.cancelled = true
      stop()
      window.clearTimeout(life.resizeTimer)
      ro.disconnect()
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      wrap.removeEventListener('pointermove', onPointerMove)
      wrap.removeEventListener('pointerdown', onPointerMove)
      wrap.removeEventListener('pointerleave', onPointerLeave)
      wrap.removeEventListener('pointercancel', onPointerLeave)
      wrap.removeEventListener('pointerup', onPointerLeave)
      image.onload = null
      image.onerror = null
    }
  }, [reduce, profile.portraitParticles])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ui.about.portraitAria}
      className={cn('relative h-full w-full touch-pan-y', className)}
    >
      {failed ? (
        <img
          src={profile.portrait}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      )}
    </div>
  )
}
