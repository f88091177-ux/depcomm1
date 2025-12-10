import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement
  const env = loadEnv(mode, '.', '');
  
  // Récupération du port dynamique (Requis pour Render/Heroku/etc)
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env': {}
    },
    // Configuration serveur pour le développement local
    server: {
      host: true, // Écoute sur 0.0.0.0 (toutes les IPs)
      port: port
    },
    // Configuration preview pour la production (npm run start/preview)
    preview: {
      host: true, // Écoute sur 0.0.0.0 (CRITIQUE pour le déploiement)
      port: port,
      allowedHosts: true // Autorise tous les hôtes (évite les blocages de sécurité sur le cloud)
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              return 'vendor-utils';
            }
          }
        }
      }
    }
  }
})