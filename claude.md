# Stinablis Website Project

## Overview
Next.js landing page for Stinablis - a digital manufacturing solutions company based in Malaysia.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- EmailJS (contact form)
- Three.js (3D cube background)

## EmailJS Configuration
- **Service ID:** `service_z4refme`
- **Template ID:** `template_2tz2nes`
- **Public Key:** `W4PxuH5Nidlqts1aJ`

## Products/Services
1. Rapid Prototyping
2. Sustainable Composites (pineapple fibres)
3. 3D Printing
4. Automotive Parts
5. Reverse Engineering
6. Software Solutions
7. Animation and Audio Production

## Contact Information
- **Address:** Lot 1324, No.856, 1st Floor Tabuan Jaya, 93350 Kuching Sarawak Malaysia
- **Phone:** (+60) 11-6091 5670
- **Email:** info@stinablis.com
- **Facebook:** https://facebook.com/stinablis
- **LinkedIn:** https://linkedin.com/company/stinablis

## Public Assets
Images in `/public/`:
- `logo-new.png` - Main logo for navbar
- `hero-image.jpg` - Hero section background
- `about-image.jpg` - About section image
- `rapid.jpg` - Rapid Prototyping
- `fibre.jpg` - Sustainable Composites
- `3dprint.jpg` - 3D Printing
- `bumper.png` - Automotive Parts
- `scanning.png` - Reverse Engineering
- `web.png` - Software Solutions
- `production.png` - Animation/Audio Production

## Project Structure
```
/app
  page.tsx        # Main page with all sections
  layout.tsx      # Root layout
/components
  Navbar.tsx      # Navigation bar
  Carousel.tsx    # Products carousel
  LoadingScreen.tsx
  ParticleBackground.tsx
  ThreeCube.tsx
  CustomCursor.tsx
```

## Development
```bash
npm run dev     # Start dev server
npm run build   # Production build
```

## Notes
- Content was migrated from the `stinablis-landing` project
- Logo path must include leading slash: `/logo-new.png`
- Restart dev server after adding new files to `/public/`
