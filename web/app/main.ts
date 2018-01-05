import * as PIXI from 'pixi.js';

export class Main extends PIXI.Container {
  constructor(x: number, y: number) {
    super();
    this.position.x = x;
    this.position.y = y;
  }
}
