import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    server: {
      strictPort: true,
      port: 3001,
      open: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        shared: path.resolve(__dirname, '../shared/dist/client'),
      },
    },
  };
});
