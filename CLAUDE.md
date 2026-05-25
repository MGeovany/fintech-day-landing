# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (default :5173, falls back to :5174 if busy)
npm run build    # Production build into dist/
npm run preview  # Serve the built dist/ locally
```

No test runner, linter or formatter is configured. The dev server is the primary feedback loop — Vite will hot-reload on any change to `index.html`, `src/`, or the root `*.css` files.

## Architecture

A single-page Vite landing for the Honduras Fintech Day 2026 conference. All content lives in `index.html` (one long document with sections: hero, stats, sobre, objs, audience, acts, digital, spon, stands, cta-final). There is no framework and no routing — everything is one HTML page styled by `src/style.css` and orchestrated by `src/main.js`.

### Boot flow (`src/main.js`)

`boot()` runs once on DOMContentLoaded and wires up everything in this order:

1. **Smooth scroll** — Lenis is created and bridged to GSAP via `gsap.ticker.add(...lenis.raf...)` plus `lenis.on('scroll', ScrollTrigger.update)`. This is the canonical Lenis+GSAP integration; if pinned ScrollTriggers misbehave, check this bridge first.
2. **Animation setup** functions from `src/animations.js` (each scoped to a concern: `setupReveals`, `setupSplitHeadings`, `setupCounters`, `setupTilt`, `setupMagnetic`, `setupParallax`, `setupActivitiesScroll`, `setupNav`, `setupCursor`, `setupAnchorScroll(lenis)`).
3. **Canvas scenes**: the hero grid is initialized eagerly (`initHeroScene` on `#hero-grid`); the secondary orb on `#sobre-canvas` is lazy-initialized via IntersectionObserver to keep hero perf clean.
4. Loader is hidden via `setTimeout` after one frame.

### Animation system (`src/animations.js`)

Driven entirely by **data attributes on HTML elements** — there are no per-element JS hooks. To opt an element into an animation, add the attribute in `index.html`:

| Attribute       | Effect                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| `data-reveal`   | Fades + slides in via `.is-in` class when its ScrollTrigger fires.     |
| `data-split`    | Heading is rebuilt char-by-char and animated with stagger.             |
| `data-counter`  | Integer counter animates from 0 to `data-counter` (suffix optional).   |
| `data-tilt`     | Card tracks pointer for a 3D rotateX/rotateY transform.                |
| `data-magnetic` | Element follows the cursor with a 0.35 strength offset on hover.       |

`prefersReduce` (matchMedia for reduced-motion) short-circuits every setup function — respect this if you add new ones.

`setupSplitHeadings` is destructive: it reads `el.textContent.trim()` and rebuilds the element with one `<span class="split-char">` per character. Do **not** put nested HTML (e.g. `<strong>`) inside an element with `data-split` — it will be flattened. Hero title words use a pure-CSS keyframe (`hero-rise` on `.hero-word`), not GSAP, because the GSAP intro was flaky in earlier iterations.

`setupActivitiesScroll` is the only horizontal-scroll-pin in the codebase. It uses `ScrollTrigger.matchMedia` to pin on ≥920px and degrade to native overflow-scroll with snap on smaller screens.

### Canvas scenes (`src/three/`)

Despite the directory name, `hero.js` is now a plain **2D canvas** renderer — it draws a faint grid plus traveling "pulse" trails (random horizontal/vertical glow runs spawned on a 0.65s interval). It pauses via IntersectionObserver when the hero scrolls out of view. The filename is kept for import stability; don't be misled by the path.

`orb.js` is still Three.js — a sphere mesh with a custom GLSL noise displacement shader plus a wireframe overlay, used as decoration in the "Sobre" section.

If you add a new canvas/3D scene, follow the same pattern: export `init…Scene(canvas)` that returns a cleanup function and observes its own canvas with `ResizeObserver` (Three sizing alone is not enough — the DOM layout often settles after init).

### Design system (tokens in repo root)

`variables.css`, `theme.css`, `tokens.json`, and `DESIGN.md` define the source-of-truth color/typography/spacing tokens (originally from the (dot)connect light theme — Vanilla Cream / Midnight Ink / Goldenrod Orange / Accent Blue). `index.html` loads `./variables.css` directly.

The current site uses a **dark redesign** that re-maps those tokens. `src/style.css` declares its own `:root` block at the top (`--bg`, `--text`, `--accent`, `--line`, etc.) that overrides the light-theme intent while reusing `--color-goldenrod-orange` (#fd5321) as the single accent. When changing colors, edit the `:root` block in `src/style.css` — the upstream tokens stay intact for reference but are not the active surface palette.

Two button systems coexist:

- **`.btn` / `.btn-primary` / `.btn-ghost`** — squared-corner CTAs used inside content sections.
- **`.btn-pill-cta` / `.btn-pill-cta--accent` / `.btn-arrow`** — pill-shaped CTAs used in the hero, modeled after the Cryptum reference. The `--accent` variant has the orange glow.

The nav uses its own `.btn-pill` (rounded user "Sign up" chip).

### Section conventions

Each `<section>` is its own CSS block in `src/style.css` and follows the same skeleton: optional `.section-head` (eyebrow + h2), then a grid. Card-grid sections (objs, audience, spon, stands) all use 12px gaps and `border-radius: 16px` cards on `var(--bg-card)` (white at 3% alpha) with `var(--line)` borders. The "Actividades" section is the exception — dark cards on `--bg-1` with a horizontal scroll pin.

Reduced-motion is handled globally at the bottom of `style.css` (`@media (prefers-reduced-motion: reduce)`) — animations are nuked, and `data-reveal` / `data-split` start in their final state.
