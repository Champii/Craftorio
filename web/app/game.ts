
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
// tslint:disable-next-line:no-implicit-dependencies
import { connect, Socket } from 'socket.io-client';
import { Key } from 'ts-keycode-enum';

import { AppConfig } from '../app.config';
import { App } from './app';
import { Config } from './config';
import { ORIENTATION, TYPE } from './enum';
import { Main } from './main';

import { Chunk, Resource } from './interfaces';
import {
  ChunkService,
  GuiService,
  ItemService,
  KeyboardService,
  PlayerService,
  SocketService,
  SpritesService,
  TileService } from './services';

// tslint:disable:object-literal-sort-keys

export class Game {
  private objects: { [index: number]: PIXI.Sprite} = {};

  constructor() {
    document.addEventListener('DOMContentLoaded', this.onLoad.bind(this));
  }

  private update(obj: any, delta: number) {
    obj.x += obj.vx * delta;
    obj.y += obj.vy * delta;
  }
  private gameLoop(delta: number) {
    _(this.objects)
    .values()
    .forEach((obj: any) => this.update(obj, delta));
  }

  private onLoad(event: any) {
    const main = new Main(0, 0);
    const app = new App(this.gameLoop, main);
    const spritesService = new SpritesService(app, () => {

      const guiService = new GuiService(app);
      const tileService = new TileService(app, main, spritesService);
      const chunkService = new ChunkService(main, tileService);
      const playerService = new PlayerService(app, main, this.objects);
      const itemService = new ItemService(app, main, this.objects);
      const itemTex: PIXI.RenderTexture = itemService.createItemTex();

      tileService.createTextures();

      const addr = `ws://${window.location.hostname}:${AppConfig.PROXY}/ws`;

      const socket = new SocketService(
        addr,
        chunkService,
        playerService,
        itemService,
        itemTex);

      const playerSpeed = 10;

      new KeyboardService(Key.A)
      .setAction(() => {
        socket.send(JSON.stringify({
          message: 'player_move',
          data: {
            ori: ORIENTATION.WEST,
          },
        }));
        // app.stage.position.x += playerSpeed;
        // playerService.moveLeft(playerSpeed);
      })
      .setReleaseAction(() => {
        // playerService.idleLeft();
      });

      new KeyboardService(Key.S)
      .setAction(() => {
        socket.send(JSON.stringify({
          message: 'player_move',
          data: {
            ori: ORIENTATION.SOUTH,
          },
        }));
        // app.stage.position.y -= playerSpeed;
        // playerService.moveDown(playerSpeed);
      })
      .setReleaseAction(() => {
        // playerService.idleDown();
      });

      new KeyboardService(Key.D)
      .setAction(() => {
        socket.send(JSON.stringify({
          message: 'player_move',
          data: {
            ori: ORIENTATION.EAST,
          },
        }));
        // app.stage.position.x -= playerSpeed;
        // playerService.moveRight(playerSpeed);
      })
      .setReleaseAction(() => {
        // playerService.idleRight();
      });

      new KeyboardService(Key.W)
      .setAction(() => {
        socket.send(JSON.stringify({
          message: 'player_move',
          data: {
            ori: ORIENTATION.NORTH,
          },
        }));
        // app.stage.position.y += playerSpeed;
        // playerService.moveUp(playerSpeed);
      })
      .setReleaseAction(() => {
        // playerService.idleUp();
      });
      document.body.appendChild(app.view);

      const x = app.renderer.screen.right - app.renderer.screen.right / 2;
      const y = app.renderer.screen.bottom - app.renderer.screen.bottom / 2;

      app.stage.position.set(x, y);

      // app.renderer.screen.left - app.renderer.screen.left / 2,
      // app.renderer.screen.top - app.renderer.screen.top / 2);
    });
  }
}
