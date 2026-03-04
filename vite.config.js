import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // split vendor libs into their own chunks — keeps the main bundle smaller
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-recharts': ['recharts'],
          'vendor-forms':   ['react-hook-form'],
          'vendor-export':  ['jspdf', 'jspdf-autotable', 'papaparse'],
        },
      },
    },
  },
})
