import { ORIENTATION } from '../enum';

export interface SpriteItem {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation?: ORIENTATION;
}
