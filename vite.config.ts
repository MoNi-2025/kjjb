import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use relative base path for GitHub Pages compatibility
  base: './',
  define: {
    // Ensure process.env.API_KEY is available in build if needed, 
    // or rely on manual env setup in the deployment environment.
    'process.env': process.env
  }
})
