# HL Photography - Client & Portfolio Management Platform

A modern, high-performance web application built for professional photographers to showcase their portfolio and privately deliver albums to clients.

## 🌟 Features

### For the Photographer (Admin Dashboard)
- **Portfolio Management**: Curate the "Best Of" masonry gallery for the homepage.
- **Client Albums**: Create private albums with secure access codes, set expiration dates, and organize subcategories.
- **Global Settings**: Customize studio name, bio, social links, and branding directly from the dashboard.
- **Secure Authentication**: Protected admin routes using Supabase Auth (Google OAuth).
- **Automated Workflows**: Cron jobs to automatically expire old albums and emails sent via Resend.

### For the Client
- **Premium Experience**: Dark-mode masonry layout to view photos in maximum quality.
- **Interactive Gallery**: "Heart" (favorite) photos and view them in a dedicated tab.
- **High-Res Lightbox**: Click any photo to view it full-screen with keyboard navigation.
- **Downloads**: Download individual original-quality photos or get the entire album as a ZIP file (generated client-side to bypass server limits).
- **PWA Support**: Install the gallery as an app on iOS/Android for a native-like experience.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database & Auth**: Supabase (PostgreSQL, Storage, RLS Policies, Google Auth)
- **Styling**: Tailwind CSS + custom CSS variables for easy theming
- **Icons**: Lucide React
- **Email**: Resend
- **Client ZIPs**: JSZip & FileSaver.js

## 🔒 Security Architecture

- **Row Level Security (RLS)**: Strict Supabase policies ensure clients can only read photos from albums they have the code for.
- **Storage Policies**: The `portfolio` bucket is public, while the `albums` bucket requires specific application-level logic linked to the access code.
- **Middleware**: Next.js middleware protects all `/admin` routes.

## 🚀 Deployment

Optimized for deployment on **Vercel** with integrated support for serverless functions, Edge caching, and automated cron jobs via `vercel.json`.
