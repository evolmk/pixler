export interface Project {
  id: string;
  name: string;
  path: string;
  default_branch: string;
  package_manager: 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';
  icon_path: string | null;
  cloned_by_pixler: boolean;
  created_at: number;
  updated_at: number;
}

export interface AddLocalProjectDto {
  path: string;
  name?: string;
}

export interface PatchProjectDto {
  name?: string;
  icon_path?: string | null;
}

