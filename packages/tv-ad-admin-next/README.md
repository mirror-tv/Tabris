# TV Ad Admin Next

A Next.js based internal admin project for Mirror TV advertising management system.

## Tech Stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Radix UI](https://www.radix-ui.com/) (UI Components)
- [Lucide React](https://lucide.dev/) (Icons)

## Requirements

- **Node.js**: `>=18.18.0`
- **Package manager**: [yarn](https://yarnpkg.com/) (managed by monorepo)

## Getting Started

```bash
# Install dependencies (from monorepo root)
yarn install

# Start development server
yarn workspace tv-ad-admin-next dev

# Build for production
yarn workspace tv-ad-admin-next build

# Start production server
yarn workspace tv-ad-admin-next start

# Lint check
yarn workspace tv-ad-admin-next lint
```

## Environment Variables

Create a `.env.local` file in the package root:

```env
NEXT_PUBLIC_ENV=dev
```

## Project Structure

```text
tv-ad-admin-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── pages/             # Page components
│   ├── ui/                # UI components
│   └── shared/            # Shared components
├── lib/                   # Utility functions
├── styles/                # Global styles
└── public/                # Static assets
```

## Migration Notes

This project was migrated from `mnews-personal-ads` (Vite + React Router) to Next.js App Router within the Tabris monorepo.
