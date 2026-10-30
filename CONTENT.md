# OWN Architecture

## Pages

- `/`: video intro and animated entry to the selector.
- `/seleccion/`: direct access to the studio/project selector.
- `/estudio/`: original studio statement, philosophy and method on black.
- `/proyectos/`: ten projects, including Casa Invertida and Santander 3.
- `/proyectos/[slug]/`: individual project pages.

## Content and assets

Edit `src/data/projects.json` to update titles, descriptions, photographs and
diagram stages. Six project texts come from the PDFs in `images/`; each record
includes its `sourceDocument`. The other existing texts retain the supplied
HTML copy. Santander 3 has a provisional name from its folder and no invented
description or location.

All 68 raster images from `images/` have WebP versions in `src/assets/projects/`.
The original image files and PDFs remain in `images/`. Photos use quality 90;
diagrams use lossless WebP, capped at 3200 px. Photographs are capped at 2400 px
without upscaling. The import mapping is in `src/data/media-import.json`.
Brisa de Luz includes the `OP 1` images after its main images, labeled as
"Opción 1". Claro de Luz uses four OWN sketches as diagram stages (the earlier
sketch remains in `src/assets/projects/claro-de-luz/esbozo.webp`, unused).
Missing diagrams are omitted; single diagrams do not show redundant arrows.
Add more entries to `steps` to enable stage navigation automatically.

Astro's `Image` component optimizes the project grid and studio image.
`src/lib/projectImages.ts` uses Astro's `getImage()` for React components and
passes generated WebP URLs, dimensions, `srcSet` and `sizes` into them.
The gallery and selector get responsive widths up to 1600 px; diagrams up to
2400 px. The intro poster is also WebP.

All seven videos were moved to `public/videos/` (served at `/videos/`), retaining
their original contents. Project subfolders prevent filename collisions. The
active intro uses `/videos/inicio.mp4`. The other videos are stored for later
use. Original and destination paths are recorded in `media-import.json`.

The contact email comes from the supplied index page and should be confirmed
before publication. Contact uses a mail link, not a message submission form.

## Development

Run `npm run check` and `npm run build` to validate.
Start with `npm exec astro dev -- --background --port 4321`.
Stop with `npm exec astro dev stop`.
