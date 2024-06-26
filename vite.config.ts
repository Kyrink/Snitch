// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/Popup.html'), // Point to your popup HTML file
        // options: path.resolve(__dirname, 'src/options.html'), // Uncomment if you have an options page
        background: path.resolve(__dirname, 'src/Background/background.js'),
      },
      output: {
        // If you need specific output settings, configure them here
      },
    },
    // Ensure static assets are copied to the dist folder
    assetsDir: 'assets',
    // Example of how to copy manifest.json and other static files to dist
    emptyOutDir: true // Clears the dist folder before each build
  },
  define: {
    // Optionally, you can pass the environment variable to the client side explicitly,
    // but remember, this is not secure for sensitive data
    'process.env.VITE_WOT_API_KEY': JSON.stringify(process.env.VITE_WOT_API_KEY),
  },
});
