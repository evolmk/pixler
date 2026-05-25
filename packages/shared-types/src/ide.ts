export interface DetectedIde {
  id: string;
  name: string;
  command: string;
  version: string | null;
  available: boolean;
}

export interface OpenInIdeDto {
  ide?: string;
}
