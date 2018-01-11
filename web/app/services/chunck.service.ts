import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

import { Config } from '../config';
import { Chunk } from '../interfaces';
import { TileService } from './tile.service';

export class ChunkService {
  constructor(private main: PIXI.Container, private tileService: TileService) {}

  public render(chunk: Chunk): void {
    let x = 0;
    let y = 0;

    const chunkContainer = new PIXI.Container();

    _.forEach(chunk.data, (row: any) => {
      _.forEach(row, (tile: any) => {
        this.tileService.create(x + chunk.x * 32 * Config.tileSize, y + chunk.y * 32 * Config.tileSize, tile);

        x += Config.tileSize;
      });

      y += Config.tileSize;

      x = 0;
    });

    // chunkContainer.pivot.set(chunkContainer.x, chunkContainer.y)

    chunkContainer.x = chunk.x * 32 * Config.tileSize;
    chunkContainer.y = chunk.y * 32 * Config.tileSize;

    // chunkContainer.pivot.set((chunkContainer.width / 2), (chunkContainer.height / 2))

    // chunkContainer.rotation = Math.PI / 2

    this.main.addChild(chunkContainer);

    // c = chunkContainer
  }
}
