# Next.js Application Scaffold & Conventions: ILIS

## 1. Clean Folder Structure (App Router)
This structure strictly separates UI, business logic, authentications, and the intelligence layers.

```text
c:\Users\Prais\projects\ilis\
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── (auth)/             # Route Group: Login, SSO, Callback
│   │   │   ├── login/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (dashboards)/       # Route Group: Protected UI
│   │   │   ├── admin/          # Admin Heatmap & Command Center
│   │   │   ├── innovator/      # My Portfolio & Uploads
│   │   │   └── evaluator/      # Blind Scoring Terminal
│   │   ├── api/                # Next.js Route Handlers (BFF)
│   │   ├── layout.tsx          # Root Server Layout (Providers/Fonts)
│   │   └── page.tsx            # Public Landing or Redirect
│   ├── components/             # Reusable UI Architecture
│   │   ├── ui/                 # Dumb components (Buttons, Inputs - shadcn)
│   │   ├── charts/             # Data Vis (Recharts/D3 panels)
│   │   ├── shared/             # Components used across roles (StatusBadge)
│   │   └── forms/              # react-hook-form + zod templates
│   ├── lib/                    # Configuration & Utilities
│   │   ├── supabase/           # Supabase Clients (Server vs Browser)
│   │   ├── utils.ts            # Tailwind generic `cn` merge function
│   │   └── constants.ts        # Enums, Stage definitions, Role types
│   ├── services/               # Data Access Object (DAO) Layer
│   │   ├── projects.ts         # Supabase specific DB calls
│   │   └── intelligence.ts     # Edge Function trigger calls
│   └── types/                  # Global TS interfaces generated from PostgreSQL
├── supabase/                   # Supabase local config & Edge Functions
├── public/                     # Static assets (Logos)
├── tailwind.config.ts          # Extended "Signal" color palette
└── middleware.ts               # Edge middleware for route protection
```

## 2. Naming Conventions & Patterns
*   **Files & Folders:** `kebab-case` for all folder names and routing files (e.g., `project-tracker`, `layout.tsx`).
*   **React Components:** `PascalCase` for components (e.g., `SignalBadge.tsx`, `HeatmapNode.tsx`).
*   **Server Actions/Services:** `camelCase` for functions mutating data (e.g., `submitProjectIntake.ts`).
*   **Next.js Directives:** By default, every file in `src/app/` is a Server Component. Only use `"use client"` when state (`useState`), effects (`useEffect`), or browser APIs (like Recharts) are strictly required. Pushing interactivity down the tree keeps the dashboard lightning fast.

## 3. Core Setup Files

### A. Tailwind CSS Configuration (`tailwind.config.ts`)
We implement the "Institutional Cybernetics" theme here.
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0E", // Deep Space Base
        surface: "#12121A", // Elevated Panel
        signal: {
          healthy: "#00E676", // TRL Growth
          alert: "#FFC107", // Nudge/Warning
          stagnant: "#FF1744", // Kill Risk
          intel: "#00B0FF", // AI Recommendation
        },
        text: {
          primary: "#FFFFFF",
          muted: "#8F929F",
        }
      },
      fontFamily: {
        interface: ["var(--font-inter)", "sans-serif"],
        data: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

### B. Root Layout (`src/app/layout.tsx`)
Initializes the fonts and global layout structure.
```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'ILIS | Innovation Command Center',
  description: 'CUT Innovation Lifecycle Intelligence System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-interface bg-background text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

## 4. Secure Auth Foundation (Supabase)

### A. Edge Middleware (`middleware.ts`)
This ensures no unauthenticated user can hit `/admin` or `/innovator`.
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Strict route protection
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Future Logic: Fetch profile role, and redirect to specific /innovator or /admin
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```
