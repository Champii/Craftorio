import { Config } from './config';

export const createPlayer = (app: PIXI.Application, objects: any, item: any, itemTex: PIXI.RenderTexture) => {
  const circle = new PIXI.Sprite(itemTex);
  circle.position.set((item.x * Config.tileSize), (item.y * Config.tileSize));

  const a: any = circle;

  a.vx = 0;
  a.vy = 0;
  app.stage.addChild(circle);
  objects[item.id] = circle;
};

export const updatePlayer = (app: PIXI.Application, objects: any, player: any,  itemTex: PIXI.RenderTexture) => {
  if (objects[player.id] == null) {
    createPlayer(app, objects, player, itemTex);
  }

  const existing = objects[player.id];

  existing.position.set(
    (player.x * Config.tileSize) + app.renderer.width / 2,
    (player.y * Config.tileSize) + app.renderer.height / 2);
  app.stage.position.set(
    (player.x * Config.tileSize) + app.renderer.width / 2,
    (player.y * Config.tileSize) + app.renderer.height / 2);
};
