import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // next-pwa might cause issues with Turbopack, so we ensure it's fully disabled in dev
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ubdigzqsyiqiktozuafa.supabase.co',
      },
    ],
  },
  turbopack: {},
};

// In development, we can completely bypass the PWA wrapper if it causes Turbopack issues
export default process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);
