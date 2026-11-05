import type { PortfolioData } from '@/types/portfolio'

// Todo el contenido del portafolio vive aquí. Los `TODO` son datos por completar.

export const portfolioData: PortfolioData = {
  profile: {
    fullName: 'David Camilo Colmenares Hernández',
    shortName: 'Camilo',
    initials: 'DC',
    role: 'Software',
    roleAccent: 'Developer',
    // TODO: reescribir con tu propia voz
    tagline: 'Estudiante de Ingeniería de Sistemas que convierte ideas en software.',
    heroWord: 'CAMILO',
    // TODO: reescribir con tu propia voz
    bio: 'Soy estudiante de Ingeniería de Sistemas y desarrollador de software. Me interesa construir productos web claros, rápidos y bien cuidados.',
    // TODO: reescribir con tu propia voz
    philosophy: 'Código limpio, detalles cuidados y aprender un poco cada día.',
    location: 'Colombia',
    email: 'TODO',
    githubUser: 'Camilo0812A',
    portrait: '/images/profile/portrait.webp',
    portraitParticles: '/images/profile/portrait-particles.webp',
    available: true,
  },

  art: {
    hero: '/images/hero/hero.webp',
    heroMobile: '/images/hero/hero-mobile.webp',
    philosophy: '/images/hero/philosophy.webp',
    contact: '/images/hero/contact.webp',
  },

  nav: [
    { label: 'Inicio', href: '#home' },
    { label: 'Sobre mí', href: '#about' },
    { label: 'Proyectos', href: '#projects' },
    { label: 'Contacto', href: '#contact' },
  ],

  socials: [
    { label: 'GitHub', url: 'https://github.com/Camilo0812A', icon: 'Github' },
    { label: 'LinkedIn', url: 'TODO', icon: 'Linkedin' },
    { label: 'Email', url: 'TODO', icon: 'Mail' },
  ],

  skills: [
    // Lenguajes & Paradigmas
    { name: 'Java', level: 'Intermedio-Alto', category: 'Lenguajes & Paradigmas' },
    { name: 'C/C++', level: 'Fundamentos', category: 'Lenguajes & Paradigmas' },
    { name: 'Python', level: 'Intermedio-Básico', category: 'Lenguajes & Paradigmas' },
    { name: 'POO', category: 'Lenguajes & Paradigmas' },
    { name: 'Estructuras de Datos y Algoritmos', category: 'Lenguajes & Paradigmas' },
    // Web & Frontend
    { name: 'JavaScript', level: 'Intermedio', category: 'Web & Frontend' },
    { name: 'TypeScript', level: 'Principiante-Intermedio', category: 'Web & Frontend' },
    { name: 'React', level: 'Principiante', category: 'Web & Frontend' },
    { name: 'Tailwind CSS', level: 'Intermedio', category: 'Web & Frontend' },
    { name: 'HTML5 & CSS3', level: 'Intermedio', category: 'Web & Frontend' },
    // Backend & Bases de Datos
    { name: 'SQL / PostgreSQL', level: 'Intermedio-Básico', category: 'Backend & Bases de Datos' },
    { name: 'Django', level: 'Principiante', category: 'Backend & Bases de Datos' },
    // Entornos & Herramientas
    { name: 'Git', category: 'Entornos & Herramientas' },
    { name: 'GitHub', category: 'Entornos & Herramientas' },
    { name: 'Linux (Linux Mint)', category: 'Entornos & Herramientas' },
    { name: 'Visual Studio Code', category: 'Entornos & Herramientas' },
  ],

  toolGroups: [
    {
      title: 'Frontend',
      icon: 'Monitor',
      items: ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'HTML5 & CSS3'],
    },
    {
      title: 'Backend & Datos',
      icon: 'Database',
      items: ['Java', 'Python', 'Django', 'SQL / PostgreSQL'],
    },
    {
      title: 'Herramientas',
      icon: 'Wrench',
      items: ['Git', 'GitHub', 'Linux (Linux Mint)', 'Visual Studio Code'],
    },
  ],

  // Proyectos. Los repos públicos salen de github.com/Camilo0812A (sin este repo "portfolio"
  // ni el repo de perfil). Descripción y tech se tomaron de cada README (no del campo "About"
  // de GitHub). Los repos privados no llevan repoUrl.
  // TODO: confirmar que ninguno sea fork y revisar/ajustar las descripciones.
  projects: [
    {
      id: 'tuned-boyer-moore-simulator',
      title: 'Tuned Boyer-Moore Simulator',
      description:
        'Simulador interactivo del algoritmo de búsqueda de cadenas Tuned Boyer-Moore: paso a paso, con línea de tiempo y tabla bmBc.',
      tech: ['HTML', 'JavaScript'],
      repoUrl: 'https://github.com/Camilo0812A/tuned-boyer-moore-simulator',
      image: '/images/projects/tuned-boyer-moore-simulator.webp',
      featured: true,
      year: 2026,
    },
    {
      id: 'parcial-ada-analisis',
      title: 'Parcial ADA · Entrenador de Análisis de Algoritmos',
      description:
        'Minijuego web 100 % offline para practicar T(n), Big-O y Ω y el diseño de algoritmos para el primer parcial.',
      tech: ['HTML', 'CSS', 'JavaScript', 'KaTeX'],
      repoUrl: 'https://github.com/Camilo0812A/parcial-ada-analisis',
      liveUrl: 'https://camilo0812a.github.io/parcial-ada-analisis/',
      image: '/images/projects/parcial-ada-analisis.webp',
      featured: true,
      year: 2026,
    },
    {
      id: 'clima-react',
      title: 'Clima React',
      description:
        'Buscador de pronóstico: clima de hoy y próximos 7 días de cualquier ciudad, con la API gratuita de Open-Meteo.',
      tech: ['React', 'Vite', 'CSS'],
      repoUrl: 'https://github.com/Camilo0812A/clima-react',
      liveUrl: 'https://camilo0812a.github.io/clima-react/',
      image: '/images/projects/clima-react.webp',
      featured: true,
      year: 2026,
    },
    {
      id: 'tablero-soporte',
      title: 'Mesa de ayuda · Tablero de tickets',
      description:
        'Tablero para gestionar tickets de soporte de una oficina, con API REST sobre json-server.',
      tech: ['HTML', 'Tailwind CSS', 'JavaScript', 'json-server'],
      repoUrl: 'https://github.com/Camilo0812A/tablero-soporte',
      image: '/images/projects/tablero-soporte.webp',
      featured: false,
      year: 2026,
    },
    {
      id: 'taller-crud-react',
      title: 'Mis tareas · CRUD en React',
      description:
        'Lista de tareas con CRUD completo, componentes y props; guarda en localStorage.',
      tech: ['React', 'Vite', 'CSS'],
      repoUrl: 'https://github.com/Camilo0812A/taller-crud-react',
      liveUrl: 'https://camilo0812a.github.io/taller-crud-react/',
      image: '/images/projects/taller-crud-react.webp',
      featured: false,
      year: 2026,
    },
    {
      id: 'bitacora-dev',
      title: 'Bitácora Dev',
      description:
        'Bitácora diaria en Markdown de lo que aprendo en la U y en mis proyectos.',
      tech: ['Markdown'],
      repoUrl: 'https://github.com/Camilo0812A/bitacora-dev',
      image: '/images/projects/bitacora-dev.webp',
      featured: false,
      year: 2026,
    },
    // Repo privado: sin repoUrl.
    {
      id: 'promptazo',
      title: 'Promptazo',
      description: 'TODO',
      tech: [], // TODO
      image: '/images/projects/promptazo.webp',
      featured: false,
      isPrivate: true,
    },
  ],

  services: [
    { id: 'frontend', number: '01', title: 'Desarrollo web frontend', description: 'TODO' },
    { id: 'backend', number: '02', title: 'Backend y bases de datos', description: 'TODO' },
    { id: 'soporte', number: '03', title: 'Soporte técnico y Linux', description: 'TODO' },
  ],

  experience: [
    {
      id: 'exp-1',
      role: 'TODO',
      org: 'TODO',
      period: 'TODO',
      description: 'TODO',
      tags: [],
    },
    {
      id: 'exp-2',
      role: 'TODO',
      org: 'TODO',
      period: 'TODO',
      description: 'TODO',
      tags: [],
    },
  ],

  songs: [
    {
      id: 'glue-song',
      title: 'Glue Song',
      artist: 'beabadoobee',
      cover: '/images/songs/glue-song.webp',
      spotifyUrl: 'TODO',
    },
    {
      id: 'waltz-for-the-moon',
      title: 'Waltz for the Moon',
      artist: 'Nobuo Uematsu — Final Fantasy VIII',
      cover: '/images/songs/waltz-for-the-moon.webp',
      spotifyUrl: 'TODO',
    },
    {
      id: 'color-your-night',
      title: 'Color Your Night',
      artist: 'Lotus Juice & Azumi Takahashi — Persona 3 Reload',
      cover: '/images/songs/color-your-night.webp',
      spotifyUrl: 'TODO',
    },
    {
      id: 'starlight',
      title: 'Starlight',
      artist: 'TODO',
      cover: '/images/songs/starlight.webp',
      spotifyUrl: 'TODO',
    },
  ],
}
