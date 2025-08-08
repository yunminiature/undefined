import { useRef, useEffect } from 'react'

import { getTileColor, BG_COLORS } from './colors'
import { CANVAS_CONFIG, FONT_CONFIG } from './constants'

type Props = {
  board: number[][]
}

export const GameBoardCanvas = ({ board }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'

    return { ctx, rect }
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, boardSize: number) => {
    ctx.clearRect(0, 0, boardSize, boardSize)
    ctx.fillStyle = BG_COLORS.board
    ctx.fillRect(0, 0, boardSize, boardSize)
  }

  const drawTile = (
    ctx: CanvasRenderingContext2D,
    cell: number,
    px: number,
    py: number,
    tileSize: number
  ) => {
    if (cell !== 0) {
      const colors = getTileColor(cell)
      ctx.fillStyle = colors.fill
      ctx.beginPath()
      ctx.roundRect(
        px,
        py,
        tileSize,
        tileSize,
        CANVAS_CONFIG.TILE_BORDER_RADIUS
      )
      ctx.fill()

      ctx.fillStyle = colors.text
      const fontSize = Math.max(
        CANVAS_CONFIG.MIN_FONT_SIZE,
        Math.min(
          CANVAS_CONFIG.MAX_FONT_SIZE,
          tileSize / CANVAS_CONFIG.FONT_SIZE_RATIO
        )
      )
      ctx.font = `${FONT_CONFIG.WEIGHT} ${fontSize}px ${FONT_CONFIG.FAMILY}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(cell), px + tileSize / 2, py + tileSize / 2)
    } else {
      ctx.fillStyle = BG_COLORS.emptyTile
      ctx.beginPath()
      ctx.roundRect(
        px,
        py,
        tileSize,
        tileSize,
        CANVAS_CONFIG.TILE_BORDER_RADIUS
      )
      ctx.fill()
    }
  }

  const drawBoard = (
    ctx: CanvasRenderingContext2D,
    board: number[][],
    boardSize: number
  ) => {
    const cellSize = boardSize / board.length
    const padding = CANVAS_CONFIG.PADDING

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const cell = board[y][x]
        const px = x * cellSize + padding
        const py = y * cellSize + padding
        const tileSize = cellSize - padding * 2

        drawTile(ctx, cell, px, py, tileSize)
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const setup = setupCanvas(canvas)

    if (!setup) {
      return
    }

    const { ctx, rect } = setup
    const boardSize = Math.min(rect.width, rect.height)

    drawBackground(ctx, boardSize)
    drawBoard(ctx, board, boardSize)
  }, [board])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full aspect-square border border-border rounded-md bg-background"
    />
  )
}
