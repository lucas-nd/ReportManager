import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['report-manager.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Report Manager',
        short_name: 'Report Manager',
        description: 'Gestão de serviços técnicos em campo.',
        display: 'standalone',
        start_url: '/',
        background_color: '#f4f1e8',
        theme_color: '#153c3a',
        icons: [
          {
            src: 'report-manager.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,html,js,svg,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
