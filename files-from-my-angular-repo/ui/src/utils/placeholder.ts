export type PlaceholderFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg' | 'avif' | 'gif';

export type PlaceholderFont =
  | 'roboto'
  | 'lato'
  | 'montserrat'
  | 'opensans'
  | 'oswald'
  | 'playfairdisplay'
  | 'ptsans'
  | 'raleway'
  | 'sourcesanspro';

export type PlaceholderRatio = '1:1' | '4:3' | '16:9' | '3:2';

export type PlaceholderOptions = {
  width?: number;
  height?: number;
  ratio?: PlaceholderRatio;
  bg?: string;
  fg?: string;
  text?: string;
  format?: PlaceholderFormat;
  retina?: boolean;
  font?: PlaceholderFont;
};

export const PLACEHOLDER_DEFAULTS = {
  width: 300,
  bg: 'f4f4f4',
  fg: '888888',
  font: 'roboto' as PlaceholderFont,
  ratio: '1:1' as PlaceholderRatio,
};

const RATIO_MAP: Record<PlaceholderRatio, [number, number]> = {
  '1:1': [1, 1],
  '4:3': [4, 3],
  '16:9': [16, 9],
  '3:2': [3, 2],
};

export function placeholderImage(opts: PlaceholderOptions = {}): string {
  const { width, height } = resolveDimensions(opts);
  const bg = stripHash(opts.bg ?? PLACEHOLDER_DEFAULTS.bg);
  const fg = stripHash(opts.fg ?? PLACEHOLDER_DEFAULTS.fg);
  const font = opts.font ?? PLACEHOLDER_DEFAULTS.font;

  const size = opts.retina ? `${width}x${height}@2x` : `${width}x${height}`;
  const ext = opts.format ? `.${opts.format}` : '';

  const params = new URLSearchParams();
  if (opts.text) params.set('text', opts.text);
  params.set('font', font);

  return `https://placehold.co/${size}/${bg}/${fg}${ext}?${params.toString()}`;
}

function resolveDimensions(opts: PlaceholderOptions): { width: number; height: number } {
  if (opts.width != null && opts.height != null) {
    return { width: opts.width, height: opts.height };
  }
  const [rw, rh] = RATIO_MAP[opts.ratio ?? PLACEHOLDER_DEFAULTS.ratio];
  if (opts.width != null) {
    return { width: opts.width, height: Math.round((opts.width * rh) / rw) };
  }
  if (opts.height != null) {
    return { width: Math.round((opts.height * rw) / rh), height: opts.height };
  }
  const w = PLACEHOLDER_DEFAULTS.width;
  return { width: w, height: Math.round((w * rh) / rw) };
}

function stripHash(hex: string): string {
  return hex.startsWith('#') ? hex.slice(1) : hex;
}
