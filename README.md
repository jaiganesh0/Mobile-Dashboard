# Day 3 - Vite Configuration Environments & Mobile Breakpoint Layouts

A Student Dashboard built with **Vite + vanilla JavaScript** covering both Day 3 tasks.

## Task 1 - Vite Configuration Environments
Everything lives in `vite.config.js` and the `.env*` files.

| Requirement | How it is done |
|---|---|
| Compile configurations | `defineConfig(({ mode, command }) => ...)`, esbuild target `es2020`, `define` globals (`__APP_VERSION__`, `__BUILD_MODE__`), console/debugger stripped in production |
| Environments | `.env`, `.env.development`, `.env.staging`, `.env.production` loaded with `loadEnv`; accessed through `src/config/env.js` |
| Absolute imports | `resolve.alias`: `@`, `@components`, `@utils`, `@config`, `@data`, `@assets`, `@styles` |
| Build optimization | esbuild minify, CSS minify + code split, `manualChunks` (data / utils), sourcemaps only in dev/staging, inline limit 4kb |
| Assets processing | Hashed output names grouped into `js/`, `css/`, `images/`, `fonts/`; SVG imported from JS is processed by Vite |

## Task 2 - Mobile Breakpoint Layouts
Mobile-first CSS (`src/styles/layout.css`): base styles are for phones, enhanced with `min-width` queries.

| Breakpoint | Layout |
|---|---|
| < 576px (mobile) | 2-col stats, single column cards, off-canvas drawer menu |
| >= 576px | larger padding and heading |
| >= 768px (tablet) | 4-col stats, 2-col card grid |
| >= 1024px (laptop) | drawer becomes fixed sidebar, 3-col grid |
| >= 1280px (desktop) | extra spacing, larger hero |

**Touch gesture / hover adaptations**
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`
- Touch devices get `:active` press feedback inside `@media (hover: none)`
- 44px minimum tap targets, `touch-action: manipulation`, no tap highlight flash
- Swipe from left edge opens the drawer, swipe left closes it (`gestures.js`)
- `prefers-reduced-motion`, landscape-phone and safe-area support

## Run it
```bash
npm install
npm run dev            # development mode  (.env.development)
npm run build:staging  # staging build     (.env.staging)
npm run build          # production build  (.env.production)
npm run preview        # serve the dist folder
```

## Structure
```
index.html  vite.config.js  .env*  package.json
src/ main.js  config/  utils/  data/  components/  assets/  styles/
public/favicon.svg
screenshots/  docs/Day3_Report.pdf
```
