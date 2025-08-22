import { useRef, useEffect } from 'react';

import { findChangedTiles, setupCanvas, drawBackground, drawBoard, drawChangedTiles, startAnimation } from './utils';

import { TileMovement } from '@/utils/game';

type Props = {
  board: number[][];
  movements: TileMovement[];
};

type QueuedAnimation = {
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

  const isAnimatingRef = useRef(false);
  const animationQueueRef = useRef<QueuedAnimation[]>([]);

  const processNextAnimation = () => {
    if (animationQueueRef.current.length === 0) {
      isAnimatingRef.current = false;
      return;
    }

    const nextAnimation = animationQueueRef.current.shift();

    if (!nextAnimation) {
      isAnimatingRef.current = false;
      return;
    }

    const changes = findChangedTiles(previousBoardRef.current, nextAnimation.board);

    const queueLength = animationQueueRef.current.length;
    const speedMultiplier = queueLength > 0 ? Math.min(1 + queueLength * 0.5, 3) : 1; // Max 3x speed

    if (changes.length > 0) {
      if (nextAnimation.movements.length > 0) {
        startAnimation(
          nextAnimation.movements,
          canvasContextRef,
          previousBoardRef.current,
          nextAnimation.board,
          () => {
            previousBoardRef.current = nextAnimation.board.map((row) => [...row]);
            processNextAnimation();
          },
          speedMultiplier
        );
      } else {
        if (canvasContextRef.current) {
          const { ctx, boardSize } = canvasContextRef.current;
          drawChangedTiles(ctx, changes, boardSize, nextAnimation.board.length);
        }
        previousBoardRef.current = nextAnimation.board.map((row) => [...row]);
        processNextAnimation();
      }
    } else {
      processNextAnimation();
    }
  };

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

    animationQueueRef.current.push({ board, movements });

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      processNextAnimation();
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
      isAnimatingRef.current = false;
      animationQueueRef.current = [];
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='w-full h-full aspect-square border border-border rounded-md bg-background' />
  );
};
