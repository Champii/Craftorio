import * as PIXI from 'pixi.js';

import { Config } from '../config';
import {OutlineFilter} from '@pixi/filter-outline';

const colors: number[] = [
  0x44AD44,
  0x333333,
  0xAAAAAA,
  0xDD6565,
  0x898866,
  0,
  0,
  0,
  0xCC3344,
  0x996644,
]

export class TileService {
  public static textures: PIXI.Texture[] = [];
  public static filters: PIXI.Filter<any>[] = [];

  constructor(private app: PIXI.Application, private container: PIXI.Container) {
    TileService.filters.push(new OutlineFilter(2, 0x000000))
  }

  public create(x: number, y: number, tile: any) {
    let sprite: PIXI.Sprite;

    if (tile.machine != null){
      console.log(tile.machine)
      sprite = new PIXI.Sprite(TileService.textures[tile.machine.kind])
    } else if (tile.resources != null) {
      sprite = new PIXI.Sprite(TileService.textures[tile.resources[0].kind])
    } else {
      sprite = new PIXI.Sprite(TileService.textures[0])
    }

    // rectangle.x = x;
    // rectangle.y = y;
    sprite.position.set(x, y);

    sprite.interactive = true
    sprite.on('pointerover', () => {
      // console.log(e)
      sprite.filters = [TileService.filters[0]]
    });
    sprite.on('pointerout', () => {
      // console.log(e)
      sprite.filters = []
    });

    // const a: any = rectangle;
    // a.vx = 0;
    // a.vy = 0;
    this.container.addChild(sprite);
  }

  public createTextures() {
    for (let color of colors) {
      const rectangle = new PIXI.Graphics();
      rectangle.lineStyle(0, 0x000000, 1);
      rectangle.beginFill(color);
      rectangle.drawRect(0, 0, Config.tileSize, Config.tileSize);
      rectangle.endFill();
      TileService.textures.push(this.app.renderer.generateTexture(rectangle))
    }



    // if (tile.machine != null) {
    //   if (tile.machine.name === 'Miner') {
    //     console.log('machine', tile.machine);
    //     rectangle.beginFill(0xCC3344);
    //   } else if (tile.machine.name === 'Roll') {
    //     rectangle.beginFill(0x996644);
    //   }
    // } else if (tile.resources != null) {
    //   switch (tile.resources[0].kind) {
    //     case 1: // COAL
    //     rectangle.beginFill(0x333333);
    //     break;
    //     case 2: // IRON
    //     rectangle.beginFill(0xAAAAAA);
    //     break;
    //     case 3: // COPPER
    //     rectangle.beginFill(0xDD6565);
    //     break;
    //     case 4: // STONE
    //     rectangle.beginFill(0x898866);
    //     break;
    //   }
    // } else {
    //   rectangle.beginFill(0x44AD44);
    // }

    // rectangle.drawRect(0, 0, Config.tileSize, Config.tileSize);
    // rectangle.endFill();

    // TileService.textures.push()
  }
}
