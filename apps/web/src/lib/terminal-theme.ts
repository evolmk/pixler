import type { ITheme } from '@xterm/xterm';

function resolveVar(name: string): string {
  const el = document.createElement('div');
  el.style.cssText = 'display:none;position:absolute;pointer-events:none';
  el.style.color = `var(${name})`;
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color || '#000000';
}

export function buildTerminalTheme(): ITheme {
  return {
    background: resolveVar('--background'),
    foreground: resolveVar('--foreground'),
    cursor: resolveVar('--primary'),
    cursorAccent: resolveVar('--background'),
    selectionBackground: resolveVar('--accent'),
    selectionForeground: resolveVar('--foreground'),
    black: 'rgb(40,40,40)',
    red: 'rgb(205,75,75)',
    green: resolveVar('--primary'),
    yellow: 'rgb(205,175,75)',
    blue: 'rgb(75,135,205)',
    magenta: 'rgb(175,75,175)',
    cyan: 'rgb(75,175,175)',
    white: 'rgb(200,200,200)',
    brightBlack: resolveVar('--muted-foreground'),
    brightRed: 'rgb(235,100,100)',
    brightGreen: resolveVar('--primary'),
    brightYellow: 'rgb(235,215,100)',
    brightBlue: 'rgb(100,160,235)',
    brightMagenta: 'rgb(215,100,215)',
    brightCyan: 'rgb(100,215,215)',
    brightWhite: resolveVar('--foreground'),
  };
}

export function watchTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-color-scheme'],
  });
  return () => observer.disconnect();
}
