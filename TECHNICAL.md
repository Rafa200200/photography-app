# HL Photography — Technical Case Study

> Full-stack photography platform built for a professional photographer. Real-time admin panel, private client galleries with PIN access, and a premium dark-mode portfolio site.

**Live URL**: [hugo-photography-omega.vercel.app](https://hugo-photography-omega.vercel.app)  
**Repository**: [github.com/Rafa200200/photography-app](https://github.com/Rafa200200/photography-app)  
**Development Period**: March 2026  
**Developer**: Rafael Lourenço

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | SSR/SSG, API routes, middleware |
| **Language** | TypeScript | Type safety across full stack |
| **Styling** | Tailwind CSS 4 | Utility-first, custom design system |
| **Database** | Supabase (PostgreSQL) | Relational data, RLS policies |
| **Auth** | Supabase Auth + Google OAuth 2.0 | Admin login via Google, session management |
| **Storage** | Supabase Storage | Photo hosting (2 public buckets) |
| **Email** | Resend API | Transactional emails to clients |
| **Deployment** | Vercel | Auto-deploy from GitHub, edge functions |
| **Icons** | Lucide React | Consistent, lightweight icon set |
| **ZIP Downloads** | JSZip + FileSaver.js | Client-side batch photo downloads |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      VERCEL (Edge)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Middleware   │  │   App Router │  │  API Routes  │  │
│  │ (Auth Guard)  │  │  (SSR Pages) │  │  (REST API)  │  │
│  │ Email whitelist│ │              │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         │    ┌────────────┴──────────────┐   │          │
│         │    │      Supabase SSR Client  │   │          │
│         │    │       (anon key — reads)  │   │          │
│         │    └────────────┬──────────────┘   │          │
│         │                 │      ┌───────────┘          │
│         │                 │      │ service_role key      │
│         │                 │      │ (bypasses RLS)        │
└─────────┼─────────────────┼──────┼──────────────────────┘
          │                 │      │
          ▼                 ▼      ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth        │  │  PostgreSQL  │  │   Storage    │  │
│  │ Google OAuth  │  │  + RLS       │  │  2 Buckets   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

5 tables with full Row Level Security (RLS):

```sql
photographers     → id, auth_id, name, email, logo_url, profile_image_url, bio, social_links
albums            → id, photographer_id, name, code (8-char PIN), client_name, client_email, status, expires_at
album_categories  → id, album_id, name, sort_order
photos            → id, album_id, category_id, storage_path, original_filename, width, height, size_bytes
portfolio_photos  → id, photographer_id, storage_path, title, category, width, height, sort_order
favorites         → id, photo_id, album_id, client_identifier (anonymous fingerprint)
```

**Storage Buckets**: `portfolio` (homepage gallery) and `albums` (client photos), both public-read with authenticated-write policies.

---

## Features Implemented

### Public Homepage
- **Hero Section** — Full-viewport with cinematic background slideshow (7s cycle, 3s crossfade), portfolio photos rotating behind extralight typography
- **Portfolio Gallery** — Masonry grid with text-only category filters, 1000ms slow-zoom hover, click-to-open lightbox with keyboard navigation
- **About Section** — Dynamic bio and profile photo from database
- **Contact Section** — Email, Instagram, Facebook links from database
- **Ultra-Premium Dark Mode** — Custom zinc-950 palette, glassmorphism navbar, cinematographic transitions

### Admin Panel
- **Google OAuth Login** — Restricted to whitelisted emails via `ADMIN_EMAILS` env var
- **Dashboard** — Real-time counters (active albums, total photos, portfolio photos)
- **Portfolio Manager** — Upload multiple photos, assign categories, edit/delete
- **Album Manager** — Create albums, set client info, auto-generate 8-char PIN codes
- **Photo Upload** — Bulk HD upload with progress counter, direct to Supabase Storage
- **Album Settings** — Edit name, client info, regenerate PIN (revokes old access), change status
- **Email Integration** — Send gallery link + PIN to client via Resend API
- **Global Settings** — Edit photographer name, bio, logo, profile photo, social links

### Client Gallery
- **PIN-Based Access** — 8-character code, no account required
- **Full-Screen Lightbox** — Keyboard navigation (←/→/Esc), touch-friendly
- **Favorites System** — Heart photos anonymously (IP+UA fingerprint), persisted server-side
- **Individual Download** — Download any single photo at full resolution
- **Bulk ZIP Download** — Client-side ZIP generation with JSZip + FileSaver.js
- **Auto-Expiration** — Albums expire after 3 months via Vercel Cron Job

---

## Security Architecture

### Authentication & Authorization
| Layer | Mechanism | Scope |
|---|---|---|
| **Middleware** | Email whitelist (`ADMIN_EMAILS`) | All `/admin/*` routes |
| **API Routes** | `verifyAdmin()` server-side check | `/api/photos`, `/api/send-email` |
| **Cron Job** | Bearer token (`CRON_SECRET`) | `/api/cron/expire` |
| **Auth Callback** | Redirect path whitelist | `/auth/callback` (prevents open redirect) |

### Database Security (RLS)
| Table | SELECT | INSERT/UPDATE/DELETE |
|---|---|---|
| `photographers` | Public | Authenticated only |
| `albums` | Public | Authenticated only |
| `album_categories` | Public | Authenticated only |
| `photos` | Public | Authenticated only |
| `portfolio_photos` | Public | Authenticated only |
| `favorites` | Public | Public (anonymous hearts) |

### Key Separation
- **`NEXT_PUBLIC_*` (anon key)** — Used by SSR components for reads, respects RLS
- **`SUPABASE_SERVICE_ROLE_KEY`** — Used by API routes only, bypasses RLS for writes
- **Secret keys** — Never committed to Git (`.env` in `.gitignore`)

---

## API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/photos` | POST | Admin | Insert photo record in database |
| `/api/photos` | DELETE | Admin | Delete photo from storage + database |
| `/api/send-email` | POST | Admin | Send gallery email via Resend |
| `/api/favorites` | POST | None | Toggle photo favorite (anonymous) |
| `/api/cron/expire` | GET | CRON_SECRET | Auto-expire albums past 3 months |

---

## Deployment

### Infrastructure
- **Vercel** — Zero-config Next.js hosting with auto-deploy from GitHub `main` branch
- **Supabase** — Managed PostgreSQL + Auth + Storage (EU-West region)
- **GitHub** — Source control with `main` (production) and `dev` (staging) branches

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL        → Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   → Public API key (RLS-restricted)
SUPABASE_SERVICE_ROLE_KEY       → Server-only admin key
RESEND_API_KEY                  → Email service API key
NEXT_PUBLIC_SITE_URL            → Production URL for OAuth redirects
ADMIN_EMAILS                    → Comma-separated admin email whitelist
CRON_SECRET                     → Bearer token for cron job auth
```

### CI/CD Workflow
```
dev branch → Push → Vercel Preview Deploy → Test → Merge to main → Vercel Production Deploy
```

---

## Design System

| Element | Implementation |
|---|---|
| Background | `#09090b` (zinc-950) |
| Text Primary | `#fafafa` (zinc-50) |
| Text Secondary | `text-zinc-400` |
| Accent | `#d4af37` (gold) |
| Borders | `border-white/5` (near invisible) |
| Fonts | Inter (body), Playfair Display (display) |
| Headings | `font-extralight tracking-[0.2em] uppercase` |
| Paragraphs | `font-light leading-loose` |
| Photo Hover | `transition-transform duration-[1000ms] group-hover:scale-105` |
| Navbar Glass | `bg-black/60 backdrop-blur-xl border-white/4` |
| Buttons | Text-only with `transition-colors duration-500` |

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    → Dashboard
│   │   ├── albums/
│   │   │   ├── page.tsx                → Album list
│   │   │   ├── new/page.tsx            → Create album
│   │   │   └── [id]/
│   │   │       ├── page.tsx            → Album detail + photos
│   │   │       ├── AlbumPhotoManager   → Photo upload/delete
│   │   │       └── settings/page.tsx   → Album settings
│   │   ├── portfolio/page.tsx          → Portfolio manager
│   │   ├── settings/                   → Global settings
│   │   └── login/LoginForm.tsx         → Google OAuth + Magic Link
│   ├── album/[code]/                   → Client gallery (PIN access)
│   ├── api/
│   │   ├── photos/route.ts            → Photo CRUD (auth guarded)
│   │   ├── send-email/route.ts        → Email sending (auth guarded)
│   │   ├── favorites/route.ts         → Favorites toggle
│   │   └── cron/expire/route.ts       → Auto-expire albums
│   ├── auth/callback/route.ts         → OAuth callback (redirect whitelist)
│   ├── HomeClient.tsx                  → Homepage orchestrator
│   └── globals.css                     → Design system + animations
├── components/
│   ├── home/       → Hero, AboutSection, ContactSection
│   ├── gallery/    → MasonryGrid, Lightbox
│   ├── layout/     → Navbar, Footer, AdminSidebar
│   └── ui/         → SafeImage (error-tolerant image component)
├── lib/
│   ├── supabase/   → client.ts, server.ts, middleware.ts, queries.ts
│   ├── constants.ts
│   └── utils.ts
├── middleware.ts    → Auth guard + email whitelist
└── types/index.ts  → TypeScript interfaces
```

---

## Key Technical Decisions

1. **App Router over Pages Router** — Leverages React Server Components for data fetching at the edge, reducing client-side JS bundle
2. **Supabase over Firebase** — PostgreSQL with RLS provides more granular security than Firestore rules, plus native JOIN support
3. **Service Role in API Routes** — Keeps admin writes secure server-side while allowing the frontend to use the restricted anon key
4. **Client-side ZIP** — Uses JSZip to generate downloads in the browser, avoiding server load for batch exports
5. **Anonymous Favorites** — IP+UserAgent fingerprint allows clients to heart photos without creating accounts
6. **Middleware Email Whitelist** — Decouples authorization from Supabase Auth, allowing fine-grained admin control through an env var

---

*Built with Next.js 16, Supabase, Tailwind CSS, and deployed on Vercel.*
