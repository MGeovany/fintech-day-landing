# CLAUDE.md — Honduras Fintech Day Landing

## Principios de trabajo

1. Don't assume. Don't hide confusion. Surface tradeoffs.
2. Minimum code that solves the problem. Nothing speculative.
3. Touch only what you must. Clean up only your own mess.
4. Define success criteria. Loop until verified.
5. Use SOLID principles.

## Stack

| Capa | Tecnología |
|---|---|
| Build | Vite |
| Markup | HTML (`index.html` + `src/components/*.html`) |
| Estilos | **Tailwind CSS v4** (nuevo) + CSS legacy en `src/style.css` |
| JS | JavaScript vanilla (`src/main.js`, `src/animations.js`, …) |
| Animaciones | GSAP + Lenis |
| Tokens | `variables.css`, `theme.css`, `tokens.json` |

## Estilos — Tailwind desde ahora

**Regla:** todo código nuevo y todo refactor de UI debe usar **Tailwind utilities** en el HTML. No agregar CSS custom salvo casos excepcionales.

### Qué usar

- Clases Tailwind en `src/components/*.html` y `index.html`
- Plugin Vite: `@tailwindcss/vite` (configurado en `vite.config.js`)
- Entry CSS: `@import "tailwindcss"` al inicio de `src/style.css`
- Tokens del diseño vía `@theme` en `src/style.css` y variables en `variables.css`

### Colores y tipografía (referencia rápida)

- Acento: `text-accent`, `bg-accent`, `border-accent` → `#fd5321`
- Fondo: `bg-bg`, `bg-bg-1` → `#050505`, `#0a0a0a`
- Texto: `text-text`, `text-text-mute`
- Display: `font-display` (Space Grotesk)
- Body: `font-body` (Inter)

### CSS legacy

- `src/style.css` contiene estilos existentes pre-Tailwind (hero, nav, cards, animaciones, etc.)
- **No reescribir todo de golpe.** Migrar sección por sección cuando se toque.
- Si una utilidad Tailwind no alcanza (canvas 3D, pseudo-elementos complejos, keyframes GSAP), usar `@layer components` o CSS scoped mínimo y documentar por qué.

### Ejemplo

```html
<!-- Preferido -->
<article class="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
  <h3 class="font-display text-xl text-text">Título</h3>
  <p class="mt-2 text-sm leading-relaxed text-text-mute">Descripción</p>
</article>
```

## Estructura del proyecto

- `src/layout.js` — monta los parciales HTML en `#app`
- `src/components/` — una sección = un `.html`
- `src/three/` — escenas canvas (hero grid, ecosystem hub)
- `src/animations.js` — scroll triggers, reveals, cursor, nav

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```
