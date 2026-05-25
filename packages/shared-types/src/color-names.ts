export const COLOR_NAMES = [
  'amber', 'azure', 'cerulean', 'chartreuse', 'cobalt', 'coral',
  'crimson', 'cyan', 'denim', 'emerald', 'fuchsia', 'gold',
  'indigo', 'jade', 'jasmine', 'lavender', 'lilac', 'lime',
  'magenta', 'maroon', 'mauve', 'mint', 'moss', 'mustard',
  'navy', 'ochre', 'olive', 'onyx', 'opal', 'orchid',
  'peach', 'pearl', 'periwinkle', 'pine', 'plum', 'rose',
  'ruby', 'sage', 'sapphire', 'scarlet', 'sienna', 'silver',
  'slate', 'steel', 'tan', 'teal', 'topaz', 'umber',
  'violet', 'walnut',
] as const;

export type ColorName = (typeof COLOR_NAMES)[number];
