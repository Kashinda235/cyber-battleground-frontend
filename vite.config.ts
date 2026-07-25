import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const port = Number(env.VITE_DEV_PORT || 3000);
  const host = env.VITE_DEV_HOST || '0.0.0.0';
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      host,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
})
