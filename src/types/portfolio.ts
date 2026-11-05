export type SkillLevel =
  | 'Fundamentos'
  | 'Principiante'
  | 'Principiante-Intermedio'
  | 'Intermedio-Básico'
  | 'Intermedio'
  | 'Intermedio-Alto'
  | 'Avanzado'

export type SkillCategory =
  | 'Lenguajes & Paradigmas'
  | 'Web & Frontend'
  | 'Backend & Bases de Datos'
  | 'Entornos & Herramientas'

export interface Skill {
  name: string
  level?: SkillLevel
  category: SkillCategory
}

export interface ToolGroup {
  title: string
  /** Nombre de icono Lucide */
  icon: string
  items: string[]
}

export interface SocialLink {
  label: string
  url: string
  /** Nombre de icono Lucide */
  icon: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  repoUrl?: string
  liveUrl?: string
  image?: string
  featured: boolean
  isPrivate?: boolean
  year?: number
  tagline?: string
  problem?: string
  solution?: string
  highlights?: string[]
  role?: string
}

export interface Service {
  id: string
  number: string
  title: string
  description: string
}

export interface Experience {
  id: string
  role: string
  org: string
  period: string
  description: string
  tags?: string[]
}

export interface Song {
  id: string
  title: string
  artist: string
  cover?: string
  spotifyUrl?: string
}

export interface NavItem {
  label: string
  href: string
}

export interface Art {
  hero: string
  heroMobile: string
  philosophy: string
  contact: string
}

export interface Profile {
  fullName: string
  shortName: string
  initials: string
  role: string
  roleAccent: string
  tagline: string
  heroWord: string
  bio: string
  philosophy: string
  location: string
  email: string
  githubUser: string
  portrait: string
  portraitParticles: string
  available: boolean
}

/** Título de sección con una palabra destacada en serif itálica. */
export interface SectionTitle {
  before: string
  accent: string
  after: string
}

export interface UiLabels {
  heroEyebrow: string
  heroAlt: string
  ctaProjects: string
  ctaContact: string
  scroll: string
  socialsTitle: string
  menuOpen: string
  menuClose: string
  menuLabel: string
  homeAria: string
  about: {
    eyebrow: string
    title: SectionTitle
    portraitAria: string
    portraitCaption: string
    availableText: string
    unavailableText: string
    locationLabel: string
  }
  philosophy: { eyebrow: string; imageAlt: string }
  skills: {
    eyebrow: string
    title: SectionTitle
    root: string
    treeLabel: string
    marqueeLabel: string
    levelLabel: string
  }
  placeholders: { projects: string; contact: string }
}

export interface PortfolioData {
  profile: Profile
  art: Art
  nav: NavItem[]
  socials: SocialLink[]
  skills: Skill[]
  toolGroups: ToolGroup[]
  projects: Project[]
  services: Service[]
  experience: Experience[]
  songs: Song[]
  ui: UiLabels
}
