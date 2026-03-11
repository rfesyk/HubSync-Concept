import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '9982-2a02-a311-a7-9000-1196-9bee-1d32-960a.ngrok-free.app',
    ],
  },
  preview: {
    allowedHosts: ['hubsync-concept-production-cf38.up.railway.app'],
  },
})
