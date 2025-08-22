import { useRef, useEffect } from 'react';

import { findChangedTiles, setupCanvas, drawBackground, drawBoard, drawChangedTiles, startAnimation } from './utils';

import { TileMovement } from '@/utils/game';

type Props = {
  board: number[][];
  movements: TileMovement[];
};

export const GameBoardCanvas = ({ board, movements }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousBoardRef = useRef<number[][]>([]);
  const canvasContextRef = useRef<{
    ctx: CanvasRenderingContext2D;
    rect: DOMRect;
    boardSize: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    if (!canvasContextRef.current) {
      const setup = setupCanvas(canvas);
      if (!setup) {
        return;
      }

      canvasContextRef.current = setup;
      const { ctx, boardSize } = setup;

      drawBackground(ctx, boardSize);
      drawBoard(ctx, board, boardSize);
      previousBoardRef.current = board.map((row) => [...row]);
      return;
    }

    const { ctx, rect, boardSize: oldBoardSize } = canvasContextRef.current;
    const newBoardSize = Math.min(rect.width, rect.height);

    if (newBoardSize !== oldBoardSize) {
      canvasContextRef.current.boardSize = newBoardSize;
      drawBackground(ctx, newBoardSize);
      drawBoard(ctx, board, newBoardSize);
      previousBoardRef.current = board.map((row) => [...row]);
      return;
    }

    const changes = findChangedTiles(previousBoardRef.current, board);

    if (changes.length > 0) {
      if (movements.length > 0) {
        startAnimation(movements, canvasContextRef, previousBoardRef.current, board, () => {
          previousBoardRef.current = board.map((row) => [...row]);
        });
      } else {
        drawChangedTiles(ctx, changes, oldBoardSize, board.length);
        previousBoardRef.current = board.map((row) => [...row]);
      }
    }
  }, [board]);

  useEffect(() => {
    return () => {
      if (canvasContextRef.current) {
        const { ctx, boardSize } = canvasContextRef.current;
        ctx.clearRect(0, 0, boardSize, boardSize);
      }

      previousBoardRef.current = [];
      canvasContextRef.current = null;
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='w-full h-full aspect-square border border-border rounded-md bg-background' />
  );
};
