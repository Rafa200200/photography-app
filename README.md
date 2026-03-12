<div align="center">

# 📷 HL Photography

**Plataforma de Portfólio & Gestão de Álbuns Privados para Fotógrafos**

Aplicação web profissional que combina um portfólio público cinematográfico com um sistema privado de entrega de álbuns a clientes, com galeria interativa, favoritos e downloads em ZIP.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>

---

## 📋 Índice

- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades — Fotógrafo (Admin)](#-funcionalidades--fotógrafo-admin)
- [Funcionalidades — Cliente](#-funcionalidades--cliente)
- [Fluxo de Autenticação](#-fluxo-de-autenticação)
- [Base de Dados](#-base-de-dados)
- [Mapa de Rotas](#️-mapa-de-rotas)
- [Segurança](#-segurança)
- [PWA & Performance](#-pwa--performance)
- [Deploy](#-deploy)
- [Configuração Local](#-configuração-local)

---

## 🏗 Arquitetura do Sistema

> Visão geral do fluxo da aplicação, desde o browser até à base de dados.

```mermaid
flowchart TB
    Browser["🖥️ Browser / PWA"]
    Vercel["▲ Vercel\n(Edge + Serverless)"]
    MW["🔐 Middleware\nAuth guard · Session refresh"]
    RSC["📄 Server Components\nSSR + Data Fetching"]
    CC["⚡ Client Components\nInteractive UI"]
    API["🔌 API Routes\nPhotos · Email · Cron"]
    SB["🗄️ Supabase\nPostgreSQL · Auth · Storage"]

    Browser -->|HTTPS| Vercel
    Vercel --> MW
    MW --> RSC
    MW --> CC
    RSC -->|Server-side| SB
    CC -->|Client-side| SB
    API -->|Service Role| SB
```

---

## 🛠 Stack Tecnológica

```mermaid
graph LR
    subgraph Frontend
        A["Next.js 16\n(App Router)"] --> B["React 19\n(Server + Client)"]
        B --> C["Tailwind CSS 4\n(Dark-first UI)"]
        C --> D["Lucide React\n(Ícones)"]
    end

    subgraph Backend
        E["Supabase Auth\n(Google OAuth)"] --> F["PostgreSQL\n(RLS Policies)"]
        F --> G["Supabase Storage\n(Fotos)"]
        G --> H["Resend\n(Emails)"]
    end

    subgraph Tooling
        I["TypeScript 5"] --> J["Turbopack\n(Dev Server)"]
        J --> K["ESLint 9"] --> L["PWA\n(@ducanh2912)"]
    end
```

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Framework** | Next.js 16.1 (App Router + Turbopack) | SSR, SSG, API Routes, Middleware |
| **UI** | React 19, Tailwind CSS 4, Lucide | Interface cinematográfica dark-mode |
| **Tipografia** | Inter + Playfair Display + Great Vibes | UI / Display / Script fontes |
| **Database** | Supabase PostgreSQL + RLS | Dados + Políticas de segurança |
| **Auth** | Supabase Auth (Google OAuth) | Autenticação admin |
| **Storage** | Supabase Storage (2 buckets) | `portfolio` (público) + `albums` (privado) |
| **Email** | Resend | Envio de credenciais aos clientes |
| **Downloads** | JSZip + FileSaver.js | Download ZIP client-side |
| **PWA** | @ducanh2912/next-pwa | Instalável em iOS/Android |
| **Analytics** | @vercel/analytics | Métricas de utilização |
| **Deploy** | Vercel | Edge + Serverless + Cron Jobs |

---

## 🎯 Funcionalidades — Fotógrafo (Admin)

### 📊 Dashboard
- Resumo com álbuns ativos, total de fotos em álbuns e fotos no portfólio
- Saudação personalizada com nome do utilizador autenticado

### 🖼️ Gestão de Portfólio
- Upload múltiplo de fotos (até 10MB cada, JPEG/PNG/WebP)
- Categorização automática (Casamentos, Retratos, Editorial, etc.)
- Seleção em bulk para apagar ou reclassificar em massa
- Galeria masonry responsiva na homepage (limitada a 12 fotos)

### 📁 Álbuns de Clientes
- Criação de álbuns privados com código de acesso alfanumérico de 8 caracteres
- Gestão de subcategorias dentro de cada álbum
- Data de validade automática (3 meses por defeito, personalizável)
- Upload de fotos com organização por categorias
- Cron job automático para expirar álbuns antigos

### ✉️ Envio de Credenciais por Email
- Envio automático via Resend com template HTML profissional
- Email inclui: nome do cliente, link direto para a galeria e código de acesso
- Proteção: apenas admins autenticados podem enviar emails

### ⚙️ Configurações Globais
- Nome do estúdio, título no hero, tagline/slogan
- Texto na navbar (personalizável separadamente)
- Biografia completa para a secção "Sobre Mim"
- Upload de logótipo e foto de perfil
- Redes sociais: Instagram, Facebook, Email

---

## 👤 Funcionalidades — Cliente

### 🎨 Experiência Premium
- Layout totalmente dark-mode com estética cinematográfica
- Galeria masonry com hover effects e lazy loading
- Fotos apresentadas em máxima qualidade

### ❤️ Favoritos
- Sistema de "Heart" para marcar fotos favoritas
- Tab dedicada para ver apenas os favoritos
- Persistência por sessão/dispositivo (via IP hash)

### 🔍 Lightbox Full-Screen
- Visualização de fotos em ecrã completo
- Navegação por teclado (←/→) e swipe em mobile
- Transições suaves cinematográficas

### 📥 Downloads
- Download individual de fotos em qualidade original
- Download do álbum completo como ZIP (gerado client-side via JSZip)
- Sem limites de servidor — o ZIP é construído no browser

### 📱 PWA
- Instalável como app nativa em iOS e Android
- Ícones configurados (192x192 e 512x512)
- Modo standalone com tema preto

---

## 🔐 Fluxo de Autenticação

```mermaid
sequenceDiagram
    actor Admin
    participant Login as /admin/login
    participant Supabase as Supabase Auth
    participant Google as Google OAuth
    participant MW as Middleware
    participant Dashboard as /admin

    Admin->>Login: Acede ao painel
    Login->>Supabase: signInWithOAuth('google')
    Supabase->>Google: Redirect para Google
    Google-->>Supabase: Token OAuth
    Supabase-->>Login: Redirect /auth/callback
    Note over Login: Callback valida token<br/>e redireciona para /admin
    Admin->>Dashboard: Acede ao dashboard
    MW->>MW: updateSession() em cada request
    MW-->>Dashboard: Sessão válida ✓
```

> [!TIP]
> O sistema usa **Google OAuth exclusivo** — sem passwords para gerir. O callback possui whitelist de redirects para prevenir ataques de Open Redirect.

---

## 🗄 Base de Dados

```mermaid
erDiagram
    PHOTOGRAPHERS {
        uuid id PK
        uuid auth_id FK
        text name
        text navbar_title
        text hero_title
        text tagline
        text bio
        text logo_url
        text profile_image_url
        jsonb social_links
    }

    ALBUMS {
        uuid id PK
        uuid photographer_id FK
        text name
        text client_name
        text client_email
        varchar code "8 chars"
        text status "active|expired"
        boolean watermark_enabled
        timestamptz expires_at
    }

    ALBUM_CATEGORIES {
        uuid id PK
        uuid album_id FK
        text name
        int sort_order
    }

    PHOTOS {
        uuid id PK
        uuid album_id FK
        uuid category_id FK
        text storage_path
        text title
        int sort_order
    }

    PORTFOLIO_PHOTOS {
        uuid id PK
        text storage_path
        text title
        text category
        int width
        int height
        int sort_order
    }

    PHOTO_FAVORITES {
        uuid id PK
        uuid photo_id FK
        text client_identifier "IP hash"
    }

    PHOTOGRAPHERS ||--o{ ALBUMS : "cria"
    ALBUMS ||--o{ ALBUM_CATEGORIES : "tem"
    ALBUMS ||--o{ PHOTOS : "contém"
    ALBUM_CATEGORIES ||--o{ PHOTOS : "organiza"
    PHOTOS ||--o{ PHOTO_FAVORITES : "recebe"
```

### Storage Buckets

| Bucket | Acesso | Conteúdo |
|--------|--------|----------|
| `portfolio` | 🌍 Público | Fotos do portfólio (homepage) |
| `albums` | 🔒 Privado | Fotos de clientes (acesso via código) |

---

## 🗺️ Mapa de Rotas

```mermaid
graph TD
    subgraph "Público"
        HOME["/ — Homepage\nHero + Portfólio + Sobre + Contactos"]
        PORT["/portfolio — Portfólio Completo\nGaleria masonry sem limite"]
        ALBUM["/album/[code] — Galeria do Cliente\nAcesso via código privado"]
    end

    subgraph "Admin"
        LOGIN["/admin/login — Login\nGoogle OAuth"]
        DASH["/admin — Dashboard\nEstatísticas gerais"]
        ALBUMS["/admin/albums — Álbuns\nListagem + CRUD"]
        ALBUM_DET["/admin/albums/[id] — Detalhes\nGestão de fotos + categorias"]
        ALBUM_SET["/admin/albums/[id]/settings — Config\nValidade + watermark"]
        ALBUM_NEW["/admin/albums/new — Novo Álbum\nCriação com código auto"]
        PORTFOLIO["/admin/portfolio — Portfólio\nUpload + categorias + bulk"]
        SETTINGS["/admin/settings — Configurações\nBranding + social + bio"]
    end

    subgraph "API"
        PHOTOS_API["/api/photos — CRUD Fotos\nUpload + Delete (admin only)"]
        EMAIL_API["/api/send-email — Envio Email\nCredenciais via Resend"]
        CRON["/api/cron/expire-albums — Cron\nExpira álbuns automaticamente"]
        CALLBACK["/auth/callback — OAuth\nValidação + redirect seguro"]
    end

    HOME --> PORT
    LOGIN --> DASH
    DASH --> ALBUMS
    DASH --> PORTFOLIO
    DASH --> SETTINGS
    ALBUMS --> ALBUM_DET
    ALBUMS --> ALBUM_NEW
    ALBUM_DET --> ALBUM_SET
```

---

## 🔒 Segurança

```mermaid
flowchart LR
    subgraph "Camadas de Proteção"
        A["🛡️ Middleware\nProtege /admin/*"] --> B["🔑 Google OAuth\nSem passwords"]
        B --> C["🗄️ RLS Policies\nRow Level Security"]
        C --> D["📦 Storage Policies\nBuckets separados"]
        D --> E["🔐 Service Role\nAPIs server-only"]
        E --> F["🚫 Redirect Whitelist\nAnti Open Redirect"]
    end
```

| Mecanismo | Implementação |
|-----------|--------------|
| **Middleware** | Protege todas as rotas `/admin/*` — redireciona para login se não autenticado |
| **Google OAuth** | Autenticação via Supabase Auth — sem formulários de password |
| **Row Level Security** | Políticas Supabase garantem que clientes só acedem fotos com o código correto |
| **Storage Policies** | Bucket `portfolio` público, bucket `albums` requer lógica de acesso |
| **Service Role** | API Routes usam `SUPABASE_SERVICE_ROLE_KEY` apenas server-side |
| **Redirect Whitelist** | Callback OAuth valida paths contra whitelist: `/admin`, `/admin/login`, `/` |
| **Códigos Alfanuméricos** | Caracteres confusos removidos (O/0/I/1) — 8 chars uppercase |

---

## 📱 PWA & Performance

| Funcionalidade | Detalhe |
|---------------|---------|
| **Instalável** | Manifesto PWA com ícones 192x192 e 512x512 |
| **Standalone** | Abre como app nativa sem barra do browser |
| **Tema** | Background e theme color `#000000` |
| **Turbopack** | Dev server com HMR ultra-rápido |
| **Image Optimization** | Next.js Image com remote patterns Supabase + Unsplash |
| **Lazy Loading** | Fotos carregadas sob demanda na galeria masonry |
| **Client-side ZIP** | JSZip gera downloads sem sobrecarregar o servidor |
| **Analytics** | @vercel/analytics integrado |

---

## 🚀 Deploy

> Optimizado para deploy no **Vercel** com suporte integrado para serverless functions, Edge caching e cron jobs automatizados.

```mermaid
flowchart LR
    GH["📦 GitHub\nmain branch"] -->|Auto Deploy| VER["▲ Vercel\nBuild + Deploy"]
    VER --> EDGE["🌐 Edge Network\nCDN Global"]
    VER --> SRVL["⚡ Serverless\nAPI Routes"]
    VER --> CRON["⏰ Cron Jobs\nvercel.json"]
    SRVL --> SB["🗄️ Supabase\nPostgreSQL + Storage"]
    CRON --> SB
```

### Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Email
RESEND_API_KEY=re_xxxxx
```

---

## ⚙️ Configuração Local

```bash
# 1. Clonar o repositório
git clone https://github.com/Rafa200200/photography-app.git
cd photography-app

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher com as credenciais Supabase e Resend

# 4. Iniciar em modo desenvolvimento
npm run dev
```

> [!TIP]
> O Turbopack está ativo por defeito no modo desenvolvimento, proporcionando HMR praticamente instantâneo. A PWA é desativada automaticamente em dev para evitar conflitos.

---

## 🧩 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                    # Homepage (SSR → HomeClient)
│   ├── HomeClient.tsx              # Client wrapper com Navbar + Hero + Galeria + Footer
│   ├── layout.tsx                  # Root Layout (fontes + metadata dinâmica)
│   ├── manifest.ts                 # PWA Manifest
│   ├── globals.css                 # Tailwind + animações cinematográficas
│   ├── portfolio/                  # Portfólio completo (pág. dedicada)
│   ├── album/[code]/               # Galeria privada do cliente
│   ├── auth/callback/              # OAuth callback handler
│   ├── api/
│   │   ├── photos/                 # CRUD de fotos (admin only)
│   │   ├── send-email/             # Envio de credenciais via Resend
│   │   └── cron/expire-albums/     # Cron job de expiração
│   └── admin/
│       ├── layout.tsx              # Admin layout com sidebar
│       ├── page.tsx                # Dashboard com estatísticas
│       ├── login/                  # Login com Google OAuth
│       ├── albums/                 # CRUD de álbuns + detalhes + settings
│       ├── portfolio/              # Gestão do portfólio público
│       └── settings/               # Configurações globais
├── components/
│   ├── home/                       # Hero, AboutSection, ContactSection, ClientAccessModal
│   ├── gallery/                    # MasonryGrid, Lightbox
│   ├── layout/                     # Navbar, Footer, AdminSidebar
│   └── ui/                         # SafeImage, componentes reutilizáveis
└── lib/
    ├── constants.ts                # Config fallback + placeholder photos
    ├── utils.ts                    # generateAlbumCode, formatBytes
    └── supabase/
        ├── client.ts               # Supabase browser client
        ├── server.ts               # Supabase server client
        ├── middleware.ts            # Session refresh middleware
        └── queries.ts              # getGlobalConfig, getPortfolioPhotos
```

---

## 🎨 Design System

| Elemento | Valor |
|----------|-------|
| **Tema** | Dark-first (`html.dark`) |
| **Background** | `#09090b` (zinc-950) |
| **Accent** | Configurável via CSS variables |
| **Fonte Display** | Playfair Display (títulos elegantes) |
| **Fonte Body** | Inter (UI clean) |
| **Fonte Script** | Great Vibes (assinatura do fotógrafo) |
| **Animações** | fadeInUp, fadeIn, scaleIn, slideDown — timings cinematográficos |
| **Scrollbar** | Minimalista 4px, transparente |
| **Glass Effect** | `backdrop-blur` na navbar ao scroll |

---

<div align="center">

**Desenvolvido com** ❤️ **usando Next.js 16, React 19, Supabase e Tailwind CSS 4**

</div>
