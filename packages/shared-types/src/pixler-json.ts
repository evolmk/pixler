export interface PixlerJsonScripts {
  setup?: string;
  run?: string;
  archive?: string;
}

export interface PixlerJsonLinear {
  teamId?: string;
  projectId?: string;
}

export interface PixlerJsonModels {
  planning?: string;
  reviewing?: string;
  executing?: string;
  validating?: string;
}

export interface PixlerJsonGit {
  branchTemplate?: string;
  defaultBranch?: string;
}

export interface PixlerJson {
  version: 1;
  scripts?: PixlerJsonScripts;
  filesToCopy?: string[];
  plansDir?: string;
  git?: PixlerJsonGit;
  linear?: PixlerJsonLinear;
  models?: PixlerJsonModels;
  autoApprove?: {
    plan?: boolean;
    validation?: boolean;
    pr?: boolean;
  };
}

export type PixlerJsonDiff = {
  key: string;
  teamValue: unknown;
  localValue: unknown;
}[];
