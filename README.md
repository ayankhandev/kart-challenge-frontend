# Modern POS Interface

A fully responsive Point of Sale frontend built with **Next.js 16**, **React 19**, **Zustand**, and **Tailwind CSS v4**.

## Features

- **Infinite Scroll Product Grid** — IntersectionObserver-based pagination with skeleton loading and category filtering.
- **Persistent Cart** — Zustand with localStorage middleware keeps cart state across reloads and tabs.
- **Promo Code Validation** — Modal-based coupon entry with real-time API verification and error feedback.
- **Order Processing** — Full checkout flow with loading states, confirmation modal, and order summary receipt.
- **Responsive Layout** — Two-panel desktop view collapses to a floating cart button on mobile.
- **Glassmorphism UI** — Backdrop-blur panels, smooth animations, and dark mode support via CSS custom properties.

## Tech Stack

| Package | Version | Role |
|---------|---------|------|
| Next.js | 16 | App Router framework |
| React | 19 | UI library |
| Zustand | 5 | State management |
| Tailwind CSS | 4 | Styling |
| Lucide React | latest | Icons |
| TypeScript | 5 | Type safety |

## Project Structure

```
app/                  # Next.js App Router pages & global styles
components/           # UI components (ProductGrid, CartPanel, modals)
hooks/                # useProducts, usePromoValidation
store/                # Zustand cart store with persistence
services/             # Order creation service
lib/                  # Base API fetch wrapper
types/                # TypeScript interfaces
```

## Quick Start

### 1. Configure Backend URL

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) to view the app.

## API Endpoints

The frontend expects the following endpoints from the NestJS backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products?page=N&limit=8&category=X` | Paginated product listing |
| GET | `/promo/validate/:code` | Validate a promo code |
| POST | `/orders` | Create an order |
