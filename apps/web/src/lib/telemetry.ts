async function isEnabled(): Promise<boolean> {
  try {
    const res = await fetch('/api/settings?scope=global');
    if (!res.ok) return false;
    const data = (await res.json()) as Record<string, unknown>;
    return data['telemetry.enabled'] !== false;
  } catch {
    return false;
  }
}

export async function track(name: string, props: Record<string, unknown> = {}): Promise<void> {
  if (!(await isEnabled())) return;
  try {
    await fetch('/api/telemetry/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, props }),
    });
  } catch {
    // swallow — telemetry should never break the app
  }
}
