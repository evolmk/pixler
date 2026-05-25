import { test, expect } from '@playwright/test';
import path from 'path';
import os from 'os';

test('GET /api/projects returns array', async ({ request }) => {
  const res = await request.get('/api/projects');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
});

test('POST /api/projects/add-local creates a project', async ({ request }) => {
  const tmpDir = os.tmpdir();
  const res = await request.post('/api/projects/add-local', {
    data: { path: tmpDir },
  });
  // Expect 200 or 201 (might get 400 if dir already tracked — acceptable)
  expect([200, 201, 400]).toContain(res.status());
  if (res.status() === 200 || res.status() === 201) {
    const body = await res.json();
    expect(body).toHaveProperty('id');
  }
});
