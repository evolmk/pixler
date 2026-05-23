export type UploadType = 'image' | 'doc' | 'drawing' | 'email' | 'site';

export interface SignedUrlResponse {
  s3?: { signedUrl: string; publicUrl: string };
  gcs?: { signedUrl: string; publicUrl: string };
  key: string;
  mimeType: string;
  subfolder: string;
}

export interface ConfirmResponse {
  key: string;
  url?: string;
  record: Record<string, unknown>;
}

export interface UploadQueueItem {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'confirming' | 'complete' | 'error';
  error?: string;
  key?: string;
  record?: Record<string, unknown>;
}

export interface UploadResultEvent {
  key: string;
  url?: string;
  file: File;
  record: Record<string, unknown>;
}

export interface UploadErrorEvent {
  file: File;
  error: string;
}
