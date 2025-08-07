import { GameBoard, GameState, MOVE_DIRECTION } from '@/types/game'
import { GAME_CONFIG } from './game-constants'

export const GAME_BOARD_SIZE = GAME_CONFIG.BOARD_SIZE

export function generateEmptyBoard(): GameBoard {
  return Array.from({ length: GAME_BOARD_SIZE }, () =>
    Array(GAME_BOARD_SIZE).fill(0)
  )
}

export function getInitialGameState(): GameState {
  let newBoard = generateEmptyBoard()
  newBoard = placeRandomTile(newBoard)

  return {
    board: newBoard,
    score: 0,
    isGameOver: false,
    isWon: false,
  }
}

export function placeRandomTile(board: GameBoard): GameBoard {
  const emptyTiles: [number, number][] = []

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (board[y][x] === 0) {
        emptyTiles.push([y, x])
      }
    }
  }

  if (emptyTiles.length === 0) {
    return board
  }

  const [y, x] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
  const newBoard = board.map(row => [...row])

  newBoard[y][x] =
    Math.random() < GAME_CONFIG.TILE_PROBABILITIES.TWO
      ? GAME_CONFIG.TILE_VALUES.TWO
      : GAME_CONFIG.TILE_VALUES.FOUR

  return newBoard
}

export function checkIsWon(board: GameBoard): boolean {
  return board.some(row => row.includes(GAME_CONFIG.WIN_VALUE))
}

export function checkIsGameOver(board: GameBoard): boolean {
  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      const currentTile = board[y][x]

      if (
        currentTile === 0 ||
        (x < GAME_BOARD_SIZE - 1 && currentTile === board[y][x + 1]) ||
        (y < GAME_BOARD_SIZE - 1 && currentTile === board[y + 1][x])
      ) {
        return false
      }
    }
  }

  return true
}

export function move(
  board: GameBoard,
  direction: MOVE_DIRECTION
): {
  newBoard: GameBoard
  gainedScore: number
  isMoved: boolean
} {
  const rotated = rotateBoard(board, direction)
  let isMoved = false
  let gainedScore = 0

  const newBoard = rotated.map(row => {
    const newRow = [...row].filter(v => v !== 0)

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2
        gainedScore += newRow[i]
        newRow[i + 1] = 0
      }
    }

    const merged = newRow.filter(v => v !== 0)

    while (merged.length < GAME_BOARD_SIZE) {
      merged.push(0)
    }

    if (!isArraysEqual(merged, row)) {
      isMoved = true
    }

    return merged
  })

  const restored = restoreBoard(newBoard, direction)

  return { newBoard: restored, gainedScore, isMoved }
}

function isArraysEqual(a: number[], b: number[]): boolean {
  return a.every((val, idx) => val === b[idx])
}

function rotateBoard(board: GameBoard, dir: MOVE_DIRECTION): GameBoard {
  const rotated = generateEmptyBoard()

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (dir === MOVE_DIRECTION.LEFT) {
        rotated[y][x] = board[y][x]
      } else if (dir === MOVE_DIRECTION.RIGHT) {
        rotated[y][x] = board[y][GAME_BOARD_SIZE - 1 - x]
      } else if (dir === MOVE_DIRECTION.UP) {
        rotated[y][x] = board[x][y]
      } else if (dir === MOVE_DIRECTION.DOWN) {
        rotated[y][x] = board[GAME_BOARD_SIZE - 1 - x][y]
      }
    }
  }

  return rotated
}

function restoreBoard(board: GameBoard, dir: MOVE_DIRECTION): GameBoard {
  const restored = generateEmptyBoard()

  for (let y = 0; y < GAME_BOARD_SIZE; y++) {
    for (let x = 0; x < GAME_BOARD_SIZE; x++) {
      if (dir === MOVE_DIRECTION.LEFT) {
        restored[y][x] = board[y][x]
      } else if (dir === MOVE_DIRECTION.RIGHT) {
        restored[y][x] = board[y][GAME_BOARD_SIZE - 1 - x]
      } else if (dir === MOVE_DIRECTION.UP) {
        restored[x][y] = board[y][x]
      } else if (dir === MOVE_DIRECTION.DOWN) {
        restored[GAME_BOARD_SIZE - 1 - x][y] = board[y][x]
      }
    }
  }

  return restored
}
