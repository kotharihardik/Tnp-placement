import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompitable from "vite-plugin-env-compatible";



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    envCompitable()
  ],
})
