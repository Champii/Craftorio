import { Tile } from './tile.interface';

export interface Chunk {
  x: number;
  y: number;
  data: Tile[];
  name: string;
}
