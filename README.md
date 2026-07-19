# Web Poster

A browser-native academic poster starter built with **Bun**, **Vite**, **TypeScript**, **CSS Grid**, **SVG**, and **Vivliostyle**.

The included poster is an A0 landscape demonstration. Every number and figure is illustrative rather than a real research result.

## Development

```bash
bun install
bun run dev
```

Vite serves a scaled browser preview with hot module replacement. The source poster remains fixed at its physical print size (`1189mm × 841mm`).

## Editing workflow

- Edit scientific copy and metadata in [`src/content.ts`](src/content.ts).
- Edit layout and typography in [`src/styles/poster.css`](src/styles/poster.css).
- Edit palette, dimensions, and reusable design values in [`src/styles/tokens.css`](src/styles/tokens.css).
- Replace vector figures under [`public/figures`](public/figures).
- Edit component markup and rendering in [`src/main.ts`](src/main.ts).

The separation is intentional: prose, figures, layout, and design tokens produce readable Git diffs and can be reviewed independently.

## Build the static poster

```bash
bun run build
bun run preview
```

The Vite build uses relative asset paths, so `dist/index.html` can be deployed under a GitHub Pages project path or opened by other local tooling.

## Export PDF

```bash
bun run pdf
```

This first builds the Vite project and then invokes Vivliostyle CLI. The PDF is written to:

```text
output/web-poster.pdf
```

For an interactive Vivliostyle preview:

```bash
bun run pdf:preview
```

Before sending a production PDF to a printer, verify font embedding, page size, raster image resolution, color requirements, bleed, and crop-mark requirements with the venue or print shop.

## Print settings

- Paper: A0 landscape
- Size: 1189 mm × 841 mm
- Scale: 100%
- Margins: none
- Background graphics: enabled

## GitHub Pages

The included workflow builds and deploys `dist/` when changes reach `main`. Enable **GitHub Pages → Source → GitHub Actions** in the repository settings if it is not already enabled.

## Project map

```text
.
├── public/figures/          # replaceable SVG figures
├── src/content.ts           # poster prose and metadata
├── src/main.ts              # small HTML rendering layer
├── src/styles/tokens.css    # theme and dimensions
├── src/styles/poster.css    # fixed-size layout and print rules
├── vivliostyle.config.js    # PDF build configuration
└── vite.config.ts           # browser/static build configuration
```
