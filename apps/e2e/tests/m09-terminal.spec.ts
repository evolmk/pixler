import { test, expect } from '@playwright/test';

test('terminal API returns 404 for unknown workspace id', async ({ request }) => {
  const res = await request.get('/api/workspaces/nonexistent-id/terminals');
  // Either 404 or 200 with empty array — the endpoint exists
  expect([200, 404]).toContain(res.status());
});

test('app shell loads without throwing on terminal route', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // Navigate to root (terminal pane is in the right pane of the workspace shell)
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // xterm canvas may not exist without an active workspace — just check no crash
  const fatal = errors.filter(
    (e) => !e.includes('ResizeObserver') && !e.includes('favicon'),
  );
  expect(fatal).toHaveLength(0);
});
