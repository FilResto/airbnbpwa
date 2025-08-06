import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Airbnb PWA',
        short_name: 'Airbnb',
        description: 'Airbnb Progressive Web App',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // 🌐 Configurazione per accesso da rete locale
  server: {
    host: '0.0.0.0',  // Espone su tutte le interfacce di rete
    port: 3000,       // Porta più comune e accessibile
    strictPort: false  // Permette di usare una porta alternativa se occupata
  }
})
