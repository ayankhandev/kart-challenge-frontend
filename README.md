# Modern POS Interface

A highly optimized, fully responsive Point of Sale (POS) frontend built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.

## Features

- **Modern Architecture**: Beautiful glassmorphism UI with vibrant colors.
- **Production React**: Implements IntersectionObserver infinite scrolling for massive product datasets.
- **Robust State Management**: Powered by **Zustand** for rock-solid, persistent shopping cart state matching across tabs/reloads.
- **Seamless Integration**: Automatically syncs cart logic, promo codes, and ordering flows with the NestJS backend dynamically.
- **Mobile First**: Shrinks from an expansive two-panel checkout experience on desktops down into a sleek floating action button on mobile.

## Quick Start

### 1. Configure Backend URL
Create a `.env` or `.env.local` file in the root of the project to map your NestJS backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

*(By default, the backend runs on port 3000).*

### 2. Install Packages
We recommend using `pnpm` specifically to match the repo's internal caching structure.
```bash
pnpm install
```

### 3. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3001](http://localhost:3001) with your browser to launch the beautiful modern POS terminal system.
