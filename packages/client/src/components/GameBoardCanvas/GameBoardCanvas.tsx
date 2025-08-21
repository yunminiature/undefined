import { useRef, useEffect } from 'react';

import {
  findChangedTiles,
  setupCanvas,
  drawBackground,
  drawTile,
  drawBoard,
  drawChangedTiles,
  drawSlidingTile,
  createBoardWithoutMovingTiles,
} from './utils';
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

  const animationRef = useRef<{
    movement: TileMovement;
    startTime: number;
    isAnimating: boolean;
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
      if (movements.length > 0 && !animationRef.current?.isAnimating) {
        const movement = movements[0];

        animationRef.current = {
          movement: movement,
          startTime: performance.now(),
          isAnimating: true,
        };

        const animate = () => {
          if (!animationRef.current?.isAnimating || !canvasContextRef.current) {
            return;
          }

          const { ctx, boardSize } = canvasContextRef.current;
          const currentTime = performance.now();
          const elapsed = currentTime - animationRef.current.startTime;
          const progress = Math.min(elapsed / 1000, 1);

          drawBackground(ctx, boardSize);

          const boardWithoutMovingTiles = createBoardWithoutMovingTiles(previousBoardRef.current, [
            animationRef.current.movement,
          ]);
          drawBoard(ctx, boardWithoutMovingTiles, boardSize);
          drawSlidingTile(ctx, animationRef.current.movement, boardSize, board.length, progress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            animationRef.current.isAnimating = false;
            drawChangedTiles(ctx, changes, oldBoardSize, board.length);
            previousBoardRef.current = board.map((row) => [...row]);
          }
        };

        requestAnimationFrame(animate);
      } else {
        drawChangedTiles(ctx, changes, oldBoardSize, board.length);
        console.log('update previousBoardRef.current');
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
