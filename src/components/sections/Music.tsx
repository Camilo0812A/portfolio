import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { portfolioData } from '@/data/portfolioData'
import { cn } from '@/lib/cn'
import type { Song } from '@/types/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const

function initialsOf(title: string): string {
  return title
    .split(/\s+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/** Las portadas remotas (Spotify) no deben enviar referrer; las locales no lo necesitan. */
const isRemote = (src: string) => /^https?:\/\//i.test(src)

function SongCard({ song, index }: { song: Song; index: number }) {
  const { music: t } = portfolioData.ui
  const reduce = useReducedMotion()
  const [broken, setBroken] = useState(false)
  const showCover = Boolean(song.cover) && !broken

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      className="w-[64vw] max-w-[17rem] shrink-0 snap-center lg:w-auto lg:max-w-none lg:shrink lg:flex-1"
    >
      <a
        href={song.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-card outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <div className="relative aspect-square">
          {/* Vinilo: sale por la derecha, detrás de la portada */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-y-[3%] right-0 z-0 aspect-square h-[94%] transition-transform duration-500 ease-out',
              'group-hover:translate-x-[34%] group-focus-visible:translate-x-[34%]',
            )}
          >
            <div className="vinyl vinyl-spin size-full" />
          </div>

          <div className="relative z-10 size-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_50px_-24px_rgb(0_0_0/0.9)]">
            {showCover ? (
              <img
                src={song.cover}
                alt=""
                aria-hidden="true"
                width={300}
                height={300}
                loading="lazy"
                decoding="async"
                referrerPolicy={song.cover && isRemote(song.cover) ? 'no-referrer' : undefined}
                onError={() => setBroken(true)}
                className="size-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:scale-105 group-focus-visible:grayscale-0 [@media(hover:none)]:grayscale-0"
              />
            ) : (
              <div className="grain flex size-full items-center justify-center bg-surface-2">
                <span
                  aria-hidden="true"
                  className="text-gradient-metal font-display text-7xl font-black leading-none"
                >
                  {initialsOf(song.title)}
                </span>
              </div>
            )}
            <span
              aria-hidden="true"
              className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-bg/70 text-gold backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold group-hover:text-bg group-focus-visible:bg-gold group-focus-visible:text-bg"
            >
              <Icon name="Play" size={14} fill="currentColor" />
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-display text-lg font-bold leading-tight text-text md:text-xl">
            {song.title}
          </p>
          <p className="mt-1 text-sm text-muted">{song.artist}</p>
          {song.album && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {song.album}
            </p>
          )}
          <span className="sr-only">
            {' '}
            — {t.listen} ({t.newTab})
          </span>
        </div>
      </a>
    </motion.li>
  )
}

export function Music() {
  const { songs, ui } = portfolioData
  const { music: t } = ui

  return (
    <section
      id="music"
      aria-labelledby="music-title"
      className="overflow-x-clip px-4 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="music-title" eyebrow={t.eyebrow} title={t.title} />

        <ul
          aria-label={t.listLabel}
          className="-mx-4 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-6 pr-16 md:mx-0 md:px-0 lg:gap-20 lg:overflow-visible lg:pb-0 lg:pr-0"
        >
          {songs.map((song, i) => (
            <SongCard key={song.id} song={song} index={i} />
          ))}
        </ul>

        <p className="mx-auto mt-12 max-w-2xl text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.3em] text-muted md:mt-16 md:text-xs">
          {t.phrase}
        </p>
      </div>
    </section>
  )
}
