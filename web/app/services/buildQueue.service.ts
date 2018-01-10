import { Config } from '../config';

class GuiItem {
  constructor(protected app: PIXI.Application, protected x: number, protected y: number, protected w: number, protected h: number) {

    const rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1, 0x000000, 1);
    rectangle.beginFill(0x777777);
    rectangle.drawRect(0, 0, this.w, this.h);
    rectangle.endFill();

    rectangle.alpha = 0.5
    rectangle.x = this.x
    rectangle.y = this.y

    this.app.stage.addChild(rectangle);
  }
}

export class BuildQueueService extends GuiItem{
  constructor(protected app: PIXI.Application) {
    super(app,
      -app.renderer.screen.width / 2,
      app.renderer.screen.height / 2 - 200,
      200,
      200)
  }

}

export class InventoryService extends GuiItem{
  constructor(protected app: PIXI.Application) {
    super(app,
      app.renderer.screen.width / 2 - 400,
      app.renderer.screen.height / 2 - 400,
      400,
      400)
  }

}
export class MinimapService extends GuiItem{
  constructor(protected app: PIXI.Application) {
    super(app,
      app.renderer.screen.width / 2 - 200,
      -app.renderer.screen.height / 2,
      200,
      200)
  }

}
