import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // This allows process.env.API_KEY to work in the browser build
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});