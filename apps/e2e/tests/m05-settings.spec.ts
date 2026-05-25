import { test, expect } from '@playwright/test';

test('PATCH then GET settings persists value', async ({ request }) => {
  const key = 'terminal.fontSize';
  const testValue = 17;

  // Write
  const patch = await request.patch('/api/settings', {
    data: { scope: 'global', patch: { [key]: testValue } },
  });
  expect(patch.status()).toBe(200);

  // Read back
  const get = await request.get('/api/settings');
  expect(get.status()).toBe(200);
  const body = await get.json();
  expect(body[key]).toBe(testValue);

  // Restore
  await request.patch('/api/settings', {
    data: { scope: 'global', patch: { [key]: 13 } },
  });
});
