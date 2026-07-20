import './styles/tokens.css'
import './styles/poster.css'
import { renderPosterMarkup } from './render'

const poster = document.querySelector<HTMLElement>('#poster')
const shell = document.querySelector<HTMLElement>('#poster-shell')

if (!poster || !shell) {
  throw new Error('Poster root elements are missing from index.html')
}

// Vite injects the poster markup into index.html during both development and
// production builds. This fallback keeps the page usable if the module is
// loaded outside that transform pipeline.
if (!poster.hasChildNodes()) {
  poster.innerHTML = renderPosterMarkup()
}

const resizePreview = (): void => {
  if (window.matchMedia('print').matches) return

  const horizontalMargin = 48
  const availableWidth = Math.max(320, window.innerWidth - horizontalMargin)
  const scale = Math.min(1, availableWidth / poster.offsetWidth)

  document.documentElement.style.setProperty('--preview-scale', scale.toFixed(4))
  shell.style.width = `${poster.offsetWidth * scale}px`
  shell.style.height = `${poster.offsetHeight * scale}px`
}

requestAnimationFrame(resizePreview)
window.addEventListener('resize', resizePreview, { passive: true })
