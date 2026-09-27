import data from './projects.json';
export interface DiagramStep { src: string; label: string; }
export interface Project {
  slug: string; title: string; location: string; cover: string; photos: string[];
  statement: string; sections: { title: string; text: string }[]; steps: DiagramStep[];
}
export const projects: Project[] = data;
