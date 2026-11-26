export interface ProjectImage { src: string; alt: string; width: number; height: number }
export interface ProjectCard { id: string; title: string; subtitle: string; image: string; href: string }
export interface Project {
  name: string;
  tagline: string;
  background: string;
  logos: { project: ProjectImage; developer: ProjectImage };
  credit: { label: string; href: string; mark: string };
  cards: ProjectCard[];
}
