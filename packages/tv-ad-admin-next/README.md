# TV Ad Admin Next

Internal admin dashboard for Mirror TV advertising management system, built with Next.js App Router.

## Tech Stack

| Category         | Technology                                                                  |
| ---------------- | --------------------------------------------------------------------------- |
| Framework        | [Next.js](https://nextjs.org/) 14 (App Router)                              |
| Language         | [TypeScript](https://www.typescriptlang.org/)                               |
| UI Library       | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/)                                    |
| Data Fetching    | [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)        |
| Icons            | [Lucide React](https://lucide.dev/)                                         |
| Auth             | JWT + OTP (Email-based)                                                     |
| Cache            | [Redis](https://redis.io/) (ioredis)                                        |
| Email            | [SendGrid](https://sendgrid.com/) / [Nodemailer](https://nodemailer.com/)   |

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

Create a `.env` file in the package root. For environment variable values, refer to:
[TV Personal Ads - Environment Variables – Dropbox Paper](https://www.dropbox.com/scl/fi/ze7x5ktgd5th0q4rh9bef/.paper?rlkey=9kskffyibcvwsww8r73lf1k27&dl=0)

### Required Variables

| Variable           | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `NEXT_PUBLIC_ENV`  | Environment identifier (`local`/`dev`/`staging`/`prod`) |
| `GQL_ENDPOINT`     | GraphQL API endpoint                                    |
| `JWT_SECRET`       | JWT signing secret                                      |
| `REDIS_URL`        | Redis connection URL (configured by backend)            |
| `SENDGRID_API_KEY` | SendGrid API Key for OTP emails (configured by backend) |

## Project Structure

```text
tv-ad-admin-next/
├── app/                      # Next.js App Router
│   ├── (edit)/               # Route group for edit pages
│   │   ├── edit-request/     # Edit request page
│   │   └── edit-schedule/    # Edit schedule page
│   ├── api/                  # API Routes (Route Handlers)
│   │   ├── auth/             # Authentication endpoints
│   │   ├── dashboard/        # Dashboard data
│   │   ├── edit-request/     # Edit request operations
│   │   ├── list/             # List operations
│   │   ├── member/           # Member operations
│   │   ├── order/            # Order operations
│   │   └── upload/           # Upload operations
│   ├── demo/                 # Component demo page (dev only)
│   ├── list/                 # Order list page
│   ├── login/                # Login page
│   ├── order/                # Order detail page
│   ├── upload/               # Upload page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Dashboard (home page)
│
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── custom-ui/            # Extended/customized UI components
│   ├── shared/               # Shared components across pages
│   ├── dashboard/            # Dashboard-specific components
│   ├── demo/                 # Dev navigation (dev only)
│   ├── edit/                 # Edit page components
│   ├── list/                 # List page components
│   ├── login/                # Login page components
│   ├── order/                # Order page components
│   └── upload/               # Upload page components
│
├── constants/                # Application constants
│   ├── environment-variables.ts  # Environment-based config
│   ├── state/                # Order state definitions
│   └── index.ts              # Re-exports
│
├── graphql/                  # GraphQL operations
│
├── hooks/                    # Custom React hooks
│
├── store/                    # Zustand stores
│   ├── auth.store.ts         # Authentication state
│   └── responsive.store.ts   # Responsive state
│
├── styles/
│   └── globals.css           # Tailwind CSS v4 configuration
│
├── types/                    # TypeScript type definitions
│
├── utils/                    # Utility functions
│   ├── apollo-client.ts      # Apollo Client setup
│   ├── auth.ts               # Authentication utilities
│   ├── cn.ts                 # Class name utility (clsx + tailwind-merge)
│   ├── date.ts               # Date formatting utilities
│   ├── error-handler.ts      # Error handling utilities
│   ├── redis-client.ts       # Redis client setup
│   └── ...                   # Other utilities
│
├── middleware.ts             # Next.js middleware (auth protection)
└── public/                   # Static assets
    └── icons/                # SVG icons
```

## Tailwind CSS v4 Configuration

> **Important**: This project uses **Tailwind CSS v4**, which configures styles in `styles/globals.css` using CSS-native syntax instead of `tailwind.config.js`.
> **重要**：此專案使用 Tailwind CSS v4，樣式設定位於 styles/globals.css，採用原生 CSS 語法，而非使用 tailwind.config.js。

### Design Tokens

The project defines comprehensive design tokens:

- **Colors**: Gray, Red, Blue, Green, Yellow (1-10 scale), Brand colors
- **Semantic Colors**: `text-primary`, `text-secondary`, `fill-primary`, `border-default`, etc.
- **Spacing**: `xs` (2px) to `6xl` (60px)
- **Border Radius**: `xs` (4px) to `xl` (24px)
- **Typography**: `h1`-`h6`, `body1`, `body2`, `caption1`, `caption2`
- **Breakpoints**: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px), `xxl` (1400px)

### Usage Examples

```tsx
// Using design tokens
<div className="bg-surface-secondary text-text-primary p-xl rounded-md">
  <h2 className="typography-h2">Title</h2>
  <p className="text-text-secondary">Description</p>
</div>

// Using brand colors
<Button className="bg-brand-primary hover:bg-brand-hover">
  Submit
</Button>
```

## UI Components

- `components/ui/` — Base UI components from shadcn/ui, customized for this project.
- `components/custom-ui/` — Extended components built on top of base UI for project-specific needs.

For detailed guidance on using Radix UI's `<Slot>` component and `asChild` pattern, see [radix-slot-guide.md](./radix-slot-guide.md).

## Authentication Flow

1. User enters email → OTP sent via SendGrid
2. User verifies OTP → JWT token issued
3. First-time users complete identity verification
4. JWT stored in `auth_token` cookie
5. Middleware protects all routes except `/login` and auth APIs

Protected routes are defined in `middleware.ts`.

## Development Tools

### Component Demo Page

Visit `/demo` (only available in `local` and `dev` environments) to preview UI components.

### Dev Navigation

A floating navigation bar appears at the bottom of the screen in `local` and `dev` environments, providing quick links to static pages (Demo, Dashboard, Upload, List). Pages requiring dynamic parameters (e.g., `/order/[orderNumber]`) are not included.

Location: `components/demo/dev-navigation.tsx`

## Code Style & Conventions

### VS Code Settings

The workspace includes VS Code settings (`.vscode/settings.json`) that automatically format code on save:

- **Auto-format on save**: Prettier as default formatter
- **Import sorting**: ESLint auto-fixes import order
- **Tailwind class sorting**: ESLint auto-sorts Tailwind CSS class names

> 工作區已設定 VS Code 自動儲存時格式化，包含 import 排序與 Tailwind class name 排序。

### Class Name Utility

Use the `cn()` utility for conditional class names:

```tsx
import { cn } from '@/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-class'
)}>
```

### Import Aliases

Path aliases are configured in `tsconfig.json`:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import { ENV } from '@/constants/environment-variables'
```

### Component Patterns

```tsx
// Client component (for hooks, interactivity)
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function MyComponent() {
  const [state, setState] = useState(false)
  return <Button onClick={() => setState(true)}>Click</Button>
}
```

## GraphQL

Apollo Client is configured in `utils/apollo-client.ts` with:

- Server-side GCP authentication (ID Token)
- File upload support (`apollo-upload-client`)
- No-cache policy by default

```tsx
import { getClient } from '@/utils/apollo-client'
import { GET_ORDERS } from '@/graphql/queries/orders'

const client = getClient()
const { data } = await client.query({ query: GET_ORDERS })
```

## Local Development

Local development requires a running Docker container (Redis) to support backend services.
The specific startup commands and configuration steps are documented in the environment variables guide above.

本地開發需要一個運行中的 Docker 容器 (Redis) 以支援後端服務。
具體的啟動指令與配置步驟記錄在上方的環境變數指南中。

Ensure the container is active before executing the development server commands.

在執行開發伺服器指令之前，請確保容器已處於活動狀態。

## Migration Notes

This project was migrated from `mnews-personal-ads` (Vite + React Router) to Next.js App Router within the Tabris monorepo.

## Related Documentation

- [tv-ad-admin-next 個人廣告 (Tabris)](https://www.dropbox.com/scl/fi/tocut1vb930se9pjtsh7j/tv-ad-admin-next-Tabris.paper?rlkey=38o9piaw03ft3fjmhclbu83ox&dl=0)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
