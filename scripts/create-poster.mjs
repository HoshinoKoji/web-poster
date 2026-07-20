import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = resolve(root, 'poster.config.json')
const contentPath = resolve(root, 'src/content.ts')
const figuresDirectory = resolve(root, 'public/figures')

const rl = createInterface({ input, output })

const ask = async (label, defaultValue = '') => {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  const answer = (await rl.question(`${label}${suffix}: `)).trim()
  return answer || defaultValue
}

const askRequired = async (label, defaultValue = '') => {
  while (true) {
    const answer = await ask(label, defaultValue)
    if (answer) return answer
    console.log(`${label} is required.`)
  }
}

const askYesNo = async (label, defaultValue) => {
  const hint = defaultValue ? 'Y/n' : 'y/N'
  while (true) {
    const answer = (await rl.question(`${label} [${hint}]: `)).trim().toLowerCase()
    if (!answer) return defaultValue
    if (answer === 'y' || answer === 'yes') return true
    if (answer === 'n' || answer === 'no') return false
    console.log('Enter y or n.')
  }
}

const slugify = (value) => {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'poster'
}

const normalizePdfName = (value) => {
  const fileName = basename(value.trim())
  const withoutExtension = fileName.replace(/\.pdf$/i, '')
  return `${slugify(withoutExtension)}.pdf`
}

const createContentSource = () => `import metadata from '../poster.config.json'\nimport type { PosterContent } from './types'\n\nexport const posterContent: PosterContent = {\n  ...metadata.poster,\n  keyFinding: '',\n  background: [],\n  researchQuestion: '',\n  methods: {\n    design: '',\n    sample: '',\n    model: '',\n    analysis: '',\n  },\n  metrics: [],\n  results: [],\n  conclusions: [],\n  limitations: [],\n  references: [],\n}\n`

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
})[character])

const createPlaceholderSvg = (label) => {
  const escapedLabel = escapeXml(label)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 430" role="img" aria-label="${escapedLabel}">\n  <rect width="920" height="430" rx="24" fill="#fffafb"/>\n  <rect x="24" y="24" width="872" height="382" rx="18" fill="none" stroke="#d8cbd1" stroke-width="4" stroke-dasharray="14 12"/>\n  <g font-family="Inter, Arial, sans-serif" text-anchor="middle">\n    <text x="460" y="205" fill="#8c2b55" font-size="34" font-weight="800">${escapedLabel}</text>\n    <text x="460" y="250" fill="#5f555b" font-size="22">Replace this SVG in public/figures</text>\n  </g>\n</svg>\n`
}

const collectAffiliations = async () => {
  const affiliations = []
  while (true) {
    const label = affiliations.length === 0
      ? 'Affiliation 1'
      : `Affiliation ${affiliations.length + 1} (leave blank to finish)`
    const affiliation = await ask(label)
    if (!affiliation) {
      if (affiliations.length > 0) return affiliations
      console.log('At least one affiliation is required.')
      continue
    }
    affiliations.push(affiliation)
  }
}

const collectAuthors = async (affiliationCount) => {
  const authors = []
  while (true) {
    const label = authors.length === 0
      ? 'Author 1 name'
      : `Author ${authors.length + 1} name (leave blank to finish)`
    const name = await ask(label)
    if (!name) {
      if (authors.length > 0) return authors
      console.log('At least one author is required.')
      continue
    }

    let affiliation = 1
    while (true) {
      const raw = await ask('Affiliation number', '1')
      const parsed = Number.parseInt(raw, 10)
      if (Number.isInteger(parsed) && parsed >= 1 && parsed <= affiliationCount) {
        affiliation = parsed
        break
      }
      console.log(`Enter a number between 1 and ${affiliationCount}.`)
    }

    const corresponding = await askYesNo('Corresponding author', false)
    authors.push({ name, affiliation, ...(corresponding ? { corresponding: true } : {}) })
  }
}

const existingChangeWarning = () => {
  const result = spawnSync(
    'git',
    ['status', '--porcelain', '--', 'poster.config.json', 'src/content.ts', 'public/figures'],
    { cwd: root, encoding: 'utf8' },
  )
  if (result.status !== 0) return null
  return result.stdout.trim() || null
}

try {
  console.log('\nCreate a new blank academic poster\n')

  const title = await askRequired('Title')
  const eyebrow = await ask('Eyebrow', 'ACADEMIC POSTER')
  const subtitle = await ask('Subtitle')
  const language = await ask('Language code', 'en')
  const affiliations = await collectAffiliations()
  const authors = await collectAuthors(affiliations.length)
  const contact = await ask('Contact / project URL')
  const outputName = normalizePdfName(await ask('PDF file name', `${slugify(title)}.pdf`))
  const resetFigures = await askYesNo('Replace demo figures with blank placeholders', true)

  const config = {
    poster: { eyebrow, title, subtitle, authors, affiliations, contact },
    language,
    output: outputName,
  }

  console.log('\nPoster summary')
  console.log(`  Title: ${title}`)
  console.log(`  Authors: ${authors.map(({ name }) => name).join(', ')}`)
  console.log(`  Affiliations: ${affiliations.length}`)
  console.log(`  PDF: output/${outputName}`)
  console.log(`  Reset figures: ${resetFigures ? 'yes' : 'no'}`)

  const changes = existingChangeWarning()
  if (changes) {
    console.log('\nWarning: these poster files already have uncommitted changes:')
    console.log(changes)
  }

  const confirmed = await askYesNo('\nReplace the current poster content', false)
  if (!confirmed) {
    console.log('No files changed.')
    process.exitCode = 0
  } else {
    await mkdir(resolve(root, 'src'), { recursive: true })
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
    await writeFile(contentPath, createContentSource(), 'utf8')

    if (resetFigures) {
      await mkdir(figuresDirectory, { recursive: true })
      const figures = {
        'study-design.svg': 'Study design figure',
        'learning-curves.svg': 'Primary result figure',
        'model-structure.svg': 'Model or mechanism figure',
        'effects.svg': 'Effect estimates figure',
      }
      await Promise.all(
        Object.entries(figures).map(([fileName, label]) =>
          writeFile(resolve(figuresDirectory, fileName), createPlaceholderSvg(label), 'utf8'),
        ),
      )
    }

    console.log('\nCreated a blank poster.')
    console.log('Next: edit src/content.ts and replace SVGs in public/figures, then run bun run dev.')
  }
} finally {
  rl.close()
}
