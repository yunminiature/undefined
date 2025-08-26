import { TileMovement } from '@/utils/game';

export type AnimationConfig = {
  movements: TileMovement[];
  canvasContextRef: React.RefObject<{
    ctx: CanvasRenderingContext2D;
    rect: DOMRect;
    boardSize: number;
  } | null>;
  previousBoard: number[][];
  board: number[][];
  onComplete: () => void;
  speedMultiplier?: number;
  newTile?: { x: number; y: number; value: number };
};
