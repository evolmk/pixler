import { test, expect } from '@playwright/test';

test('CSS design tokens are applied on html element', async ({ page }) => {
  await page.goto('/');
  const primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
  );
  expect(primary.length).toBeGreaterThan(0);
});

test('Inter font is referenced in body font-family', async ({ page }) => {
  await page.goto('/');
  const fontFamily = await page.evaluate(() =>
    getComputedStyle(document.body).fontFamily,
  );
  expect(fontFamily.toLowerCase()).toContain('inter');
});
