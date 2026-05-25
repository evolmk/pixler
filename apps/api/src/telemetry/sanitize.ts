const PATH_PLACEHOLDERS = [/\/(Users|home)\/[^/]+/g, /C:\\Users\\[^\\]+/g];
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

export function sanitizeString(value: string): string {
  let out = value;
  for (const re of PATH_PLACEHOLDERS) out = out.replace(re, '/<user>');
  out = out.replace(UUID_RE, '<id>');
  return out;
}

export function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string') {
      out[k] = sanitizeString(v);
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    } else {
      // Drop complex types
    }
  }
  return out;
}
