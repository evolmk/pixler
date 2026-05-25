export interface Terminal {
  id: string;
  workspaceId: string;
  createdAt: number;
}

export interface ResizeTerminalDto {
  cols: number;
  rows: number;
}
