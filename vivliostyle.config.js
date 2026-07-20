import { readFileSync } from 'node:fs'
import { defineConfig } from '@vivliostyle/cli'

const metadata = JSON.parse(
  readFileSync(new URL('./poster.config.json', import.meta.url), 'utf8'),
)

export default defineConfig({
  title: metadata.poster.title,
  author: metadata.poster.authors.map(({ name }) => name).join(', '),
  language: metadata.language,
  static: {
    '/': 'dist',
  },
  entry: '/index.html',
  output: {
    path: `output/${metadata.output}`,
    format: 'pdf',
  },
})
