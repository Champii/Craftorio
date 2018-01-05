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
  ItemService,
  KeyboardService,
  PlayerService,
  SocketService,
  TileService } from './services';

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
    const chunkService = new ChunkService(main);
    const playerService = new PlayerService(app, this.objects);
    const itemService = new ItemService(app, main, this.objects);
    const itemTex: PIXI.RenderTexture = itemService.createItemTex();

    const socket = new SocketService(
      'ws://127.0.0.1:' + AppConfig.PROXY + '/ws',
      chunkService,
      playerService,
      itemService,
      itemTex);

    const playerSpeed = 10;

    new KeyboardService(Key.Q)
      .setAction(() => {
        app.stage.position.x += playerSpeed;
        playerService.moveLeft(playerSpeed);
      })
      .setReleaseAction(() => {
        playerService.idleLeft();
      });

    new KeyboardService(Key.S)
      .setAction(() => {
        app.stage.position.y -= playerSpeed;
        playerService.moveDown(playerSpeed);
      })
      .setReleaseAction(() => {
        playerService.idleDown();
      });

    new KeyboardService(Key.D)
      .setAction(() => {
        app.stage.position.x -= playerSpeed;
        playerService.moveRight(playerSpeed);
      })
      .setReleaseAction(() => {
        playerService.idleRight();
      });

    new KeyboardService(Key.Z)
      .setAction(() => {
        app.stage.position.y += playerSpeed;
        playerService.moveUp(playerSpeed);
      })
      .setReleaseAction(() => {
        playerService.idleUp();
      });
    document.body.appendChild(app.view);
  }
}
