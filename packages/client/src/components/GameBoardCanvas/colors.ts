const TEXT_COLOR = {
  dark: '#2d2d2d',
  light: '#ffffff',
};
export const getTileColor = (value: number) =>
  ({
    2: { fill: '#f8bfc4', text: TEXT_COLOR.dark },
    4: { fill: '#fca28f', text: TEXT_COLOR.dark },
    8: { fill: '#fc8bab', text: TEXT_COLOR.dark },
    16: { fill: '#ec8ea0', text: TEXT_COLOR.light },
    32: { fill: '#df82ab', text: TEXT_COLOR.light },
    64: { fill: '#c377b7', text: TEXT_COLOR.light },
    128: { fill: '#9459c6', text: TEXT_COLOR.light },
    256: { fill: '#7360d3', text: TEXT_COLOR.light },
    512: { fill: '#5671df', text: TEXT_COLOR.light },
    1024: { fill: '#3986eb', text: TEXT_COLOR.light },
    2048: { fill: '#22a0f7', text: TEXT_COLOR.light },
  }[value] ?? { fill: '#111', text: TEXT_COLOR.light });

export const BG_COLORS = {
  board: '#F7FAFC',
  emptyTile: '#E2E8F0',
} as const;
