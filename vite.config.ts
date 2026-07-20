import { defineConfig, type Plugin } from 'vite'
import metadata from './poster.config.json'
import { renderPosterMarkup } from './src/render'

const posterPlaceholder = '<main id="poster" class="poster" aria-label="Academic poster"></main>'

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] ?? character,
  )

const staticPosterMarkup = (): Plugin => ({
  name: 'static-poster-markup',
  transformIndexHtml(html) {
    if (!html.includes(posterPlaceholder)) {
      throw new Error('Poster placeholder is missing from index.html')
    }

    const description = metadata.poster.subtitle || metadata.poster.title

    return html
      .replace(
        posterPlaceholder,
        `<main id="poster" class="poster" aria-label="Academic poster">${renderPosterMarkup()}</main>`,
      )
      .replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(metadata.language)}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.poster.title)}</title>`)
      .replace(
        /<meta name="description" content="[^"]*" \/>/,
        `<meta name="description" content="${escapeHtml(description)}" />`,
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
