import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { OptimizedImage, PreparedProject, Project } from '../data/projects';
import poster from '../assets/inicio-poster.webp';

const sources = import.meta.glob<ImageMetadata>('../assets/projects/**/*.webp', { eager: true, import: 'default' });

export function imageSource(path: string): ImageMetadata {
  const source = sources[`../assets/projects/${path}`];
  if (!source) throw new Error(`Missing project image: ${path}`);
  return source;
}

async function optimize(source: ImageMetadata, sizes: string, diagram = false): Promise<OptimizedImage> {
  const width = Math.min(source.width, diagram ? 2400 : 1600);
  const widths = [...new Set([480, 768, 1200, width].filter(size => size <= width))].sort((a, b) => a - b);
  const result = await getImage({ src: source, width, widths, format: 'webp', quality: diagram ? 100 : 85 });
  return { src: result.src, srcSet: result.srcSet.attribute, sizes, width: Number(result.attributes.width), height: Number(result.attributes.height) };
}

export async function prepareProject(project: Project): Promise<PreparedProject> {
  return {
    ...project,
    photos: await Promise.all(project.photos.map(async photo => ({ ...await optimize(imageSource(photo.src), '(max-width: 767px) 90vw, 62vw'), label: photo.label }))),
    steps: await Promise.all(project.steps.map(async step => ({ ...await optimize(imageSource(step.src), '(max-width: 767px) 86vw, 38vw', true), label: step.label }))),
  };
}

export async function entranceImages() {
  return {
    studio: await optimize(imageSource('casa-invertida/image2.webp'), '(max-width: 767px) 100vw, 65vw'),
    projects: await optimize(imageSource('casa-infinita/image.webp'), '(max-width: 767px) 100vw, 65vw'),
    poster: (await getImage({ src: poster, format: 'webp', width: poster.width })).src,
  };
}
