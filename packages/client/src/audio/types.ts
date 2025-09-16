export type SoundType = 'move' | 'merge' | 'newTile' | 'win' | 'lose' | 'combo' | 'milestone';

export interface AudioConfig {
  volume: number;
  enabled: boolean;
}
