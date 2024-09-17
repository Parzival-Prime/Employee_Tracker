import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    esbuild: {
      minify: true,
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
  };
});
