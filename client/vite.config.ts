import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      strictPort: true,
      port: 3001,
      open: true,
    },
    plugins: [react()],
  };
});
