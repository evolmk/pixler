import { test, expect } from '@playwright/test';

test('GET /api/health returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toMatchObject({ ok: true });
});

test('web app serves React root', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('#root');
  await expect(root).toBeAttached();
});
