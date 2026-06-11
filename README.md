# World Cup 2026 Predictor

A modern, dark-themed landing experience for predicting FIFA World Cup 2026 — built with Next.js, TypeScript, and Tailwind CSS.

## What's included

- Football-themed landing page (FIFA+ / FotMob / UEFA inspired)
- Sticky navigation with **Start Predicting** CTA
- Hero section with tournament stats
- Live countdown to opening match (11 June 2026)
- Navigation cards for Group Stage, Third Place Selection, Knockout Stage, Awards, and Storylines

Prediction flows are **not** implemented yet — layout and UI only.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description          |
|----------------|----------------------|
| `npm run dev`  | Development server   |
| `npm run build`| Production build     |
| `npm run start`| Production server    |
| `npm run lint` | ESLint               |

## Project structure

```
src/
  app/           # App router pages & global styles
  components/    # Navbar, Hero, Countdown, NavCards, Footer
  lib/           # Tournament constants & countdown helpers
```
