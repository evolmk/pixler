import { test, expect } from '@playwright/test';

test('app shell renders with UI components', async ({ page }) => {
  await page.goto('/');
  // App should render within timeout — either loading state or full shell
  await expect(page.locator('#root')).toBeAttached();
  // The body should have a non-empty text node (app rendered something)
  const text = await page.locator('body').innerText();
  expect(text.trim().length).toBeGreaterThan(0);
});

test('CSS class utility bg-background is resolved', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
  );
  expect(bg.length).toBeGreaterThan(0);
});
