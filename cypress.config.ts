// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  
  viewportWidth: 390,
  viewportHeight: 844,
});