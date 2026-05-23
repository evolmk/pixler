const COLORS = [
  'bg-slate-400',
  'bg-zinc-400',
  'bg-stone-400',
  'bg-blue-300',
  'bg-teal-300',
  'bg-amber-300',
  'bg-violet-300',
  'bg-rose-300',
];

/** Returns a deterministic Tailwind background color class based on the given name. */
export function avatarBgFromName(name: string): string {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}
