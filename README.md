# Honduras Fintech Day 2026 — Landing

Landing oficial del Honduras Fintech Day 2026. Stack: Vite + Three.js + GSAP + Lenis.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Estructura

- `index.html` — markup de todas las secciones
- `src/main.js` — bootstrap (scroll, 3D, animaciones)
- `src/style.css` — estilos basados en el sistema (dot)connect
- `src/three/hero.js` — escena 3D del hero (icosaedro distorsionado + partículas)
- `src/three/orb.js` — orbes decorativos secundarios
- `src/animations.js` — scroll triggers, parallax, counters, tilt 3D

## Diseño

Sistema de tokens definido en `DESIGN.md`, `theme.css`, `tokens.json`, `variables.css`.
