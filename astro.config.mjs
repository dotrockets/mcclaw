import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://dotrockets.space',
  integrations: [
    react(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
  prefetch: true,
  experimental: {
    clientPrerender: true,
  },
});
