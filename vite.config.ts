import { defineConfig, type Plugin } from 'vite'
import { renderPosterMarkup } from './src/render'

const posterPlaceholder = '<main id="poster" class="poster" aria-label="Academic poster"></main>'

const staticPosterMarkup = (): Plugin => ({
  name: 'static-poster-markup',
  transformIndexHtml(html) {
    if (!html.includes(posterPlaceholder)) {
      throw new Error('Poster placeholder is missing from index.html')
    }

    return html.replace(
      posterPlaceholder,
      `<main id="poster" class="poster" aria-label="Academic poster">${renderPosterMarkup()}</main>`,
    )
  },
})

export default defineConfig({
  // Relative assets allow the same build to work on GitHub Pages and from disk.
  base: './',
  plugins: [staticPosterMarkup()],
  build: {
    sourcemap: true,
  },
})
