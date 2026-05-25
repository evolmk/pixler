export interface ModelVersion {
  id: string;
  label: string;
}

export interface ModelFamily {
  id: string;
  label: string;
  versions: ModelVersion[];
}

export interface ProviderModels {
  provider: string;
  label: string;
  available: boolean;
  families: ModelFamily[];
  probedAt: string;
}

export type ModelRegistryDto = ProviderModels[];
