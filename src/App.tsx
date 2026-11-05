import { motion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { portfolioData } from '@/data/portfolioData'
import { useLenis } from '@/hooks/useLenis'
import { cn } from '@/lib/cn'
import type { SkillCategory } from '@/types/portfolio'

const categories: SkillCategory[] = [
  'Lenguajes & Paradigmas',
  'Web & Frontend',
  'Backend & Bases de Datos',
  'Entornos & Herramientas',
]

export default function App() {
  useLenis()
  const { profile, art, skills, projects, services, songs, toolGroups, socials } = portfolioData

  const thumbs: { label: string; src: string }[] = [
    { label: 'hero', src: art.hero },
    { label: 'heroMobile', src: art.heroMobile },
    { label: 'philosophy', src: art.philosophy },
    { label: 'contact', src: art.contact },
    { label: 'portrait', src: profile.portrait },
    { label: 'portraitParticles', src: profile.portraitParticles },
  ]

  const toolIcon = toolGroups[0]?.icon ?? ''
  const socialIcon = socials[0]?.icon ?? ''

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16"
    >
      <header>
        <h1 className="font-display text-[clamp(4rem,18vw,12rem)] font-black leading-none tracking-tight text-gradient-metal">
          {profile.heroWord}
        </h1>
        <p className="mt-2 text-2xl">
          {profile.role}{' '}
          <span className="font-serif italic text-accent">{profile.roleAccent}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-faint">Diagnóstico Fase 1 — se reemplaza en la Fase 2</p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((cat) => (
          <Stat
            key={cat}
            label={cat}
            value={skills.filter((s) => s.category === cat).length}
          />
        ))}
        <Stat label="Proyectos" value={projects.length} />
        <Stat label="Servicios" value={services.length} />
        <Stat label="Canciones" value={songs.length} />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {thumbs.map((t) => (
          <figure key={t.label} className="overflow-hidden rounded-xl border border-border bg-surface">
            <img src={t.src} alt={t.label} loading="lazy" className="aspect-video w-full object-cover" />
            <figcaption className="px-3 py-2 font-mono text-xs text-muted">{t.label}</figcaption>
          </figure>
        ))}
      </section>

      <article
        className={cn(
          'glow-corner grain rounded-card border border-border bg-surface p-8',
        )}
      >
        <div className="flex items-center gap-3 text-gold">
          <Icon name={toolIcon} size={22} />
          <Icon name={socialIcon} size={22} />
          <span className="font-mono text-xs uppercase tracking-widest">
            {toolIcon} · {socialIcon}
          </span>
        </div>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-gradient-ember">{profile.fullName}</h2>
        <p className="mt-2 max-w-prose text-muted">{profile.tagline}</p>
      </article>
    </motion.main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="font-display text-3xl font-extrabold text-text">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  )
}
