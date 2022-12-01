import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: "src/assets/public",
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src/components'),
      'Interfaces': path.resolve(__dirname, 'src/interfaces'),
      'Models': path.resolve(__dirname, 'src/models'),
      'Assets': path.resolve(__dirname, 'src/assets'),
      'Public': path.resolve(__dirname, 'src/assets/public'),
      'Styles': path.resolve(__dirname, 'src/assets/stylesheets'),
      'Views': path.resolve(__dirname, 'src/views'),
    },
  },
  server: {
    host: '127.0.0.1'
  }
})
