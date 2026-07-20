# Web Poster

A browser-native academic poster starter built with **Bun**, **Vite**, **TypeScript**, **CSS Grid**, **SVG**, and **Vivliostyle**.

The included poster is an A0 landscape demonstration. Every number and figure is illustrative rather than a real research result.

## Start a new poster

Install dependencies, then run the interactive scaffold command:

```bash
bun install
bun run poster:new
```

The command asks for the poster title, eyebrow, subtitle, language, affiliations, authors, corresponding-author status, contact information, and PDF file name. Before changing anything, it shows a summary and asks for explicit confirmation.

After confirmation it:

- writes shared metadata to [`poster.config.json`](poster.config.json);
- resets [`src/content.ts`](src/content.ts) to an empty scientific-content skeleton;
- optionally replaces the demo SVGs with blank figure placeholders;
- configures the PDF output name through the shared metadata file.

It also warns when the target poster files already contain uncommitted Git changes. The final confirmation defaults to **no**, so pressing Enter does not overwrite the current poster.

## Development

```bash
bun run dev
```

Vite serves a scaled browser preview with hot module replacement. The source poster remains fixed at its physical print size (`1189mm × 841mm`).

## Editing workflow

- Edit title, authors, affiliations, contact details, language, and PDF filename in [`poster.config.json`](poster.config.json).
- Edit scientific copy in [`src/content.ts`](src/content.ts).
- Edit layout and typography in [`src/styles/poster.css`](src/styles/poster.css).
- Edit palette, dimensions, and reusable design values in [`src/styles/tokens.css`](src/styles/tokens.css).
- Replace vector figures under [`public/figures`](public/figures).
- Edit poster markup in [`src/render.ts`](src/render.ts).
- Edit browser-only preview behavior in [`src/main.ts`](src/main.ts).

The separation is intentional: metadata, prose, figures, layout, and design tokens produce readable Git diffs and can be reviewed independently.

## Build the static poster

```bash
bun run build
bun run preview
```

The Vite build prerenders the complete poster into `dist/index.html` and uses relative asset paths, so the result can be deployed under a GitHub Pages project path or consumed by PDF tooling without relying on client-side content injection.

## Export PDF

```bash
bun run pdf
```

This first builds the Vite project and then invokes Vivliostyle CLI. The PDF is written under `output/` using the filename configured in `poster.config.json`.

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

## GitHub Pages and artifacts

The included workflow builds and deploys `dist/` when changes reach `main`. It also uploads `dist/` and every PDF under `output/` as the `web-poster-build` Actions artifact. Enable **GitHub Pages → Source → GitHub Actions** in the repository settings if it is not already enabled.

## Project map

```text
.
├── poster.config.json        # shared metadata and PDF filename
├── public/figures/           # replaceable SVG figures
├── scripts/create-poster.mjs # interactive blank-poster scaffold
├── src/content.ts            # scientific prose and result data
├── src/render.ts             # static poster markup
├── src/main.ts               # browser preview behavior
├── src/styles/tokens.css     # theme and dimensions
├── src/styles/poster.css     # fixed-size layout and print rules
├── vivliostyle.config.js     # PDF build configuration
└── vite.config.ts            # browser/static build configuration
```
