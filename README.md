# World Cup 2026 Predictor

An interactive FIFA World Cup 2026 prediction platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Group Stage
- Predict all group stage standings
- Drag and reorder teams
- Automatic qualification tracking

### Third-Place Qualification
- Select the best third-place finishers
- Automatic Round of 32 generation

### Knockout Stage
- Complete Round of 32 bracket
- Round of 16
- Quarter-finals
- Semi-finals
- Third-place playoff
- Final
- Champion selection

### Awards
- Tournament award predictions

### Storylines
- Tournament storyline predictions

### Persistence
- Predictions automatically saved in browser local storage
- Continue where you left off

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React



```bash
npm install
npm run dev
```


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
