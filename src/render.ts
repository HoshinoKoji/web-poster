import { posterContent as content } from './content'
import type { Author } from './types'

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;',
      })[character] ?? character,
  )

const renderAuthors = (authors: Author[]): string =>
  authors
    .map(
      ({ name, affiliation, corresponding }) =>
        `<span>${escapeHtml(name)}<sup>${affiliation}${corresponding ? '✦' : ''}</sup></span>`,
    )
    .join('')

const renderList = (items: string[], className = ''): string =>
  `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

export const renderPosterMarkup = (): string => `
  <header class="poster-header">
    <div class="header-copy">
      <p class="eyebrow">${escapeHtml(content.eyebrow)}</p>
      <h1>${escapeHtml(content.title)}</h1>
      <p class="subtitle">${escapeHtml(content.subtitle)}</p>
      <div class="authors">${renderAuthors(content.authors)}</div>
      <div class="affiliations">
        ${content.affiliations
          .map((affiliation, index) => `<span><sup>${index + 1}</sup>${escapeHtml(affiliation)}</span>`)
          .join('')}
      </div>
    </div>
    <div class="poster-mark" aria-label="Project mark">
      <svg viewBox="0 0 160 160" role="img" aria-label="Abstract covariance network">
        <path d="M24 103 54 49l39 23 43-45" />
        <path d="m24 103 48 25 64-36" />
        <circle cx="24" cy="103" r="13" />
        <circle cx="54" cy="49" r="13" />
        <circle cx="93" cy="72" r="13" />
        <circle cx="136" cy="27" r="13" />
        <circle cx="72" cy="128" r="13" />
        <circle cx="136" cy="92" r="13" />
      </svg>
      <span>WEB<br />POSTER</span>
    </div>
  </header>

  <aside class="key-finding">
    <span class="key-label">Key finding</span>
    <strong>${escapeHtml(content.keyFinding)}</strong>
    <span class="demo-pill">illustrative data</span>
  </aside>

  <div class="poster-grid">
    <div class="column column-left">
      <section class="panel intro-panel">
        <h2><span>01</span> Why this question?</h2>
        ${content.background.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
        <div class="question-box">
          <span>Research question</span>
          <p>${escapeHtml(content.researchQuestion)}</p>
        </div>
      </section>

      <section class="panel compact-panel">
        <h2><span>02</span> Study design</h2>
        <img class="figure figure-flow" src="./figures/study-design.svg" alt="Three-stage experimental workflow" />
        <dl class="method-list">
          <div><dt>Design</dt><dd>${escapeHtml(content.methods.design)}</dd></div>
          <div><dt>Sample</dt><dd>${escapeHtml(content.methods.sample)}</dd></div>
          <div><dt>Model</dt><dd>${escapeHtml(content.methods.model)}</dd></div>
          <div><dt>Analysis</dt><dd>${escapeHtml(content.methods.analysis)}</dd></div>
        </dl>
      </section>
    </div>

    <div class="column column-middle">
      <section class="panel hero-figure-panel">
        <div class="section-heading">
          <h2><span>03</span> Earlier learning</h2>
          <p>Mean cumulative reward across trials</p>
        </div>
        <img class="figure figure-results" src="./figures/learning-curves.svg" alt="Illustrative cumulative reward curves" />
        <div class="metric-grid">
          ${content.metrics
            .map(
              ({ value, label, detail }) => `
                <article class="metric">
                  <strong>${escapeHtml(value)}</strong>
                  <span>${escapeHtml(label)}</span>
                  <small>${escapeHtml(detail)}</small>
                </article>`,
            )
            .join('')}
        </div>
      </section>

      <section class="panel model-panel">
        <div class="section-heading">
          <h2><span>04</span> Proposed mechanism</h2>
          <p>Shared structure transfers information between options</p>
        </div>
        <img class="figure figure-model" src="./figures/model-structure.svg" alt="Illustration of independent and structured priors" />
      </section>
    </div>

    <div class="column column-right">
      <section class="panel effects-panel">
        <div class="section-heading">
          <h2><span>05</span> Estimated effects</h2>
          <p>Standardized coefficients with 95% intervals</p>
        </div>
        <img class="figure figure-effects" src="./figures/effects.svg" alt="Illustrative forest plot" />
        ${renderList(content.results, 'result-list')}
      </section>

      <section class="panel conclusion-panel">
        <h2><span>06</span> Take-home points</h2>
        ${renderList(content.conclusions, 'conclusion-list')}
      </section>
    </div>
  </div>

  <footer class="poster-footer">
    <div class="footer-notes">
      <div>
        <strong>Limitations</strong>
        ${renderList(content.limitations)}
      </div>
      <div>
        <strong>Selected references</strong>
        ${renderList(content.references)}
      </div>
    </div>
    <div class="contact-card">
      <svg viewBox="0 0 84 84" aria-label="Decorative QR placeholder">
        <rect width="84" height="84" rx="8" />
        <g>
          <path d="M9 9h22v22H9zM53 9h22v22H53zM9 53h22v22H9z" />
          <path d="M15 15h10v10H15zM59 15h10v10H59zM15 59h10v10H15z" />
          <path d="M40 9h7v7h-7zM38 21h9v9h-9zM35 37h8v8h-8zM48 35h8v8h-8zM61 39h14v7H61zM37 52h8v8h-8zM49 49h10v10H49zM62 57h7v8h-7zM38 68h9v7h-9zM52 66h8v9h-8zM69 69h6v6h-6z" />
        </g>
      </svg>
      <div>
        <strong>Source & contact</strong>
        <span>${escapeHtml(content.contact)}</span>
        <small>✦ corresponding author</small>
      </div>
    </div>
  </footer>
`
