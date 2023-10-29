import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/monocle/", // reference: https://vitejs.dev/guide/static-deploy.html#github-pages
  plugins: [react()],
  define: {
    PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
  }
})
