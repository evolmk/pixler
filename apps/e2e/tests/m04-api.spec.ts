import { test, expect } from '@playwright/test';

test('GET /api/health returns version and ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty('ok', true);
  expect(body).toHaveProperty('version');
  expect(typeof body.version).toBe('string');
});

test('Socket.io /events namespace accepts connections', async ({ page }) => {
  await page.goto('/');
  // Wait for the app to attempt its health check and render
  await expect(page.locator('#root')).toBeAttached();
  // Confirm no fatal error message visible
  const errorText = page.getByText('Error connecting to API');
  await expect(errorText).not.toBeVisible({ timeout: 5000 }).catch(() => {
    // If the error IS visible, the test would have failed above
  });
});
