export type DiffStatus = 'M' | 'A' | 'D' | 'R' | 'C' | '?';

export interface DiffFileSummary {
  path: string;
  status: DiffStatus;
  additions: number;
  deletions: number;
  oldPath?: string;
}

export interface DiffHunk {
  header: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

export interface DiffFileDetail {
  path: string;
  status: DiffStatus;
  oldContent: string | null;
  newContent: string | null;
  language: string;
  isBinary: boolean;
  hunks: DiffHunk[];
}
