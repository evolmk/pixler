import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { SignedUrlResponse, ConfirmResponse, UploadType } from './file-upload.types';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '',
});

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.baseUrl = `${inject(API_BASE_URL)}/v1/storage`;
  }

  getSignedUrls(filename: string, uploadType: UploadType): Observable<SignedUrlResponse> {
    return this.http.get<SignedUrlResponse>(`${this.baseUrl}/signed-url`, {
      params: { filename, uploadType },
    });
  }

  confirmUpload(
    key: string,
    uploadType: UploadType,
    metadata: {
      name?: string;
      originalName?: string;
      mimeType?: string;
      fileSize?: number;
      group?: string;
    },
  ): Observable<ConfirmResponse> {
    return this.http.post<ConfirmResponse>(`${this.baseUrl}/confirm`, {
      key,
      uploadType,
      ...metadata,
    });
  }

  async uploadToSignedUrl(signedUrl: string, file: File, onProgress?: (percent: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  async uploadFile(
    file: File,
    uploadType: UploadType,
    onProgress?: (percent: number) => void,
    extra?: { group?: string },
  ): Promise<ConfirmResponse> {
    const signedUrls = await firstValueFrom(this.getSignedUrls(file.name, uploadType));

    const uploads: Promise<void>[] = [];

    if (signedUrls.s3?.signedUrl) {
      uploads.push(this.uploadToSignedUrl(signedUrls.s3.signedUrl, file, onProgress));
    }

    if (signedUrls.gcs?.signedUrl) {
      uploads.push(this.uploadToSignedUrl(signedUrls.gcs.signedUrl, file, signedUrls.s3 ? undefined : onProgress));
    }

    const settled = await Promise.allSettled(uploads);

    // All-or-nothing: if any provider upload failed, do not call confirm.
    // The backend has no way to verify which providers received the object,
    // so we gate the confirm call here to prevent partial-write records.
    const failed = settled.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failed.length > 0) {
      const reasons = failed.map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));
      throw new Error(`File upload failed (${failed.length} of ${uploads.length} provider(s)): ${reasons.join(', ')}`);
    }

    return firstValueFrom(
      this.confirmUpload(signedUrls.key, uploadType, {
        name: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        group: extra?.group,
      }),
    );
  }
}
