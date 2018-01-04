// tslint:disable:max-classes-per-file

import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
// tslint:disable-next-line:no-implicit-dependencies
import { connect, Socket } from 'socket.io-client';

import { AppConfig } from '../app.config';
import { Config } from './config';
import { ORIENTATION, TYPE } from './enum';
import { Item } from './item';
import { keyboard } from './keyboard';
import { updatePlayer } from './player';

import { Chunk, Resource } from './interfaces';

const ws = new WebSocket('ws://127.0.0.1:' + AppConfig.PROXY + '/ws');
console.info('Attempt to connect to ' + 'ws://127.0.0.1:' + AppConfig.PROXY + '/ws');

const objects: { [index: number]: PIXI.Sprite} = {};

let itemTex: PIXI.RenderTexture;

const renderChunk = (chunk: Chunk) => {
  let x = 0;
  let y = 0;

  const chunkContainer = new PIXI.Container();

  _.forEach(chunk.data, (row: any) => {
    _.forEach(row, (tile: any) => {
      createTile(chunkContainer, x, y, tile);
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

  main.addChild(chunkContainer);

  // c = chunkContainer
};

let app: PIXI.Application;

let main: PIXI.Container;

const createTile = (container: PIXI.Container, x: number, y: number, tile: any) => {
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

  container.addChild(rectangle);
};



const update = (obj: any, delta: number) => {
  obj.x += obj.vx * delta;
  obj.y += obj.vy * delta;
};

const gameLoop = (delta: number) => {
  _(objects)
    .values()
    .forEach((obj: any) => update(obj, delta));
};

let newItem: Item;
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('dom downloaded');
  app = new PIXI.Application({
    // width: 700,
    // height: 700,
  });

  app.ticker.add(gameLoop);

  main = new PIXI.Container();

  main.position.x = 0;
  main.position.y = 0;
  app.stage.addChild(main);

  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.autoResize = true;
  app.renderer.resize(window.innerWidth, window.innerHeight);

  const aObject = keyboard(65); // a

  let timer: any;
  aObject.press = () => {
    timer = setInterval(() => {
      ws.send(JSON.stringify({
        data: {
          ori: ORIENTATION.WEST,
        },
        message: 'player_move',
      }));
    }, 100);
  };

  aObject.release = () => {
    clearInterval(timer);
  };

  const sObject = keyboard(83); // s

  let timer1: any;
  sObject.press = () => {
    timer1 = setInterval(() => {
      app.stage.position.y -= 5;
    }, 50);
  };

  sObject.release = () => {
    clearInterval(timer1);
  };

  const dObject = keyboard(68); // d

  let timer2: any;
  dObject.press = () => {
    timer2 = setInterval(() => {
      app.stage.position.x -= 5;
    }, 50);
  };

  dObject.release = () => {
    clearInterval(timer2);
  };

  const wObject = keyboard(87); // s

  let timer3: any;
  wObject.press = () => {
    timer3 = setInterval(() => {
      app.stage.position.y += 5;
    }, 50);
  };

  wObject.release = () => {
    clearInterval(timer3);
  };

  document.body.appendChild(app.view);
  newItem = new Item(app, main, objects);
  itemTex = newItem.createItemTex();
});

ws.onopen = () => {
  console.info('socket opened');
  ws.send(JSON.stringify({
    message: 'ready',
  }));
};

ws.onerror = (info: any) => {
  console.log('ERROR', info);
};

ws.onclose = (info: any) => {
  console.log('CLOSE', info);
};

ws.onmessage = (info: any) => {
  const item = JSON.parse(info.data);

  if (item.name === 'Chunk') {
    renderChunk(item);
  } else if (item.name === 'CoalItem') {
    newItem.updateItem(item, itemTex);
  } else if (item.name === 'Player') {
    updatePlayer(app, objects, item, itemTex);
  }
};
