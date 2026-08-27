import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // active la PWA aussi en mode dev, pour pouvoir tester tout de suite
        suppressWarnings: true // réduit certains logs
      },
      manifest: {
        name: "Plan'it",
        short_name: "Plan'it",
        description: "Gestion des bénévoles pour le club de badminton",
        theme_color: '#104e64',
        background_color: '#161b27',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],

  preview: {
    allowedHosts: ["coke-pouncing-shaking.ngrok-free.dev"]
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["coke-pouncing-shaking.ngrok-free.dev"]
  }
})