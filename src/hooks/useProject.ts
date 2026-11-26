import project from "@/data/project.json";
import type { Project } from "@/types/project";

// Static JSON today (no database). Components only ever read through this hook.
export function useProject(): Project {
  return project as Project;
}
