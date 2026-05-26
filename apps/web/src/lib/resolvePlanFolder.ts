/**
 * Compute the absolute path a plan folder resolves to, for display under the folder input.
 * Mirrors the server's StorageProviderService.resolveFolder:
 * absolute or `~` paths are shown as-is; a relative folder resolves against the repo root.
 * When the repo root is unknown (global settings), a `<repo root>` placeholder is used.
 */
export function resolvePlanFolder(repoRoot: string | undefined, folder: string): string {
  const f = (folder || '_plans').trim();
  if (f.startsWith('/') || f.startsWith('~')) return f;
  const cleaned = f.replace(/^\.\//, '').replace(/\/+$/, '');
  const root = repoRoot ? repoRoot.replace(/\/+$/, '') : '<repo root>';
  return `${root}/${cleaned}`;
}
