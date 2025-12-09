import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        characters: './characters.html',
        character: './character-detail.html',
        episodes: './episodes.html',
        episode: './episode.html',
        favorites: './favorites.html'
      }
    }
  },
  server: {
    port: 5173,
    open: './index.html'
  }
})


