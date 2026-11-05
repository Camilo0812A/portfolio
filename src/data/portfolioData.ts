import type { PortfolioData } from '@/types/portfolio'

// Todo el contenido del portafolio vive aquí. Los `TODO` son datos por completar.

export const portfolioData: PortfolioData = {
  profile: {
    fullName: 'David Camilo Colmenares Hernández',
    shortName: 'Camilo',
    initials: 'DC',
    role: 'Software',
    roleAccent: 'Developer',
    tagline: 'Construyo experiencias web rápidas, claras y con carácter.',
    heroWord: 'CAMILO',
    bio: 'Soy Camilo, estudiante de Ingeniería de Sistemas en Colombia. Me gusta construir cosas que se sientan bien al usarlas: herramientas web rápidas, interfaces cuidadas y código que otros puedan entender. Vengo de Java y la programación orientada a objetos, y hoy me muevo entre TypeScript, React y Python. Además, llevo un año haciendo soporte técnico: arreglar equipos e instalar Linux me enseñó a resolver problemas reales.',
    philosophy:
      'Un buen software es como un buen juego: reglas claras, respuesta inmediata y cero frustración innecesaria. Construyo por fases, pruebo cada paso y cuido los detalles que nadie ve, pero todos sienten.',
    location: 'Colombia',
    email: 'dcolmenaresh1@gmail.com',
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
    { label: 'Stack', href: '#skills' },
    { label: 'Proyectos', href: '#projects' },
    { label: 'Contacto', href: '#contact' },
  ],

  socials: [
    { label: 'GitHub', url: 'https://github.com/Camilo0812A', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/camilo-colmenares-7b96a6281', icon: 'Linkedin' },
    { label: 'Email', url: 'mailto:dcolmenaresh1@gmail.com', icon: 'Mail' },
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
    // Repo privado: sin repoUrl.
    {
      id: 'promptazo',
      title: 'Promptazo',
      tagline:
        'Generador web gratuito que convierte un formulario corto en prompts profesionales para Claude (presentaciones, CV para filtros ATS y guías de estudio), en español e inglés.',
      description:
        'Herramienta web gratuita que convierte las respuestas de un formulario por pasos en prompts profesionales listos para pegar en Claude. Tiene tres plantillas: presentaciones HTML con 3D, CV que pasa filtros automáticos (ATS) y guías de estudio interactivas. Adapta cada prompt a Claude Code o al chat gratuito de Claude, ahorrando tokens en este último. No tiene backend ni cuentas: todo ocurre en el navegador.',
      problem:
        'Al pedirle a una IA una presentación o un CV, el resultado suele ser genérico, y escribir un prompt bueno desde cero toma tiempo.',
      solution:
        'Promptazo pregunta lo esencial en un asistente por pasos y arma un prompt completo, con reglas para no inventar datos, evitar diseños genéricos y trabajar por fases.',
      highlights: [
        'Sitio estático hecho con Astro y TypeScript, sin backend ni base de datos. El borrador se guarda en el navegador.',
        'Motor de plantillas propio: cada plantilla es solo datos (un esquema y un texto con marcadores). Para agregar una nueva no se toca la lógica.',
        'Generador puro que adapta el prompt al modo (rápido o completo), a la IA (Claude Code o chat) y al idioma (ES/EN), y agrupa en una sola línea lo que decide la IA para ahorrar tokens.',
        'Calidad: 1.120 pruebas unitarias (Vitest) y 188 pruebas de extremo a extremo (Playwright) en móvil y escritorio, con revisión de accesibilidad WCAG AA.',
        'Rendimiento: Lighthouse entre 97 y 100 en las cuatro categorías, con unos 6 KB de JavaScript comprimido.',
        'Publicado en Cloudflare Pages, con SEO, sitemap, datos estructurados y analítica sin cookies.',
      ],
      role: 'Definí el producto, las plantillas y las reglas de cada prompt, y lo construí por fases con Claude Code como asistente de desarrollo: dirigí, revisé y aprobé cada fase.',
      tech: ['Astro', 'TypeScript', 'Vitest', 'Playwright', 'Cloudflare Pages'],
      liveUrl: 'https://promptazo.pages.dev',
      image: '/images/projects/promptazo.webp',
      featured: true,
      isPrivate: true,
      year: 2026,
    },
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
      featured: false,
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
      id: 'bitacora-dev',
      title: 'Bitácora Dev',
      description:
        'Bitácora diaria en Markdown de lo que aprendo en la U y en mis proyectos.',
      tech: ['Markdown'],
      repoUrl: 'https://github.com/Camilo0812A/bitacora-dev',
      featured: false,
      year: 2026,
    },
  ],

  services: [
    {
      id: 'frontend',
      number: '01',
      title: 'Desarrollo web frontend',
      description:
        'Interfaces web con React, TypeScript, Astro y Tailwind CSS, como Promptazo, Clima React y el simulador de Tuned Boyer-Moore.',
    },
    {
      id: 'backend',
      number: '02',
      title: 'Backend y bases de datos',
      description:
        'APIs REST con json-server, como en el tablero de Mesa de ayuda, y bases de datos SQL/PostgreSQL y Django a nivel inicial.',
    },
    {
      id: 'soporte',
      number: '03',
      title: 'Soporte técnico y Linux',
      description:
        'Mantenimiento de equipos e instalación de sistemas operativos, incluido Linux.',
    },
    {
      id: 'calidad',
      number: '04',
      title: 'Calidad y rendimiento web',
      description:
        'Pruebas unitarias y de extremo a extremo con Vitest y Playwright, accesibilidad WCAG AA y optimización para Lighthouse, como en Promptazo (1.120 pruebas unitarias, 188 E2E y puntajes de 97 a 100).',
    },
  ],

  experience: [
    {
      id: 'exp-ufps',
      kind: 'education',
      role: 'Ingeniería de Sistemas',
      org: 'UFPS',
      period: 'En curso',
      description: 'Carrera profesional en curso.',
    },
    {
      id: 'exp-soporte',
      kind: 'work',
      role: 'Soporte técnico',
      description: 'Mantenimiento e instalación de sistemas operativos.',
    },
    {
      id: 'exp-atencion',
      kind: 'work',
      role: 'Atención al cliente',
      description: 'Experiencia en atención al cliente.',
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
      artist: 'Muse',
      cover: '/images/songs/starlight.webp',
      spotifyUrl: 'TODO',
    },
  ],

  ui: {
    heroEyebrow: 'INGENIERÍA DE SISTEMAS · COLOMBIA',
    heroAlt: 'Bodegón al óleo: calavera, vela, control de videojuego y monitor CRT',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Contacto',
    scroll: 'SCROLL',
    socialsTitle: 'Redes',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    menuLabel: 'Menú de navegación',
    homeAria: 'Ir al inicio',
    about: {
      eyebrow: '01 — SOBRE MÍ',
      title: { before: 'Detrás del', accent: 'código', after: '' },
      portraitAria: 'Retrato de Camilo formado por partículas',
      portraitCaption: 'CAMILO · COLOMBIA',
      availableText: 'Disponible para prácticas y proyectos',
      unavailableText: 'No disponible por ahora',
      locationLabel: 'Ubicación',
    },
    philosophy: {
      eyebrow: '02 — FILOSOFÍA',
      imageAlt:
        'Dos manos al óleo, una sostiene un control de videojuego y de la otra sale un cable dorado',
    },
    skills: {
      eyebrow: '03 — STACK',
      title: { before: 'Mi caja de', accent: 'herramientas', after: '' },
      root: 'Stack',
      treeLabel: 'Árbol de herramientas por área',
      marqueeLabel: 'Habilidades técnicas',
      levelLabel: 'Nivel',
    },
    projects: {
      eyebrow: '04 — PROYECTOS',
      title: { before: 'Proyectos', accent: 'seleccionados', after: '' },
      listLabel: 'Proyectos destacados',
      moreTitle: 'Más proyectos',
      moreLabel: 'Más proyectos',
      viewSite: 'Ver sitio',
      code: 'Código',
      private: 'Privado',
      showDetails: 'Ver detalles',
      hideDetails: 'Ocultar detalles',
      problem: 'El problema',
      solution: 'La solución',
      technical: 'Lo técnico',
      role: 'Mi rol',
      newTab: 'se abre en una pestaña nueva',
      shotAlt: 'Captura de',
      codeAria: 'Ver el código de',
      siteAria: 'Ver el sitio de',
    },
    services: {
      eyebrow: '05 — SERVICIOS',
      title: { before: 'Lo que', accent: 'puedo hacer', after: '' },
      listLabel: 'Servicios',
    },
    experience: {
      eyebrow: '06 — TRAYECTORIA',
      title: { before: 'Mi', accent: 'camino', after: '' },
      listLabel: 'Trayectoria',
      icons: {
        'exp-ufps': 'GraduationCap',
        'exp-soporte': 'Wrench',
        'exp-atencion': 'Headphones',
      },
      fallbackIcon: 'Briefcase',
    },
    placeholders: {
      contact: 'Contacto',
    },
  },
}
