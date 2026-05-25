export class ApiClient {
  private base: string;

  constructor() {
    const port = process.env['PIXLER_API_PORT'] ?? '7777';
    this.base = `http://localhost:${port}/api`;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.base}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      process.stderr.write(`[pixler-linear] Cannot reach Pixler API at ${this.base}.\n`);
      process.stderr.write(`  Make sure PIXLER_API_PORT is set and the API is running.\n`);
      process.exit(2);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      process.stderr.write(`[pixler-linear] API error ${res.status}: ${text}\n`);
      process.exit(3);
    }

    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return undefined as T;
    return res.json() as Promise<T>;
  }
}
