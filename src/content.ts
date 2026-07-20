import metadata from '../poster.config.json'
import type { PosterContent } from './types'

export const posterContent: PosterContent = {
  ...metadata.poster,
  keyFinding:
    'Encoding prior covariance improved early exploration without increasing late-stage decision variance.',
  background: [
    'Sequential decisions require a trade-off between exploiting known rewards and exploring uncertain alternatives.',
    'Most demonstrations assume independent uncertainty, although real-world options often share latent structure.',
  ],
  researchQuestion:
    'Can a structured prior accelerate learning while preserving stable decisions after uncertainty has been resolved?',
  methods: {
    design: 'Within-participant, 3 conditions × 120 trials',
    sample: 'N = 180 simulated participants',
    model: 'Bayesian linear contextual bandit',
    analysis: 'Hierarchical model + permutation validation',
  },
  metrics: [
    { value: '+18%', label: 'early reward', detail: 'trials 1–40' },
    { value: '−27%', label: 'regret', detail: 'relative to baseline' },
    { value: '≈ 0', label: 'variance cost', detail: 'trials 81–120' },
  ],
  results: [
    'Structured uncertainty produced faster separation between high- and low-value options.',
    'The advantage was concentrated in the first third of the task, consistent with accelerated information transfer.',
    'Late-stage choice variance was statistically indistinguishable from the independent-prior baseline.',
  ],
  conclusions: [
    'Correlation structure can be operationally useful, not merely a descriptive property of the prior.',
    'The HTML/SVG workflow keeps data, prose, layout, and figures independently reviewable in Git.',
    'The same source can be previewed in-browser and exported to a fixed-size PDF.',
  ],
  limitations: [
    'All numbers and figures on this poster are illustrative demo data.',
    'Production posters should validate font embedding, image resolution, and venue-specific bleed requirements.',
  ],
  references: [
    'Abbasi-Yadkori et al. (2011). Improved algorithms for linear stochastic bandits.',
    'Gelman et al. (2020). Bayesian workflow.',
  ],
}
