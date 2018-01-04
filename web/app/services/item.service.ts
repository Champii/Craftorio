import * as PIXI from 'pixi.js';

import { Config } from '../config';

export class ItemService {
  constructor(private app: PIXI.Application, private main: PIXI.Container, private objects: any) {}

  public createItemTex() {
    const circle = new PIXI.Graphics();
    circle.beginFill(0x9966FF);
    circle.drawCircle(0, 0, Config.tileSize / 2);
    circle.endFill();

    return this.app.renderer.generateTexture(circle);
  }

  public createItem(item: any, itemTex: PIXI.RenderTexture) {
    const circle = new PIXI.Sprite(itemTex);

    circle.position.set((item.x * Config.tileSize), (item.y * Config.tileSize));

    const a: any = circle;
    a.vx = 0;
    a.vy = 0;

    this.main.addChild(circle);

    circle.setParent(this.main);

    this.objects[item.id] = circle;
  }

  public updateItem(item: any, itemTex: PIXI.RenderTexture) {
    if (this.objects[item.id] == null) {
      this.createItem(item, itemTex);
    }

    const existing = this.objects[item.id];
    existing.position.set((item.x * Config.tileSize), (item.y * Config.tileSize));
  }
}
