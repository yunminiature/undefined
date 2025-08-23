import { getTileColor, BG_COLORS } from './colors';
import { CANVAS_CONFIG, FONT_CONFIG, ANIMATION_CONFIG } from './constants';
import { AnimationConfig } from './types';

import { TileMovement } from '@/utils/game';

const isMergedTile = (m: TileMovement): m is TileMovement & { merged: true; mergedValue: number } => {
  return m.merged && m.mergedValue !== undefined;
};

const easeOut = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

const calculateAnimationProgress = (startTime: number, duration: number): number => {
  const currentTime = performance.now();
  const elapsed = currentTime - startTime;
  return Math.min(elapsed / duration, 1);
};

const calculateTileDimensions = (boardSize: number, boardLength: number) => {
  const cellSize = boardSize / boardLength;
  const padding = CANVAS_CONFIG.PADDING;
  const tileSize = cellSize - padding * 2;
  return { cellSize, padding, tileSize };
};

const calculateTilePosition = (x: number, y: number, cellSize: number, padding: number) => {
  const px = x * cellSize + padding;
  const py = y * cellSize + padding;
  return { px, py };
};

export const findChangedTiles = (oldBoard: number[][], newBoard: number[][]) => {
  const changes: Array<{
    x: number;
    y: number;
    oldValue: number;
    newValue: number;
  }> = [];

  for (let y = 0; y < newBoard.length; y++) {
    for (let x = 0; x < newBoard[y].length; x++) {
      const oldValue = oldBoard[y]?.[x] ?? 0;
      const newValue = newBoard[y][x];

      if (oldValue !== newValue) {
        changes.push({ x, y, oldValue, newValue });
      }
    }
  }

  return changes;
};

export const setupCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  const boardSize = Math.min(rect.width, rect.height);
  return { ctx, rect, boardSize };
};

export const drawBackground = (ctx: CanvasRenderingContext2D, boardSize: number) => {
  ctx.clearRect(0, 0, boardSize, boardSize);
  ctx.fillStyle = BG_COLORS.board;
  ctx.fillRect(0, 0, boardSize, boardSize);
};

const drawTile = (ctx: CanvasRenderingContext2D, cell: number, px: number, py: number, tileSize: number, scale = 1) => {
  if (cell !== 0) {
    const colors = getTileColor(cell);
    ctx.fillStyle = colors.fill;

    const centerX = px + tileSize / 2;
    const centerY = py + tileSize / 2;
    const scaledSize = tileSize * scale;
    const scaledX = centerX - scaledSize / 2;
    const scaledY = centerY - scaledSize / 2;

    ctx.beginPath();
    ctx.roundRect(scaledX, scaledY, scaledSize, scaledSize, CANVAS_CONFIG.TILE_BORDER_RADIUS);
    ctx.fill();

    ctx.fillStyle = colors.text;
    const fontSize = Math.max(
      CANVAS_CONFIG.MIN_FONT_SIZE,
      Math.min(CANVAS_CONFIG.MAX_FONT_SIZE, tileSize / CANVAS_CONFIG.FONT_SIZE_RATIO)
    );
    ctx.font = `${FONT_CONFIG.WEIGHT} ${fontSize}px ${FONT_CONFIG.FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(cell), centerX, centerY);
  } else {
    ctx.fillStyle = BG_COLORS.emptyTile;
    ctx.beginPath();
    ctx.roundRect(px, py, tileSize, tileSize, CANVAS_CONFIG.TILE_BORDER_RADIUS);
    ctx.fill();
  }
};

export const drawBoard = (ctx: CanvasRenderingContext2D, board: number[][], boardSize: number) => {
  const { cellSize, padding, tileSize } = calculateTileDimensions(boardSize, board.length);

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const cell = board[y][x];
      const { px, py } = calculateTilePosition(x, y, cellSize, padding);
      drawTile(ctx, cell, px, py, tileSize);
    }
  }
};

export const drawChangedTiles = (
  ctx: CanvasRenderingContext2D,
  changes: Array<{ x: number; y: number; oldValue: number; newValue: number }>,
  boardSize: number,
  boardLength: number
) => {
  const { cellSize, padding, tileSize } = calculateTileDimensions(boardSize, boardLength);

  changes.forEach(({ x, y, newValue }) => {
    const { px, py } = calculateTilePosition(x, y, cellSize, padding);
    drawTile(ctx, newValue, px, py, tileSize);
  });
};

export const drawNewTile = (
  ctx: CanvasRenderingContext2D,
  newTile: { x: number; y: number; value: number },
  boardSize: number,
  boardLength: number
) => {
  const { cellSize, padding, tileSize } = calculateTileDimensions(boardSize, boardLength);
  const { px, py } = calculateTilePosition(newTile.x, newTile.y, cellSize, padding);
  drawTile(ctx, newTile.value, px, py, tileSize);
};

const drawSlidingTile = (
  ctx: CanvasRenderingContext2D,
  movement: TileMovement,
  boardSize: number,
  boardLength: number,
  progress: number
) => {
  const { cellSize, padding, tileSize } = calculateTileDimensions(boardSize, boardLength);

  const easedProgress = easeOut(progress);

  const currentX = movement.oldX + (movement.newX - movement.oldX) * easedProgress;
  const currentY = movement.oldY + (movement.newY - movement.oldY) * easedProgress;

  const { px, py } = calculateTilePosition(currentX, currentY, cellSize, padding);
  drawTile(ctx, movement.value, px, py, tileSize);
};

const drawTileWithMergeAnimation = (
  ctx: CanvasRenderingContext2D,
  cell: number,
  px: number,
  py: number,
  tileSize: number,
  mergeProgress: number
) => {
  if (cell === 0) {
    drawTile(ctx, cell, px, py, tileSize);
    return;
  }

  const scale = 1 + (ANIMATION_CONFIG.MERGE_SCALE - 1) * Math.sin(mergeProgress * Math.PI);
  drawTile(ctx, cell, px, py, tileSize, scale);
};

export const createBoardWithoutMovingTiles = (board: number[][], movements: TileMovement[]): number[][] => {
  const modifiedBoard = board.map((row) => [...row]);

  movements.forEach((movement) => {
    modifiedBoard[movement.oldY][movement.oldX] = 0;
  });

  return modifiedBoard;
};

export const startAnimation = (config: AnimationConfig) => {
  const { movements, canvasContextRef, previousBoard, board, onComplete, speedMultiplier = 1, newTile } = config;

  if (!canvasContextRef.current || movements.length === 0) {
    onComplete();
    return;
  }

  let mergedTiles: Array<{ x: number; y: number; value: number }> = [];

  const animateMovement = () => {
    if (!canvasContextRef.current) {
      return;
    }

    const startTime = performance.now();

    const animate = () => {
      if (!canvasContextRef.current) {
        return;
      }

      const progress = calculateAnimationProgress(startTime, ANIMATION_CONFIG.DURATION / speedMultiplier);

      const { ctx, boardSize } = canvasContextRef.current;

      drawBackground(ctx, boardSize);

      const boardWithoutMovingTiles = createBoardWithoutMovingTiles(previousBoard, movements);
      drawBoard(ctx, boardWithoutMovingTiles, boardSize);

      movements.forEach((movement) => {
        drawSlidingTile(ctx, movement, boardSize, board.length, progress);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        mergedTiles = movements.filter(isMergedTile).map((m) => ({ x: m.newX, y: m.newY, value: m.mergedValue }));

        if (mergedTiles.length > 0) {
          animateMerge();
        } else {
          if (newTile) {
            drawNewTile(ctx, newTile, boardSize, board.length);
          }
          onComplete();
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const animateMerge = () => {
    if (!canvasContextRef.current) {
      return;
    }

    const startTime = performance.now();

    const animate = () => {
      if (!canvasContextRef.current) {
        return;
      }

      const progress = calculateAnimationProgress(startTime, ANIMATION_CONFIG.MERGE_DURATION / speedMultiplier);

      const { ctx, boardSize } = canvasContextRef.current;

      drawBackground(ctx, boardSize);
      drawBoard(ctx, board, boardSize);

      const cellSize = boardSize / board.length;
      const padding = CANVAS_CONFIG.PADDING;
      const tileSize = cellSize - padding * 2;

      mergedTiles.forEach(({ x, y, value }) => {
        const px = x * cellSize + padding;
        const py = y * cellSize + padding;
        drawTileWithMergeAnimation(ctx, value, px, py, tileSize, progress);
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (newTile) {
          drawNewTile(ctx, newTile, boardSize, board.length);
        }
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  };

  animateMovement();
};
