import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// PWA configuration - This will only contain general PWA options, not strategy-specific ones
import type { VitePWAOptions } from 'vite-plugin-pwa';

const generalPwaOptions: Partial<VitePWAOptions> = {
  includeAssets: [
    'favicon.ico',
    'apple-touch-icon.png',
    'safari-pinned-tab.svg',
    'robots.txt',
    '*.webp',
    '*.png',
    '*.svg',
    '*.woff2'
  ],
  manifest: {
    name: 'Heritage Bakes',
    short_name: 'Bakes',
    description: 'Your personal recipe collection',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  },
  workbox: {
    sourcemap: true,
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.example\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'assets-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
  devOptions: {
    enabled: process.env.NODE_ENV === 'development',
    type: 'module',
    navigateFallback: 'index.html',
    suppressWarnings: true
  },
  registerType: 'autoUpdate',
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      ...generalPwaOptions,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    preserveSymlinks: true,
  },
  root: path.resolve(import.meta.dirname, "../client"), // Vite project root is 'client/'
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ['react/jsx-runtime'],
    },
  },
  publicDir: false, // Explicitly disable public directory processing to avoid conflicts with service worker path resolution
}));
