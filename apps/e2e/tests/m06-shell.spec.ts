import { test, expect } from '@playwright/test';

test('app shell renders without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Filter out known non-fatal messages
  const fatal = errors.filter((e) => !e.includes('ResizeObserver') && !e.includes('favicon'));
  expect(fatal).toHaveLength(0);
});

test('app renders a root element', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toBeAttached();
  // The app always renders something inside root
  const children = await page.locator('#root > *').count();
  expect(children).toBeGreaterThan(0);
});
