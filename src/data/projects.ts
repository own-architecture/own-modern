import data from './projects.json';
export interface DiagramStep { src: string; label: string; }
export interface Photo { src: string; label: string; }
export interface OptimizedImage {
  src: string; srcSet: string; sizes: string; width: number; height: number;
}
export interface Project {
  slug: string; title: string; location: string; cover: string; photos: Photo[];
  statement: string; sections: { title: string; text: string }[]; steps: DiagramStep[];
}
export type PreparedProject = Omit<Project, 'photos' | 'steps'> & {
  photos: (OptimizedImage & { label: string })[];
  steps: (OptimizedImage & { label: string })[];
};
export const projects: Project[] = data;
