import { defineConfig } from '@vivliostyle/cli'

export default defineConfig({
  title: 'Adaptive exploration under structured uncertainty',
  author: 'Example Research Group',
  language: 'en',
  entry: 'dist/index.html',
  output: {
    path: 'output/web-poster.pdf',
    format: 'pdf',
  },
})
