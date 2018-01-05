import * as PIXI from 'pixi.js';

import { Config } from '../config';

export class TileService {
  constructor(private container: PIXI.Container) {}

  public create(x: number, y: number, tile: any) {
    const rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1, 0x000000, 1);

    if (tile.machine != null) {
      if (tile.machine.name === 'Miner') {
        console.log('machine', tile.machine);
        rectangle.beginFill(0xCC3344);
      } else if (tile.machine.name === 'Roll') {
        rectangle.beginFill(0x55AA44);
      }
    } else if (tile.resources != null) {
      rectangle.beginFill(0x222222);
    } else {
      rectangle.beginFill(0x444444);
    }

    rectangle.drawRect(0, 0, Config.tileSize, Config.tileSize);
    rectangle.endFill();
    rectangle.x = x;
    rectangle.y = y;

    const a: any = rectangle;
    a.vx = 0;
    a.vy = 0;

    this.container.addChild(rectangle);
  }
}
