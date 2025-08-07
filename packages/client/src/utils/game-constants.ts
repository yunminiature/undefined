export const GAME_CONFIG = {
  BOARD_SIZE: 4,
  WIN_VALUE: 2048,
  TILE_PROBABILITIES: {
    TWO: 0.9,
    FOUR: 0.1,
  },
  TILE_VALUES: {
    TWO: 2,
    FOUR: 4,
  },
} as const

export const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const
