# Camilo Colmenares · Software Developer

Portafolio personal con estética de claroscuro al óleo y guiños gamer.

**Sitio:** https://dcportafolio.vercel.app

## Descripción

Sitio de una sola página con secciones de inicio, sobre mí, filosofía, stack, proyectos, servicios, trayectoria, música y contacto. Incluye animaciones suaves con scroll, retrato de partículas, cards apiladas de proyectos y soporte completo para `prefers-reduced-motion`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Motion (animaciones) y Lenis (scroll suave)
- Lucide (iconos)
- Oxlint

## Estructura

```
public/            Imágenes, favicon, og.jpg, robots.txt y sitemap.xml
src/
  components/
    effects/       Efectos visuales (retrato de partículas)
    layout/        Navbar, menú, preloader, footer
    sections/      Hero, About, Philosophy, Skills, Projects, Services, Experience, Music, Contact
    ui/            Piezas reutilizables (Icon, SectionHeading)
  context/         Contexto de Lenis
  data/            portfolioData.ts: todo el contenido del sitio
  hooks/           useLenis, useMediaQuery
  lib/             Utilidades
  types/           Tipos del contenido
  index.css        Tokens de diseño y estilos globales
```

## Cómo correrlo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compila TypeScript y genera dist/
npm run preview  # sirve la compilación local
npm run lint
```

## Dónde editar el contenido

Todo el texto, proyectos, canciones, enlaces y etiquetas viven en `src/data/portfolioData.ts`. Los componentes no llevan contenido propio.

## Créditos

- Las portadas de las canciones se cargan directamente desde Spotify; no se almacenan en este repositorio.
- El arte de fondo fue creado para este sitio.
