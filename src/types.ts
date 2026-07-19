export interface Author {
  name: string
  affiliation: number
  corresponding?: boolean
}

export interface Metric {
  value: string
  label: string
  detail: string
}

export interface PosterContent {
  eyebrow: string
  title: string
  subtitle: string
  authors: Author[]
  affiliations: string[]
  contact: string
  keyFinding: string
  background: string[]
  researchQuestion: string
  methods: {
    design: string
    sample: string
    model: string
    analysis: string
  }
  metrics: Metric[]
  results: string[]
  conclusions: string[]
  limitations: string[]
  references: string[]
}
