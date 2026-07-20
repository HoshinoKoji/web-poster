const outputPath = 'dist/index.html'
const html = await Bun.file(outputPath).text()

const emptyPlaceholder = '<main id="poster" class="poster" aria-label="Academic poster"></main>'
const requiredFragments = [
  'class="poster-header"',
  'class="poster-grid"',
  'class="poster-footer"',
  './figures/learning-curves.svg',
]

if (html.includes(emptyPlaceholder)) {
  throw new Error(`${outputPath} still contains an empty poster root`)
}

const missing = requiredFragments.filter((fragment) => !html.includes(fragment))

if (missing.length > 0) {
  throw new Error(`Static poster markup is incomplete; missing: ${missing.join(', ')}`)
}

console.log(`Validated static poster markup in ${outputPath}`)
