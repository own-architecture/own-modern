# OWN Architecture

## Pages

- `/`: video intro and animated entry to the selector.
- `/seleccion/`: direct access to the studio/project selector.
- `/estudio/`: original studio statement, philosophy and method on black.
- `/proyectos/`: eight projects from the supplied HTML.
- `/proyectos/[slug]/`: individual project pages.

## Content and temporary assets

Edit `src/data/projects.json` to replace titles, descriptions, photographs and
diagram stages. Text was imported from the supplied `index.html`. The final
three projects have no descriptions in that source, so their text is empty.

The supplied three photographs are deliberately reused as placeholders across
all projects. The two supplied sketches are also shared placeholders, not
successive stages of one actual project. Replace each project's `steps` array
with the final images in order; the controls automatically adapt to any count.

`public/media/inicio.mp4` is the supplied video. The poster is its first frame.
The contact email comes from the supplied index page and should be confirmed
before publication. Contact uses a mail link, not a message submission form.

## Development

Run `npm run check` and `npm run build` to validate.
Start with `npm exec astro dev -- --background --port 4321`.
Stop with `npm exec astro dev stop`.
