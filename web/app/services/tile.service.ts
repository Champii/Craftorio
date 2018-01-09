import * as PIXI from 'pixi.js';

import { Config } from '../config';

export class TileService {
  constructor(private container: PIXI.Container) {}

  public create(x: number, y: number, tile: any) {
    const rectangle = new PIXI.Graphics();
    rectangle.lineStyle(0, 0x000000, 1);

    if (tile.machine != null) {
      if (tile.machine.name === 'Miner') {
        console.log('machine', tile.machine);
        rectangle.beginFill(0xCC3344);
      } else if (tile.machine.name === 'Roll') {
        rectangle.beginFill(0x996644);
      }
    } else if (tile.resources != null) {
      switch (tile.resources[0].kind) {
        case 1: // COAL
        rectangle.beginFill(0x333333);
        break;
        case 2: // IRON
        rectangle.beginFill(0xAAAAAA);
        break;
        case 3: // COPPER
        rectangle.beginFill(0xDD6565);
        break;
        case 4: // STONE
        rectangle.beginFill(0x898866);
        break;
      }
    } else {
      rectangle.beginFill(0x44AD44);
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
