import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { portfolioData } from '@/data/portfolioData'
import { cn } from '@/lib/cn'

/* ───────────────────────── Parámetros ───────────────────────── */

const STEP_DESKTOP = 3 // px CSS por celda
const STEP_MOBILE = 4
const MAX_DESKTOP = 30000
const MAX_MOBILE = 10000
const MAX_DPR = 2
const BRIGHTNESS_MIN = 0.04
const GOLD_CHANCE = 0.03
const CRIMSON_CHANCE = 0.01
const ENTRY_MS = 1400
const POINTER_RADIUS = 90 // px CSS
const RESIZE_DEBOUNCE_MS = 150

// Paleta: blanco hueso, dorado y carmesí (RGB 0-1).
const PALETTE = new Float32Array([
  0xed / 255, 0xe6 / 255, 0xd8 / 255,
  0xc8 / 255, 0xa2 / 255, 0x4a / 255,
  0xb4 / 255, 0x23 / 255, 0x2a / 255,
])

/* ───────────────────────── Shaders ───────────────────────── */

const VERTEX = /* glsl */ `#version 300 es
in vec4 a_pos;   // xy: destino, zw: origen disperso (px CSS)
in vec4 a_attr;  // x: brillo, y: fase, z: índice de color, w: retardo de entrada

uniform vec2 u_res;
uniform float u_dpr;
uniform float u_step;
uniform float u_time;
uniform float u_progress;
uniform float u_motion;
uniform vec2 u_pointer;
uniform float u_strength;
uniform float u_radius;
uniform vec3 u_palette[3];

out vec3 v_color;
out float v_alpha;

void main() {
  float local = clamp((u_progress - a_attr.w * 0.4) / 0.6, 0.0, 1.0);
  float ease = 1.0 - pow(1.0 - local, 3.0);
  vec2 pos = mix(a_pos.zw, a_pos.xy, ease);

  // Repulsión del puntero con caída suave; la intensidad llega ya amortiguada desde JS.
  vec2 d = pos - u_pointer;
  float dist = length(d);
  float fall = 1.0 - smoothstep(0.0, u_radius, dist);
  pos += (d / max(dist, 0.001)) * fall * fall * u_strength * u_radius * 0.5;

  // Twinkle: ±10 % de brillo con fase propia.
  float speed = 1.3 + fract(a_attr.y * 13.0) * 1.7;
  float b = min(1.0, a_attr.x * (1.0 + 0.1 * u_motion * sin(u_time * speed + a_attr.y * 6.2831853)));

  gl_PointSize = max(1.0, u_step * 0.75 * pow(b, 0.6) * u_dpr);
  v_alpha = (0.35 + 0.65 * b) * smoothstep(0.0, 0.3, local);
  v_color = u_palette[int(a_attr.z + 0.5)];

  vec2 clip = pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`

const FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;
in vec3 v_color;
in float v_alpha;
out vec4 outColor;
void main() {
  outColor = vec4(v_color * v_alpha, v_alpha);
}
`

/* ───────────────────────── Muestreo en rejilla ───────────────────────── */

/** PRNG determinista: la rejilla no cambia de color ni de dispersión entre reconstrucciones. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Grid {
  count: number
  step: number
  pos: Float32Array
  attr: Float32Array
}

/**
 * Lee la imagen (cover, anclada abajo para que la camiseta llegue al borde) en un canvas
 * offscreen de una celda por píxel y genera una partícula por celda con brillo suficiente.
 */
function sampleGrid(img: HTMLImageElement, w: number, h: number, baseStep: number, max: number): Grid | null {
  const off = document.createElement('canvas')
  const ctx = off.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  let step = baseStep
  for (;;) {
    const cols = Math.max(1, Math.ceil(w / step))
    const rows = Math.max(1, Math.ceil(h / step))
    off.width = cols
    off.height = rows
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, cols, rows)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.drawImage(img, (cols - dw) / 2, rows - dh, dw, dh)
    const data = ctx.getImageData(0, 0, cols, rows).data

    // Luminancia por celda y percentil 90 de las celdas visibles para normalizar el rango tonal.
    const lum = new Float32Array(cols * rows)
    const histogram = new Uint32Array(256)
    let lit = 0
    for (let i = 0; i < lum.length; i++) {
      const v = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
      lum[i] = v
      if (v >= BRIGHTNESS_MIN) {
        histogram[Math.min(255, Math.round(v * 255))]++
        lit++
      }
    }
    if (lit > max && step < baseStep * 2.5) {
      step += 0.5
      continue
    }

    let acc = 0
    let peak = 1
    for (let v = 255; v >= 0; v--) {
      acc += histogram[v]
      if (acc >= lit * 0.1) {
        peak = Math.max(v / 255, 0.3)
        break
      }
    }

    const rand = mulberry32(0x5eed)
    const pos = new Float32Array(lit * 4)
    const attr = new Float32Array(lit * 4)
    let n = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = lum[r * cols + c]
        if (v < BRIGHTNESS_MIN) continue
        const x = (c + 0.5) * step
        const y = (r + 0.5) * step
        const k = n * 4
        pos[k] = x
        pos[k + 1] = y
        pos[k + 2] = rand() * w
        pos[k + 3] = rand() * h
        const roll = rand()
        attr[k] = Math.pow(Math.min(1, v / peak), 0.85)
        attr[k + 1] = rand()
        attr[k + 2] = roll < CRIMSON_CHANCE ? 2 : roll < CRIMSON_CHANCE + GOLD_CHANCE ? 1 : 0
        // El retardo mezcla azar y altura: la imagen se arma de forma ligeramente descendente.
        attr[k + 3] = rand() * 0.6 + (y / h) * 0.4
        n++
      }
    }
    return { count: n, step, pos, attr }
  }
}

/* ───────────────────────── WebGL ───────────────────────── */

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const UNIFORMS = [
  'u_res',
  'u_dpr',
  'u_step',
  'u_time',
  'u_progress',
  'u_motion',
  'u_pointer',
  'u_strength',
  'u_radius',
  'u_palette',
] as const

type Uniforms = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>

interface Renderer {
  upload: (grid: Grid) => void
  resize: (w: number, h: number, dpr: number) => void
  draw: (s: FrameState) => void
  dispose: () => void
}

interface FrameState {
  time: number
  progress: number
  motion: number
  pointerX: number
  pointerY: number
  strength: number
}

function createRenderer(gl: WebGL2RenderingContext): Renderer | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, 'a_pos')
  gl.bindAttribLocation(program, 1, 'a_attr')
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  const uniforms = {} as Uniforms
  for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name)

  const vao = gl.createVertexArray()
  const posBuf = gl.createBuffer()
  const attrBuf = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, attrBuf)
  gl.enableVertexAttribArray(1)
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)

  gl.useProgram(program)
  gl.uniform3fv(uniforms.u_palette, PALETTE)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // salida con alfa premultiplicado
  gl.clearColor(0, 0, 0, 0)

  let count = 0
  let step = STEP_DESKTOP

  return {
    upload(grid) {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, grid.pos, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, attrBuf)
      gl.bufferData(gl.ARRAY_BUFFER, grid.attr, gl.STATIC_DRAW)
      count = grid.count
      step = grid.step
    },
    resize(w, h, dpr) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.uniform2f(uniforms.u_res, w, h)
      gl.uniform1f(uniforms.u_dpr, dpr)
    },
    draw(s) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uniforms.u_step, step)
      gl.uniform1f(uniforms.u_time, s.time)
      gl.uniform1f(uniforms.u_progress, s.progress)
      gl.uniform1f(uniforms.u_motion, s.motion)
      gl.uniform2f(uniforms.u_pointer, s.pointerX, s.pointerY)
      gl.uniform1f(uniforms.u_strength, s.strength)
      gl.uniform1f(uniforms.u_radius, POINTER_RADIUS)
      gl.bindVertexArray(vao)
      gl.drawArrays(gl.POINTS, 0, count)
      gl.bindVertexArray(null)
    },
    dispose() {
      gl.deleteBuffer(posBuf)
      gl.deleteBuffer(attrBuf)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

/* ───────────────────────── Componente ───────────────────────── */

interface ParticlePortraitProps {
  className?: string
}

export function ParticlePortrait({ className }: ParticlePortraitProps) {
  const { profile, ui } = portfolioData
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const wrapEl = wrapRef.current
    const holder = holderRef.current
    if (!wrapEl || !holder) return
    const wrap: HTMLDivElement = wrapEl

    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.className = 'absolute inset-0 h-full w-full'
    holder.appendChild(canvas)
    let renderer: Renderer | null = null

    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    const baseStep = isMobile ? STEP_MOBILE : STEP_DESKTOP
    const maxCount = isMobile ? MAX_MOBILE : MAX_DESKTOP
    const animated = !reduce

    const life = {
      cancelled: false,
      img: null as HTMLImageElement | null,
      image: null as HTMLImageElement | null,
      w: 0,
      h: 0,
      dpr: 1,
      ready: false,
      disposed: false,
      inView: false,
      formedAt: -1,
      raf: 0,
      last: 0,
      resizeTimer: 0,
      // Puntero suavizado (JS) y su intensidad con muelle: el shader solo recibe uniforms.
      targetX: 0,
      targetY: 0,
      px: -1e4,
      py: -1e4,
      pointerOn: false,
      strength: 0,
      strengthV: 0,
    }

    const isActive = () => life.inView && !document.hidden

    const render = (now: number) => {
      if (!renderer) return
      const progress = animated
        ? Math.min(1, Math.max(0, (now - life.formedAt) / ENTRY_MS))
        : 1
      renderer.draw({
        time: (now / 1000) % 1000,
        progress,
        motion: animated ? 1 : 0,
        pointerX: life.px,
        pointerY: life.py,
        strength: animated ? life.strength : 0,
      })
    }

    const stop = () => {
      if (life.raf) cancelAnimationFrame(life.raf)
      life.raf = 0
    }

    const tick = (now: number) => {
      life.raf = 0
      if (!life.ready || !isActive()) return
      const dt = Math.min((now - life.last) / 16.667, 3)
      life.last = now

      // La posición sigue al puntero con suavizado; la intensidad es un muelle (rebota al soltar).
      const follow = 1 - Math.pow(0.78, dt)
      life.px += (life.targetX - life.px) * follow
      life.py += (life.targetY - life.py) * follow
      const goal = life.pointerOn ? 1 : 0
      life.strengthV += (goal - life.strength) * 0.09 * dt
      life.strengthV *= Math.pow(0.84, dt)
      life.strength += life.strengthV * dt

      render(now)
      life.raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (life.raf || !life.ready || !animated || !isActive()) return
      life.last = performance.now()
      life.raf = requestAnimationFrame(tick)
    }

    const rebuild = () => {
      const img = life.img
      if (!img || !renderer || life.cancelled) return
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      if (life.ready && rect.width === life.w && rect.height === life.h && dpr === life.dpr) return
      life.w = rect.width
      life.h = rect.height
      life.dpr = dpr
      canvas.width = Math.max(1, Math.round(life.w * dpr))
      canvas.height = Math.max(1, Math.round(life.h * dpr))
      const grid = sampleGrid(img, life.w, life.h, baseStep, maxCount)
      if (!grid) {
        fail()
        return
      }
      renderer.resize(life.w, life.h, dpr)
      renderer.upload(grid)
      life.ready = true
      if (!animated) render(0) // reduced-motion: un solo frame con la rejilla formada
      else if (life.formedAt >= 0) render(performance.now())
      wake()
    }

    const ro = new ResizeObserver(() => {
      window.clearTimeout(life.resizeTimer)
      life.resizeTimer = window.setTimeout(rebuild, RESIZE_DEBOUNCE_MS)
    })

    let io: IntersectionObserver | null = null
    const onVisibility = () => (isActive() ? wake() : stop())

    const toLocal = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      life.targetX = e.clientX - rect.left
      life.targetY = e.clientY - rect.top
    }
    const onPointerMove = (e: PointerEvent) => {
      toLocal(e)
      if (!life.pointerOn) {
        life.px = life.targetX
        life.py = life.targetY
        life.pointerOn = true
      }
      wake()
    }
    const onPointerLeave = () => {
      life.pointerOn = false
    }

    const onContextLost = (e: Event) => {
      e.preventDefault()
      fail()
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    function dispose() {
      if (life.disposed) return
      life.disposed = true
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
      canvas.removeEventListener('webglcontextlost', onContextLost)
      renderer?.dispose()
      canvas.remove()
      if (life.image) {
        life.image.onload = null
        life.image.onerror = null
      }
      pre?.disconnect()
    }
    function fail() {
      dispose()
      setFailed(true)
    }

    let pre: IntersectionObserver | null = null
    const start = () => {
      const img = new Image()
      life.image = img
      img.decoding = 'async'
      img.onload = () => {
        if (life.cancelled) return
        const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true })
        renderer = gl ? createRenderer(gl) : null
        if (!renderer) {
          fail()
          return
        }
        life.img = img
        rebuild()
        if (!life.ready) return
        ro.observe(wrap)
        if (!animated) return

        io = new IntersectionObserver(
          ([entry]) => {
            life.inView = entry.isIntersecting
            if (life.inView) {
              if (life.formedAt < 0) life.formedAt = performance.now()
              wake()
            } else {
              stop()
            }
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
      img.onerror = () => {
        if (!life.cancelled) fail()
      }
      img.src = profile.portraitParticles
    }

    // La imagen, el contexto WebGL y la rejilla se preparan solo cuando la sección está cerca
    // del viewport, para no competir con la carga inicial.
    pre = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        pre?.disconnect()
        start()
      },
      { rootMargin: '400px 0px' },
    )
    pre.observe(wrap)

    return dispose
  }, [reduce, profile.portraitParticles])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={ui.about.portraitAria}
      className={cn('absolute inset-0 touch-pan-y', className)}
    >
      <div ref={holderRef} className="absolute inset-0" />
      {failed && (
        <img
          src={profile.portrait}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-bottom [filter:grayscale(0.7)]"
        />
      )}
    </div>
  )
}
