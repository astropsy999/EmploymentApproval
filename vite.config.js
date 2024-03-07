import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portal/emplforman/dist/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5500,
  },
});
