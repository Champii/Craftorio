export class GuiItem {
  constructor(protected app: PIXI.Application,
              protected x: number,
              protected y: number,
              protected w: number,
              protected h: number) {

    const rectangle = new PIXI.Graphics();
    rectangle.lineStyle(1, 0x000000, 1);
    rectangle.beginFill(0x777777);
    rectangle.drawRect(0, 0, this.w, this.h);
    rectangle.endFill();

    rectangle.alpha = 0.5;
    rectangle.x = this.x;
    rectangle.y = this.y;

    this.app.stage.addChild(rectangle);
  }
}
