# STINABLIS — Where Engineering Meets Sustainability

A modern, dark minimalist Next.js landing page with 3D elements, smooth animations, and a polished design aesthetic.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for scroll-triggered animations
- **Vanilla Three.js** for the 3D rotating cube

## Features

- ✦ Full-screen loading screen with animated progress bar
- ✦ Custom cursor with spring-physics ring follower
- ✦ 3D wireframe cube driven by scroll position
- ✦ Fixed navbar with smooth scroll navigation
- ✦ 3D carousel for Services section
- ✦ Dark minimalist aesthetic with noise texture overlay
- ✦ Framer Motion scroll-triggered fade/scale animations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  layout.tsx      — Root layout with Google Fonts (Michroma, AR One Sans)
  page.tsx        — Main page with all sections
  globals.css     — Global styles, custom cursor, carousel CSS

components/
  LoadingScreen.tsx  — Animated loading screen with progress bar
  CustomCursor.tsx   — Two-part custom cursor with spring animation
  Navbar.tsx         — Fixed transparent navigation bar
  ThreeCube.tsx      — Three.js scroll-driven 3D cube
  Carousel.tsx       — 3D perspective carousel for services
```

## Sections

1. **Hero** — Full viewport with STINABLIS heading
2. **About** — Company overview with stats
3. **Services** — 3D carousel with 4 service cards
4. **Contact** — Contact CTA with footer

## Customization

- Replace Unsplash URLs in `components/Carousel.tsx` with your own images
- Update contact email/phone in `app/page.tsx`
- Modify service descriptions in `components/Carousel.tsx`
- Adjust color theme in `app/globals.css` and `app/page.tsx`
