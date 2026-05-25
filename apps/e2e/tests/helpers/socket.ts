import type { Page } from '@playwright/test';

export async function waitForSocketConnected(page: Page, timeoutMs = 5000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const connected = await page.evaluate(() => {
      // @ts-expect-error — access pixler socket from window if exposed
      const sock = (window as Record<string, unknown>).__pixlerSocket;
      return sock ? (sock as { connected: boolean }).connected : false;
    });
    if (connected) return;
    await page.waitForTimeout(100);
  }
  throw new Error(`Socket.io did not connect within ${timeoutMs}ms`);
}
